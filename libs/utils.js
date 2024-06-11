
const {
  bad_request,
  not_found,
  conflict,
  no_content,
} = require("../libs/error");
const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
} = require("./constants/server_constants");
const mongoose = require("mongoose");

exports.error_handler = (error) => {
  switch (true) {
    case error instanceof mongoose.Error.ValidationError:
      error.message = get_error_message(error);
      return BAD_REQUEST;
    case error.code === 11000 || error.code === 11001:
      error.message = get_error_message(error);
      return CONFLICT;
    case error instanceof bad_request:
      return BAD_REQUEST;
    case error instanceof not_found:
      return NOT_FOUND;
    case error instanceof no_content:
      return NO_CONTENT;
    case error instanceof conflict:
      return CONFLICT;
    default:
      return INTERNAL_SERVER_ERROR;
  }
};

const get_error_message = (error) => {
  for (let field in error.errors) {
    if (error?.errors[field]?.message) return error?.errors[field]?.message;
  }
  return error?.message || "Something went wrong";
};
exports.validate_enums = (value, fieldName, validValues) => {
  if (!validValues.includes(value)) {
    throw new bad_request(`Invalid value for ${fieldName}: ${value}`);
  }
};

exports.validate_array_enums = (values, fieldName, validValues) => {
  for (const value of values) {
    if (!validValues.includes(value)) {
      throw new bad_request(`Invalid value for ${fieldName}: ${value}`);
    }
  }
};

exports.generate_mail_options = (email,subject,html_content) => {
    return {
      from: "amanjot.1136@zenmonk.tech", 
      to: [email], 
      subject: subject, 
      html: html_content,
    };
  };

