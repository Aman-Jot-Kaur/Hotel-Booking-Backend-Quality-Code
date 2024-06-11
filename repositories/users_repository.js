// @ts-nocheck
const { users_model } = require("../models");
const { base_repository } = require("./base_repository");
class users_repository extends base_repository {
  constructor(payload) {
    super(payload);
  }

  async add_user(payload) {
    const response = await this.create(payload);
    response.token = await response.createJWT();
    return response;
  }
  async get_user_by_uuid(user_id) {
    const criteria = { uuid: user_id, deleted_at: null };
    const response = await this.find_one(criteria);
    return response;
  }
  async update_user(user_id, payload) {
    const criteria = { uuid: user_id, deleted_at: null };
    const update = { $set: {} };
    if (payload?.role) update.$set.name = payload?.role;
    if (payload?.password) update.$set.password = payload?.password;
    if (payload?.email) update.$set.location = payload?.email;
    const response = await this.update_one(criteria, update, {
      new: true,
      runValidators: true,
    });
    return response;
  }

  async delete_user(user_id) {
    const criteria = { uuid: user_id, deleted_at: null };
    const update = { deleted_at: new Date() };
    const options = { new: true };
    const response = await this.update_one(criteria, update, options);
    return response;
  }

  async login_user(email, password) {
    const criteria = { email, deleted_at: null };
    const user = await users_model.findOne(criteria).select("+password");//select means to hide the password field in response
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      const token= await user.createJWT();
      user.password = undefined;
       return {user,token};
    }
    return null;
  }
}
module.exports = {
  users_repository: new users_repository({ model: users_model }),
};
