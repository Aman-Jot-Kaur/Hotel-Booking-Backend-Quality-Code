const moment = require("moment");
const { Schema, model } = require("mongoose");
const { randomUUID } = require("crypto");
const { bad_request } = require("../libs/error");
const uuid_validator = require("uuid-validate");
const validator = require("validator");

const booking_schema = new Schema(
  {
    to: {
      type: Date,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: randomUUID,
    },
    room_type: {
      type: String
    },
    from: {
      type: Date,
      required: true,
    },
    number_of_rooms: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ["upcoming", "completed"],
      default: "upcoming",
    },
    user_id: {
      type: String,
      required: true
    },
    hotel_id: {
      type: String,
      required: true
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
      },
    },
  }
);

booking_schema.pre("save", async function (next) {
  if (!this.isModified()) return;
  if (!this.user_id) throw new bad_request("booking user id is required");
  if (!this.hotel_id) throw new bad_request("booking hotel name is required");
  if (!this.from) throw new bad_request("start date is required");
  if (!this.to) throw new bad_request("end date is required");
  if (!this.hotel_id) throw new bad_request("hotel id is required");

  const end_date = moment(this.to, "MM/DD/YYYY", true);
  const start_date = moment(this.from, "MM/DD/YYYY", true);

  if (!end_date.isValid() || !start_date.isValid()) {
    throw new bad_request("Invalid date format for 'to' or 'from' fields");
  }

  if (!end_date.isAfter(start_date)) {
    throw new bad_request("'To' date must be greater than 'From' date");
  }

  this.to = end_date.toISOString();
  this.from = start_date.toISOString();


  if (!this.constructor.schema.path("status").enumValues.includes(this.status)) {
    throw new bad_request(`Invalid value for status: ${this.status}`);
  }

  next();
});

booking_schema.pre("findOneAndUpdate", function (next) {
  const bookingId = this.getQuery();
  if (!bookingId) {
    throw new bad_request("booking id is required");
  }
  next();
});

module.exports = model("bookings", booking_schema);
