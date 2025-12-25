import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bycrypt from "bcrypt";
import cors from "cors";

import connectDB from "./config/database.js";
import User from "./models/user.js";
import Task from "./models/task.js";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// signup route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("🚀 ~ name, email, password:", name, email, password);

  // validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash the password
    const saltRounds = 10;
    const hashedPassword = await bycrypt.hash(password, saltRounds);

    // Signup logic will go here
    const userData = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await userData.save();

    res.status(201).json(savedUser);
    console.log("Signup endpoint");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// login
app.post("/login", async (req, res) => {
  // Login logic will go here
  const { email, password } = req.body;

  // validate the email and password
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // check if the user exists and password matches
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // verify the password
    const isPasswordValid = await bycrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // set data in json web token and cookies
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.send("Login endpoint");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get user by email
app.post("/user", async (req, res) => {
  try {
    // check for cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // check token validation
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check valid user in db
    const userEmail = decoded.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // after all checks, proceed to
    // give requested data
    const userEmailQuery = req.body.email;

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmailQuery)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const findUser = await User.findOne({ email: userEmailQuery });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(findUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// create new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, startDate, targetDate, priority, duration } =
      req.body;

    if (!title || !startDate || !targetDate) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const newTask = new Task({
      user_id: new mongoose.Types.ObjectId("694cac6efa646fd0125d815e"),
      title,
      description,
      category: "General",
      start_date: startDate,
      end_date: targetDate,
      duration: Number(duration) || 25,
      priority: priority.toLowerCase(),
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(400).json({
      message: error.message,
    });
  }
});

// get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete the user
app.delete("/user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const deletedUser = await User.find.findOneAndDelete({ email: userEmail });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
