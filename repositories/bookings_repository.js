const { bookings_model } = require("../models");
const { base_repository } = require("./base_repository");
class bookings_repository extends base_repository {
  constructor(payload) {
    super(payload);
  }

  async add_booking(payload) {
    const response = await this.create(payload);
    return response;
  }
  
  async get_all_bookings( page = 1, limit = 10,filter_obj={},sort) {
    const { 
        hotel_id,
        user_id,
        status,
      uuid}=filter_obj;
    const criteria = {
      ...(status && { status }),
      ...(hotel_id && { hotel_id }),
      ...(user_id && { user_id }),
      ...(uuid && { uuid })
  };
  
    const options = { skip:(page-1)*limit, limit,sort:sort==="latest"?{created_at:-1}:{}};
    const response = await this.find_all(criteria, {}, options);
   
    return response;
}


async update_booking_status(booking_id, payload) {
  const criteria = { uuid: booking_id};
  const update = { $set: {} };
  if (payload?.status) update.$set.status = payload?.status;
  const response = await this.update_one(criteria, update, {
    new: true,
    runValidators: true,
  });
  return response;
}

  }


module.exports = {
bookings_repository: new bookings_repository({ model: bookings_model }),
};
