const { request } = require("http");
const { redis_client } = require("../libs/redis");

const { no_content, not_found } = require("../libs/error");
const { error_handler } = require("../libs/utils");
const { hotel_services } = require("../services");

exports.add_image = async (req, res) => {
  try {

    const response = await hotel_services.add_images({ params: req.params, data: req.files});
    if (!response) throw new Error("Images could not be added.");

    return res.status(201).json({ response });
  } catch (error) {
    console.error("Error in adding images controller:", error);
    res.status(error_handler(error)).json({ error: error.message });
  }
};
exports.add_hotel = async (req, res) => {
  try {
    const response = await hotel_services.add_hotel({ data: req.body });
    if (!response) throw new Error("hotel could not be created.");
    return res.status(201).json({ response });
  } catch (error) {
    console.log("error in create hotel controller", error);
    res.status(error_handler(error)).json({ error: error.message });
  }
};

exports.get_all_hotels = async (req, res) => {
  try {
    
    const cacheKey = JSON.stringify(req.query) || "all_hotels";

    const cachedData = await redis_client.get(cacheKey);
    if (cachedData) {
      console.log("Serving from Redis Cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    const response = await hotel_services.get_all_hotels({ query: req.query });
    if (!response) throw new no_content("hotels could not be found.");

  
    await redis_client.set(cacheKey, JSON.stringify(response), { EX: 300 }); 

    return res.status(200).json(response);
  } catch (error) {
    console.log("error in get all hotels controller", error);
    res.status(error_handler(error)).json({ error: error.message });
  }
};

exports.update_hotel_status = async (req, res) => {
  try {
    const response = await hotel_services.update_hotel_status({
      params: req.params,
      data: req.body,
    });
    if (!response) throw new Error("hotel_status could not be updated.");
    res.status(200).json(response);
  } catch (error) {
    console.log("error in update hotel_status controller", error);
    res.status(error_handler(error)).json({ error: error.message });
  }
};

exports.update_hotel = async (req, res) => {
  try {
    const response = await hotel_services.update_hotel({
      params: req.params,
      data: req.body,
    });
    if (!response) throw new Error("hotel_status could not be updated.");
    res.status(200).json(response);
  } catch (error) {
    console.log("error in update hotel_status controller", error);
    res.status(error_handler(error)).json({ error: error.message });
  }
};
