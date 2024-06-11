const router = require("express").Router();
router.use("/hotels", require("./hotel_router"));
router.use("/users", require("./user_router"));
router.use("/bookings", require("./booking_router"));
module.exports = router;
