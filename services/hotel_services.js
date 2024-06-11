const { hotels_repository } = require("../repositories/hotels_repository");
const {  not_found, bad_request } = require("../libs/error");
exports.add_hotel = async (payload) => {
  const { name,location,contact,half_day_price,full_day_price,amenities,room_types,rooms_available } = payload.data;
  const hotel = { name,location,contact,half_day_price,full_day_price,amenities,room_types,rooms_available };
  const response = await hotels_repository.add_hotel(hotel);
  return response;
};
exports.get_hotel = async (payload) => {
  const { hotel_id } = payload?.params || {};
  if(!hotel_id) {throw new bad_request("hotel id required")};
  const hotel = await hotels_repository.get_hotel_by_uuid(hotel_id);
  if (!hotel) throw new not_found("hotel not found");
  return hotel;
};
exports.get_all_hotels = async (payload) => {
  const {
    hotel_id,
    page,
    limit,
    status,
    name,
    location,
    rooms_available,
    room_types,
    start_price_range,
    end_price_range,
    sort,
  } = payload?.query;
  const filter_obj = {
    status,
    name,
    location,
    rooms_available,
    room_types,
    uuid: hotel_id,
    start_price_range,
    end_price_range,
  };

  const hotels = await hotels_repository.get_all_hotels(
    page,
    limit,
    filter_obj,
    sort
  );
  return { length: hotels.length, hotels };
};


exports.update_hotel_status= async (payload) => {
  const {hotel_id } = payload?.params || {};
  const response = await hotels_repository.update_hotel_status(hotel_id,payload.data);
  if (!response) throw new not_found("hotel not found");
  return response;
}

exports.add_images = async (payload ) => {
  const {hotel_id}= payload?.params || {};
  const images = payload?.data?.map(file => file.filename); 
  console.log(hotel_id, images);
  console.log(payload)
  if (!images || images.length === 0) {
    throw new not_found("Images are required");
  }

  const response = await hotels_repository.add_images(hotel_id, images);
  if (!response) throw new not_found("Hotel not found");

  return response;
};

exports.update_hotel= async (payload) => {
  const {hotel_id } = payload?.params || {};
  console.log("hotel id in update_hotel", hotel_id);
  const response = await hotels_repository.update_hotel(hotel_id,payload.data);
  if (!response) throw new not_found("hotel not found");
  return response;
}