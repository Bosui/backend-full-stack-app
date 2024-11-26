import express from "express";
import User from "../models/User";
import { generateToken } from "../utils/password";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = req.body;
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User(user);
    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error registering new user.",
      error: (err as Error).message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    if (!(await user.isCorrectPassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = generateToken({ id: user._id });

    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    return res
      .status(200)
      .json({ status: "success", token, user: userWithoutPassword });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error logging in.", error: (err as Error).message });
  }
});

export default router;
