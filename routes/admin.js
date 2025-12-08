const { Router } = require("express");
const adminRouter = Router();
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { adminModel } = require("../db");

adminRouter.post("/signup", async (req, res) => {
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

    await adminModel.create({
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

adminRouter.post("/signin", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string().min(3).max(20),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    return res.json({
      message: "Incorrect data form",
      error: parsedDataWithSuccess.error,
    });
  }

  const { email, password } = req.body;

  const admin = await adminModel.findOne({
    email: email,
  });

  if (!admin) {
    return res.status(403).json({
      message: "Invalid Credentials!",
    });
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: admin._id,
      },
      JWT_ADMIN_PASSWORD
    );

    res.status(200).json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Invalid Credentials!",
    });
  }
});

module.exports = {
  adminRouter,
};
