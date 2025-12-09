const jwt = require("jsonwebtoken");
require("dotenv").config();
const adminSecretKey = process.env.JWT_ADMIN_PASSWORD;

function adminMiddleware(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(403).json({
      message: "No token provided",
    });
  }

  const decoded = jwt.verify(token, adminSecretKey);

  try {
    const decoded = jwt.verify(token, adminSecretKey);

    if (decoded) {
      req.userId = decoded.id;
      next();
    } else {
      res.status(403).json({
        message: "You are not signed in",
      });
    }
  } catch (e) {
    res.status(403).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  adminMiddleware: adminMiddleware,
};
