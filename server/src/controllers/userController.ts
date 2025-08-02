import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import { generateToken } from "../utils/token";
import { passwordsMatch } from "../utils/passwordUtils";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    // console.log("Signup Request:", req.body); // ✅ debug log

    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword || !role) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }


    if (!passwordsMatch(password, confirmPassword)) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed password:", hashedPassword);


    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();


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

      // console.log("Login request received:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = (await User.findOne({ email })) as IUser | null;
      // console.log("User found:", user);
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    //  console.log("Password match:", isPasswordMatch);
    if (!isPasswordMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

//  console.log("Generated token:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    });
// console.log("Login successful, sending response");
   
    res.status(200).json({
      message: "Login successfully",
    });

  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Server error" });
    
  }
};


export const checkUser = async (req: Request, res: Response): Promise<void> => {
  try {
  
    const userId = (req as any).user?.id;
    const role = (req as any).user?.role;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: Missing user ID" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "success",
      role,
    });
  } catch (error: any) {
    console.error("Check user error:", error);
    res.status(error.status || 500).json({
      error: error.message || "Internal Server Error",
    });
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
