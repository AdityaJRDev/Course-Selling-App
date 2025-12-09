const { Router } = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { parse } = require("dotenv");
require("dotenv").config();
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string().min(3).max(20),
    firstName: z.string().min(3).max(30),
    lastName: z.string().min(3).max(100),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    return res.status(400).json({
      message: "Incorrect format",
      error: parsedDataWithSuccess.error,
    });
  }

  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // FIXED: Using adminModel for admin signup
    // FIXED: Saving 'hashedPassword', not the plain 'password'
    await userModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    return res.status(201).json({
      message: "Signed up successfully",
    });
  } catch (e) {
    console.error(e);
    // Duplicate key error code
    if (e.code === 11000) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string().min(3).max(20),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    res.status(403).json({
      message: "Incorrect format",
      error: parsedDataWithSuccess.error,
    });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({
    email: email,
  });

  if (!email) {
    res.status(403).json({
      messgae: "Incorrect email in signin",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_PASSWORD
    );

    res.json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }
});

userRouter.get("/purchases", userMiddleware, async (req, res) => {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId,
  });

  const coursesData = await courseModel.find({
    _id: { $in: purchases.map((x) => x.courseId) },
  });

  res.json({
    message: "purchases endpoint",
  });
});

module.exports = {
  userRouter,
};
