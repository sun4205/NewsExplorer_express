const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
  
    if (!authorization || !authorization.startsWith("Bearer ")) {
    
      return next(new UnauthorizedError("Authorization required"));
    }
  
    const token = authorization.replace("Bearer ", ""); 
    console.log("auth token:", token); 
  
    try {
      payload = jwt.verify(token, JWT_SECRET);
      console.log("Payload:", payload); 
    } catch (err) {
      return next(new UnauthorizedError("Invalid token"));
    }
  
    req.user = { _id: payload._id };
    console.log("req.user:", req.user);
  
    return next();
  };
  