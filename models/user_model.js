const { Schema, model,mongoose } = require("mongoose");
const { randomUUID } = require("crypto");
const { bad_request } = require("../libs/error");
const uuid_validator = require("uuid-validate");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
// user:
// uuid
// email
// password
// role
const user_schema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: randomUUID,
    },
    role: {
      type: String,
      enum: ["admin", "user", "hotel_owner"],
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: [true, "Email already exists"],
      validate: [validator.isEmail, "Email is not valid"],
    },
    password: {
      type: String,
      require: true,
      minLength: [6, "Password must be at least 6 characters"],
      select: true,
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
user_schema.pre("save", async function (next) {
  if (!this.isModified()) return;
  const encrypt = await bcrypt.genSalt(10);
  if (!this.role) throw new bad_request("Role is required");
  if (!this.email) throw new bad_request("Email is required");
  if (!this.password) throw new bad_request("Password is required");
  this.password = await bcrypt.hash(this.password, encrypt);
  next();
});
user_schema.methods.createJWT = async function () {
  return jwt.sign({ user_id: this.uuid }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
};
//compare password
user_schema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};
//check that user id is given and valid before executing update function
user_schema.pre("findOneAndUpdate", function (next) {
  const user_id = this.getQuery();
  if (!user_id) {
    throw new bad_request("User id is required");
  }
  
  next();
});



module.exports = model("users", user_schema);
