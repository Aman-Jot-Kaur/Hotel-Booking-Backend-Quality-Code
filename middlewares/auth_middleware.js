const JWT=require("jsonwebtoken")

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next("Auth Failed");
  }
  const token = authHeader?.split(" ")[1];
  try {
    const payload = JWT.verify(token, process.env.SECRET_KEY);
    req.user = { user_id: payload.user_id };

    next();
  } catch (error) {
    next(error.message);
  }
};

module.exports=userAuth;