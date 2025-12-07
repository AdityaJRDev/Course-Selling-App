const { Router } = require("express");
const adminRouter = Router();
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { UserModel } = require("../../Full-stack/todo-app-with-zod-bcrypt/db");

adminRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string().min(3).max(20),
    firstName: z.string().min(3).max(30),
    lastName: z.string().min(3).max(100),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    res.json({
      message: "Incorrect format",
      error: parsedDataWithSuccess.error,
    });
    return;
  }

  try {
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "All fields (email, password, firstname, lastname) are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    return res.status(201).json({
      message: "Signed up successfully",
    });
  } catch (e) {
    console.error(e);

    if (e.code === 11000) {
      return res.status(409).json({
        message: "User already exits",
      });
    }
  }

  const { email, password, firstName, lastName } = req.body;

  res.json({
    message: "signup endpoint",
  });
});

adminRouter.post("/signin", (req, res) => {
  res.json({
    message: "signin endpoint",
  });
});

adminRouter.post("/", (req, res) => {
  res.json({
    message: "signin endpoint",
  });
});

adminRouter.put("/", (req, res) => {
  res.json({
    message: "signin endpoint",
  });
});

adminRouter.get("/bulk", (req, res) => {
  res.json({
    message: "signin endpoint",
  });
});

module.exports = {
  adminRouter: adminRouter,
};
