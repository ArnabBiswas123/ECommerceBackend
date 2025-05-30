const User = require("../model/User");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      
      token = req.headers.authorization.split(" ")[1];
      
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      
      
      req.user = await User.findOne({
        _id: decoded.userData.id,
      }); 

     
      
      if (!req.user) {
        return res.json({ success: false, msg: "user is not autherized" });
      }


      next();
    } catch (error) {
      return res.json({ success: false, msg: "Token is not correct" });
    }
  }

  if (!token) {
    return res.json({ success: false, msg: "Token is not there" });
  }
};

module.exports = { protect };
