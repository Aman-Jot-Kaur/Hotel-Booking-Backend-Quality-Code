const { no_content, not_found } = require("../libs/error");
const { error_handler } = require("../libs/utils");
const {user_services}=require("../services")

exports.add_user=async(req,res)=>{
    try {
      
        const response = await user_services.add_user({ data: req.body });
        if (!response) throw new Error("User could not be created.");
        console.log("Modified response:", response.token);
        return res.status(201).json({response});
      } catch (error) {
        console.log("error in create message controller", error);
        res.status(error_handler(error)).json({ error: error.message });
      }
}

exports.get_user_by_uuid = async (req, res) => {
  try {
    const response = await user_services.get_user({ params: req.params });
    if (!response) throw new not_found("User could not be found.");
    return res.status(200).json(response);
  } catch (error) {
    console.log("error in get by id user controller", error);
    res.status(error_handler(error)).json({ error: error.message });
  }
}

exports.update_user = async (req, res) => {
  try {
    const response = await user_services.update_user({ params:req.params,data: req.body });
    if (!response) throw new Error('User could not be updated.');
    res.status(200).json(response);
  } catch (error) {
    console.log("error in update user controller", error);
    res.status(error_handler(error)).json({ error: error.message });
  }
}

exports.delete_user=async(req,res)=>{
  try {
    const response = await user_services.delete_user({ params: req.params });
    if (!response) throw new Error("User could not be deleted.");
    return res.status(200).json(response);
  } catch (error) {
    console.log("error in delete user controller", error);
    res.status(error_handler(error)).json({ error: error.message });
  }
}

exports.login_user=async(req,res)=>{
  try {
    const response = await user_services.login_user({data: req.body });
    if (!response) throw new Error('User could not login.');
    res.status(200).json(response);
  } catch (error) {
    console.log("error in login user controller", error);
    res.status(error_handler(error)).json({ error: error.message });
  }
}