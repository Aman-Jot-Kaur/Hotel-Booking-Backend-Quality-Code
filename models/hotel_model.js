const { Schema, model } = require("mongoose");
const { randomUUID } = require("crypto");
const { bad_request } = require("../libs/error");
const {valid_rooms_values,valid_status_values,valid_amenity_values}= require("../libs/constants/hotel_constants");
const {validate_enums,validate_array_enums}= require("../libs/utils")
// hotel schema:
// uuid
// name req
// location req
//status
// contact req
// half_day_price
// full_day_price req
// amenities
// room_types(array of string)
// hotel images(not added yet, will add later)
// rooms_available req
const hotel_schema = new Schema(
  {
    name: {
      type: String,
      requied: true,
    },
    uuid: {
      type: String,
      unique: true,
      default: randomUUID,
    },
    location: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum:valid_status_values ,
      default: "pending",
    },
    amenities: {
      type: [String],
      enum: valid_amenity_values
    },
    contact: {
      type: String,
      required: true,
    },
    room_types:{
      type: [String],
      enum: valid_rooms_values
    },
    half_day_price:{
      type:Number
    },
    full_day_price:{
      type:Number,
      required: true
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    rooms_available:{
      type:Number,
      required: true
    }, 
    images: {
     type: [String]
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
hotel_schema.pre("save", async function (next) {
  if (!this.isModified()) return;
  if (!this.name) throw new bad_request("name is required");
  if (!this.contact) throw new bad_request("contact is required");
  if (!this.location) throw new bad_request("location is required");
  if (!this.full_day_price) throw new bad_request("full day price is required");
  if (!this.rooms_available) throw new bad_request("rooms available is required");
  if (this.amenities) {
    validate_array_enums(this.amenities, 'amenity', valid_amenity_values);
  }
  if (this.room_types) {
    validate_array_enums(this.room_types, 'room',valid_rooms_values);
  }
  if (this.status) {
    validate_enums(this.status, 'status',valid_status_values);
  }
 

  next();
});

hotel_schema.pre("findOneAndUpdate", function (next) {
  const hotel_id = this.getQuery();
  if (!hotel_id) {
    console.log(hotel_id);
    throw new bad_request("hotel id is required");
  }
 
  next();
});



module.exports = model("hotels", hotel_schema);
