const express_rate_limit = require("express-rate-limit");
const Mailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
exports.BAD_REQUEST = 400;
exports.NOT_FOUND = 404;
exports.CONFLICT = 409;
exports.INTERNAL_SERVER_ERROR = 500;
exports.UNAUTHORIZED = 401;
exports.NO_CONTENT = 204;

exports.limiter = express_rate_limit({
  windowMs: 45 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file?.fieldname + "-" + Date.now() + path.extname(file?.originalname)
      );
    },
  });
exports.upload = multer({ storage: storage });