const jwt = require("jsonwebtoken");
require("dotenv").config();

function userMiddleware(req, res, next) {
  const token = req.body.token;
  const decoded = jwt.verify({ token }, JWT_USER_PASSWORD);

  if (decoded) {
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      message: "You are not signed in",
    });
  }
}

module.exports = {
  userMiddleware: userMiddleware,
};
