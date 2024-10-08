const jwt=require("jsonwebtoken");
const User = require("../model/user.model");
exports.auth = async (req, res, next) => {
    try {
      
      const token = req.cookies['expense-auth'] || req.headers.authorization?.split(' ')[1];
    
      
  
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization denied, no token provided' });
      }
  
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
     
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      
      req.user = user;
      next();
    } catch (error) {
      console.error("Authentication error:", error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  };
  
  exports.IsUser = (req, res, next) => {
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized, no user found" });
      }
    
      
      if (req.user.role_id === "user") {
        next();
      } else {
        return res.status(403).json({ success: false, message: "You are not authorized to access this resource" });
      }
    };
    exports.IsAdmin = (req, res, next) => {
      
        if (!req.user) {
          return res.status(401).json({ success: false, message: "Unauthorized, no admin found" });
        }
      
        
        if (req.user.role_id === "admin") {
          next();
        } else {
          return res.status(403).json({ success: false, message: "You are not authorized to access this resource" });
        }
      };