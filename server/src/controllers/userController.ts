import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import { generateToken } from "../utils/token";
import { passwordsMatch } from "../utils/passwordUtils";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Signup Request:", req.body); // ✅ debug log

    const { name, email, password, confirmPassword, role } = req.body;

    // ✅ Check for missing fields
    if (!name || !email || !password || !confirmPassword || !role) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // ✅ Check if passwords match
    if (!passwordsMatch(password, confirmPassword)) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    // ✅ Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    // ✅ Generate JWT token
    const token = generateToken(savedUser._id.toString(), savedUser.role);
    if (!token) {
      res.status(500).json({ message: "Token generation failed" });
      return;
    }

    // ✅ Set auth cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // ✅ Send success response
    res.status(201).json({
      message: "Signup successful",
      success: true,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message || "Unknown error",
    });
  }
};

// LOGIN

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = (await User.findOne({ email })) as IUser | null;
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    });

    // ✅ Only message in the response
    res.status(200).json({
      message: "Login successfully",
    });

  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};


export const logout = (req: Request, res: Response): void => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
