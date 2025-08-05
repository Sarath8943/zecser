import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { passwordsMatch } from "../utils/passwordUtils";
import { OTP } from "../models/otpModel";
import {  sendEmail } from '../utils/otp';

// Custom Request type to support userId
interface CustomRequest extends Request {
  userId?: string;
}


export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, confirmPassword, role } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (
      typeof phone !== "string" ||
      !/^[0-9]{10}$/.test(phone.trim())
    ) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    if (!passwordsMatch(password, confirmPassword)) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or phone already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();

    console.log("User successfully saved to DB:", newUser);

    return res.status(201).json({ message: "Signup successful" });
  } catch (error: any) {
    console.error("Signup Error:", error);


    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (error.keyPattern?.phone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message || "Internal server error",
    });
  }
};




// Login Controller
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Logout Controller
export const logout = (req: Request, res: Response): Response => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
};

// Refresh Token Controller
export const refreshToken = (req: Request, res: Response): Response => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as {
      userId: string;
    };

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// Check User (for frontend auth)
export const checkUser = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email }); // delete existing OTPs

    const hashedOTP = await bcrypt.hash(otpCode, 10);
    await OTP.create({ email, otp: hashedOTP, createdAt: new Date() });

   await sendEmail(email, `Your OTP is: ${otpCode}`);


    return res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email });
    if (!record) return res.status(400).json({ message: 'OTP not found or expired' });

    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

    await OTP.deleteMany({ email }); // delete after successful verification

    return res.status(200).json({ message: 'OTP verified' });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};