const { Router } = require("express");

const courseRouter = Router();

courseRouter.post("/course/purchase", (req, res) => {
  res.json({
    message: "signup endpoint",
  });
});

courseRouter.get("/course/preview", (req, res) => {
  res.json({
    message: "signup endpoint",
  });
});

module.exports = {
  courseRouter: courseRouter,
};
