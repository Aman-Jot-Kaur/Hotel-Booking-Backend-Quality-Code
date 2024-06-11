// @ts-nocheck
const { bookings_repository } = require("../repositories/bookings_repository");
const { no_content, not_found, bad_request } = require("../libs/error");
const { error_handler, generate_mail_options } = require("../libs/utils");
const { hotels_repository } = require("../repositories/hotels_repository");
const { users_repository } = require("../repositories/users_repository");
const {transportar}=require("../libs/constants/mailer_constants");
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer);

exports.add_booking = async (payload) => {
  const { to, from, room_type, number_of_rooms, hotel_id, user_id } =
    payload.data;
    const check_hotel = await hotels_repository.get_hotel_by_uuid(
     hotel_id
    );

    if (check_hotel === null) {
      throw new not_found("hotel could not be found.");
      return;
    }
  const booking = { to, from, room_type, number_of_rooms, hotel_id, user_id };
  const response = await bookings_repository.add_booking(booking);
  
  if(response){
    this.send_notification({hotel_id,user_id,booking_id:response.uuid})
  }
  return response;
};

exports.get_all_bookings = async (payload) => {
  const { booking_id, page, limit, hotel_id, user_id, status, sort } =
    payload?.query;
  const filter_obj = {
    hotel_id,
    user_id,
    status,
    uuid: booking_id,
  };

  const bookings = await bookings_repository.get_all_bookings(
    page,
    limit,
    filter_obj,
    sort
  );
  return { length: bookings.length, bookings };
};

exports.update_booking_status = async (payload) => {
  const { booking_id } = payload?.params || {};
  const response = await bookings_repository.update_booking_status(
    booking_id,
    payload.data
  );
  if (!response) throw new not_found("booking not found");
  return response;
};

exports.send_confirmatory_mail = async (user_id) => {
  try {
    const user = await users_repository.get_user_by_uuid(user_id);

    const email = user.email;
    if (!user) throw new not_found("User not found");
 
    const mail_options= generate_mail_options(user.email,"Email Subjects","<h1>Welcome Receiver</h1><p>this is your booking confirmation</p>");
    
    transportar.sendMail(mail_options).then(console.log("mail sent"));
  } catch (error) {
    console.log("error sending mail " + error);
  }
};

exports.send_notification= async (payload) => {
  try {
    const { hotel_id, user_id,booking_id } = payload;
    console.log(hotel_id + ": " + user_id)
    const check_hotel = await hotels_repository.get_hotel_by_uuid(hotel_id);
    if (!check_hotel) {
      throw new Error("Hotel not found");
    }
    io.to('hotel_' + hotel_id).emit("booking_notification", { text: `New booking added with ID ${booking_id}` });
    io.to('user_' + user_id).emit("booking_confirmation", { text: `Your booking with ID ${booking_id} has been confirmed` });
    console.log("The notification has been sent for booking: ", booking_id);
    
    return { message: "Booking added successfully" };
  } catch (error) {
    console.error("Error adding booking:", error);
    throw error;
  }
}
