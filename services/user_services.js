const {users_repository}=require("../repositories/users_repository")
const { no_content, not_found,bad_request } = require("../libs/error");
const { error_handler } = require("../libs/utils");
exports.add_user = async (payload) => {
    const { role,email,password} = payload.data;
    const user={role,email,password}
    const response = await users_repository.add_user(user);
    return response;
  };
exports.get_user= async (payload) => {
  const {user_id } = payload?.params || {};
  const user = await users_repository.get_user_by_uuid(user_id);
  if (!user) throw new not_found("User not found");
  return user;
}
exports.update_user= async (payload) => {
  const {user_id } = payload?.params || {};
  const response = await users_repository.update_user(user_id,payload.data);
  if (!response) throw new not_found("User not found");
  return response;
}
exports.delete_user= async (payload) => {
  const {user_id } = payload?.params || {};
  const user = await users_repository.delete_user(user_id);
  if (!user) throw new not_found("User not found");
  return { message: "User deleted successfully" };
}

exports.login_user= async (payload) => {
  const {email}=payload?.data;
  const {password}=payload?.data;
  if(!email || !password){
    throw new bad_request("Email and password are required");
  }
  const login_response=await users_repository.login_user(email,password);
  if(!login_response) throw new not_found("Wrong email or password");
  return {user:login_response.user,token:login_response.token};
}