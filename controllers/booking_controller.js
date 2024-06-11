const { request } = require("http");
const { no_content, not_found } = require("../libs/error");
const { error_handler } = require("../libs/utils");
const { transportar } = require("../libs/constants/server_constants");
const { booking_services } = require("../services");
exports.get_all_bookings = async (req, res) => {
  try {
    req.query.user_id = req.user.user_id;
    console.log(req.query.user_id, "user id while getting all bookings");
    const response = await booking_services.get_all_bookings({
      query: req.query,
    });
    if (!response) throw new no_content("bookings could not be found.");
    return res.status(200).json(response);
  } catch (error) {
    console.log("error in get all bookings controller", error);
    res.status(error_handler(error)).json({ error: error.message });
  }
};

exports.update_booking_status = async (req, res) => {
  try {
    const response = await booking_services.update_booking_status({
      params: req.params,
      data: req.body,
    });
    if (!response) throw new Error("booking_status could not be updated.");
    res.status(200).json(response);
  } catch (error) {
    console.log("error in update booking_status controller", error);
    res.status(error_handler(error)).json({ error: error.message });
  }
};



exports.add_booking = async (req, res) => {
  try {
    req.body.user_id = req.user.user_id;
    req.body.hotel_id = req.query.hotel_id;
    const response = await booking_services.add_booking({ data: req.body });
    if (!response) throw new Error("booking could not be created.");
    if (response) {
       booking_services.send_confirmatory_mail(req.user.user_id);
    }
    return res.status(201).json({ response });
  } catch (error) {
    console.log("error in create booking controller", error);
    if (error.message.includes("Invalid date format")) {
      return res.status(400).json({ error: "Invalid date format for 'to' or 'from' fields" });
    }
    res.status(error_handler(error)).json({ error: error.message });
  }
};
