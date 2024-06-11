const router = require("express").Router();
const { booking_controller } = require("../controllers");
const userAuth = require("../middlewares/auth_middleware");
const check_owner_role = require("../middlewares/check_owner_role");
const date_validation_middleware=require("../middlewares/date_validation_middleware")
const { limiter } = require("../libs/constants/server_constants");
router.post(
  "/",
  limiter,
  userAuth,
date_validation_middleware,
  booking_controller.add_booking
);
router.get("/", limiter, userAuth, booking_controller.get_all_bookings);
router.patch(
  "/:booking_id",
  userAuth,
  check_owner_role,
  booking_controller.update_booking_status
);
module.exports = router;
