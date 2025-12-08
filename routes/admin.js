const { Router } = require("express");
const adminRouter = Router();
const bcrypt = require("bcrypt");
const { z } = require("zod");

// FIXED: Adjusted path to standard relative path and import name to camelCase
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

    // FIXED: Using adminModel for admin signup
    // FIXED: Saving 'hashedPassword', not the plain 'password'
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

module.exports = {
  adminRouter,
};
