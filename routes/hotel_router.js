const router = require("express").Router();
const { hotel_controller } = require("../controllers");
const multer = require("multer");
const path = require("path");
const { upload } = require("../libs/constants/server_constants");
const userAuth = require("../middlewares/auth_middleware");
const check_admin_role = require("../middlewares/check_admin_role");
const check_owner_role = require("../middlewares/check_owner_role");

router.post("/", userAuth, check_owner_role, hotel_controller.add_hotel);
router.get("/", userAuth, hotel_controller.get_all_hotels);
router.patch(
  "/:hotel_id",
  userAuth,
  check_owner_role,
  hotel_controller.update_hotel
);
router.patch(
  "/status/:hotel_id",
  userAuth,
  check_admin_role,
  hotel_controller.update_hotel_status
);
router.post(
  "/uploads/:hotel_id",
  upload.array("files"),
  hotel_controller.add_image
);
// router.get("/uploads",()=>{console.log(path.join(__dirname,"../","uploads/","files-1709546962260.png"))});
//update hotel api is pending update
// checkRole("hotel_owner") MIDDLEWARE
module.exports = router;
