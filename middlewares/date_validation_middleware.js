const moment=require("moment")
const validate_date=async(req, res, next)=>{
    const { to, from } = req.body;
    const dateFormat = "MM/DD/YYYY";
  
    if (!moment(to, dateFormat, true).isValid() || !moment(from, dateFormat, true).isValid()) {
      return res.status(400).json({ error: "Invalid date format for 'to' or 'from' fields" });
    }
  
    next();
  }
  module.exports=validate_date;