const { hotels_model } = require("../models");
const { base_repository } = require("./base_repository");
const { redis_client } = require("../libs/redis");
const crypto = require('crypto');

class hotels_repository extends base_repository {
  constructor(payload) {
    super(payload);
  }

  // Generate consistent cache key for queries
  #generateCacheKey(filter_obj = {}, page = 1, limit = 10, sort = null) {
    const cacheObject = {
      page,
      limit,
      sort,
      ...filter_obj
    };
    
    // Create stable string representation
    const stableString = JSON.stringify(cacheObject, Object.keys(cacheObject).sort());
    return `hotels:${crypto.createHash('md5').update(stableString).digest('hex')}`;
  }

  async add_hotel(payload) {
    const response = await this.create(payload);
    // Clear all hotel listings cache when new hotel is added
    await redis_client.del(await redis_client.keys('hotels:*'));
    return response;
  }

  async get_hotel_by_uuid(hotel_id) {
    const cacheKey = `hotel:${hotel_id}`;
    
    // Try cache first
    try {
      const cachedData = await redis_client.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (err) {
      console.error('Redis error:', err);
    }

    const criteria = { uuid: hotel_id, deleted_at: null };
    const response = await this.find_one(criteria);
    
    if (response) {
      // Cache for 10 minutes
      await redis_client.set(cacheKey, JSON.stringify(response), { EX: 600 });
    }
    
    return response;
  }

  async get_all_hotels(page = 1, limit = 10, filter_obj = {}, sort = null) {
    const cacheKey = this.#generateCacheKey(filter_obj, page, limit, sort);
    
    // Try cache first
    try {
      const cachedData = await redis_client.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (err) {
      console.error('Redis error:', err);
    }

    // Build query criteria
    const { 
      status,
      name,
      location,
      rooms_available,
      room_types,
      start_price_range,
      end_price_range,
      uuid
    } = filter_obj;

    const criteria = {
      ...(name && { name: { $regex: name, $options: "i" } }),
      ...(status && { status }),
      ...(location && { location: { $regex: location, $options: "i" } }),
      ...(rooms_available && { rooms_available: { $gte: rooms_available } }),
      ...(start_price_range && { full_day_price: { $gte: start_price_range } }),
      ...(end_price_range && { full_day_price: { $lte: end_price_range } }),
      ...(room_types && { room_types: { $in: Array.isArray(room_types) ? room_types : [room_types] } }),
      ...(uuid && { uuid }),
      deleted_at: null
    };

    const options = { 
      skip: (page - 1) * limit, 
      limit,
      sort: sort === "highToLow" ? { full_day_price: -1 } : { full_day_price: 1 }
    };

    const response = await this.find_all(criteria, {}, options);
    
    // Cache for 5 minutes (300 seconds)
    if (response) {
      await redis_client.set(cacheKey, JSON.stringify(response), { EX: 300 });
    }
    
    return response;
  }

  async update_hotel_status(hotel_id, payload) {
    const criteria = { uuid: hotel_id };
    const update = { $set: {} };
    
    if (payload?.status) update.$set.status = payload?.status;
    
    const response = await this.update_one(criteria, update, {
      new: true,
      runValidators: true,
    });

    // Clear relevant caches
    if (response) {
      await redis_client.del(`hotel:${hotel_id}`);
      await redis_client.del(await redis_client.keys('hotels:*'));
    }
    
    return response;
  }

  async add_images(hotel_id, images) {
    const criteria = { uuid: hotel_id };
    const update = { $push: { images: { $each: images } } };
    const options = { new: true, runValidators: true };

    const response = await this.update_one(criteria, update, options);
    
    // Clear relevant caches
    if (response) {
      await redis_client.del(`hotel:${hotel_id}`);
      await redis_client.del(await redis_client.keys('hotels:*'));
    }
    
    return response;
  }

  async update_hotel(hotel_id, payload) {
    const criteria = { uuid: hotel_id };
    const update = { $set: {} };

    // Update fields
    if (payload?.name) update.$set.name = payload?.name;
    if (payload?.contact) update.$set.contact = payload?.contact;
    if (payload?.location) update.$set.location = payload?.location;
    if (payload?.rooms_available) update.$set.rooms_available = payload?.rooms_available;
    if (payload?.room_types) update.$set.room_types = payload?.room_types;
    if (payload?.amenities) update.$set.amenities = payload?.amenities;
    if (payload?.image) update.$set.image = payload?.image;

    const response = await this.update_one(criteria, update, {
      new: true,
      runValidators: true,
    });

    // Clear relevant caches
    if (response) {
      await redis_client.del(`hotel:${hotel_id}`);
      await redis_client.del(await redis_client.keys('hotels:*'));
    }
    
    return response;
  }
}

module.exports = {
  hotels_repository: new hotels_repository({ model: hotels_model }),
};