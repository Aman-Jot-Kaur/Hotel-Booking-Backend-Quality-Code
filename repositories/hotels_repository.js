const { hotels_model } = require("../models");
const { base_repository } = require("./base_repository");
class hotels_repository extends base_repository {
  constructor(payload) {
    super(payload);
  }

  async add_hotel(payload) {
    const response = await this.create(payload);
    return response;
  }
  async get_hotel_by_uuid(hotel_id) {
    const criteria = { uuid: hotel_id, deleted_at: null };
    const response = await this.find_one(criteria);
    return response;
  }
  async get_all_hotels( page = 1, limit = 10,filter_obj={},sort) {
    const { 
      status,
      name,
      location,
      rooms_available,
      room_types,
      start_price_range,
    end_price_range,
      uuid}=filter_obj;
    const criteria = {
      ...(name && { name:{ $regex: name, $options: "i" } }),
      ...(status && { status }),
      ...(location && { location:{ $regex: location, $options: "i" } }),
      ...(rooms_available && { rooms_available: { $gte: rooms_available}}),
      ...(start_price_range && { full_day_price: { $gte: start_price_range}}),
      ...(end_price_range && { full_day_price: { $lte: end_price_range}}),
      ...(room_types && { room_types:{ $room_types: name, $options: "i" } }),
      ...(uuid && { uuid })
  };
  
    const options = { skip:(page-1)*limit, limit,sort:sort==="highToLow"?{full_day_price:-1}:{full_day_price:1}};
    const response = await this.find_all(criteria, {}, options);
   
    return response;
}


async update_hotel_status(hotel_id, payload) {
  const criteria = { uuid: hotel_id};
  const update = { $set: {} };
  if (payload?.status) update.$set.status = payload?.status;
  const response = await this.update_one(criteria, update, {
    new: true,
    runValidators: true,
  });
  return response;
}
async add_images(hotel_id, images) {
  const criteria = { uuid: hotel_id };
  const update = { $push: { images: { $each: images } } }; 
  const options = { new: true, runValidators: true };

  const response = await this.update_one(criteria, update, options);
  return response;
}
async update_hotel(hotel_id, payload) {
  const criteria = { uuid: hotel_id};
  const update = { $set: {} };
  //names, contact,location, rooms_available,room_types,amenities
  if (payload?.name) update.$set.name = payload?.name;
  if (payload?.contact) update.$set.contact = payload?.contact;
  if (payload?.location) update.$set.location = payload?.location;
  if (payload?.rooms_available) update.$set.rooms_available = payload?.rooms_available;
  if (payload?.room_types) update.$set.room_types = payload?.room_types;
  if (payload?.amenities) update.$set.amenities = payload?.amenities;
  if (payload?.image) update.$set.amenities = payload?.image;
  const response = await this.update_one(criteria, update, {
    new: true,
    runValidators: true,
  });
  return response;
}
}
module.exports = {
hotels_repository: new hotels_repository({ model: hotels_model }),
};
