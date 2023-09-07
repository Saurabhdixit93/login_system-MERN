const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRETKEY;

// token verify function
module.exports.verifyToken = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    if (!req.headers.authorization) {
      return res.json({
        success: false,
        message: "Please Add Authorization Token !",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    const payload = await jwt.verify(token, secretKey);
    req.user = payload;
    next();
  } catch (err) {
    // Handle different types of errors that may occur during verification
    if (err.name === "TokenExpiredError") {
      return res.json({
        success: false,
        message: "Sorry, the session has expired.",
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.json({
        success: false,
        message: "Authorization is required.",
      });
    }
    return res.json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
