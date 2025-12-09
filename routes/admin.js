const { Router } = require("express");
const adminRouter = Router();
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const adminSecretKey = process.env.JWT_ADMIN_PASSWORD;
const { adminMiddleware } = require("../middleware/admin");

const { adminModel, courseModel } = require("../db");

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
      adminSecretKey
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

adminRouter.post("/course", adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  const { title, description, imageUrl, price } = req.body;

  const course = await courseModel.create({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price,
    creatorId: adminId,
  });

  res.json({
    message: "Course created",
    courseId: course._id,
  });
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
  const adminId = req.adminId;

  const requiredBody = z.object({
    courseId: z.string().min(5),
    title: z.string().min(3).optional(),
    description: z.string().min(5).optional(),
    imageUrl: z.string().url().min(5).optional(),
    price: z.number().positive().optional(),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    return res.status(403).json({
      message: "Incorrect data format",
      error: parsedDataWithSuccess.error,
    });
  }

  const { courseId, title, description, imageUrl, price } = req.body;

  const course = courseModel.findOne({
    _id: courseId,
    creatorId: adminId,
  });

  await courseModel.updateOne(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title: title || course.title,
      description: description || course.description,
      imageUrl: imageUrl || course.imageUrl,
      price: price || course.price,
    }
  );

  res.status(200).json({
    message: "Course updated!",
  });
});

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  const courses = await courseModel.find({
    creatorId: adminId,
  });

  res.json({
    courses: courses,
  });
});

module.exports = {
  adminRouter,
};
