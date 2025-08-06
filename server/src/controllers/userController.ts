import { Request, Response, } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { passwordsMatch } from "../utils/passwordUtils";
import { OTP } from "../models/otpModel";
import {  sendEmail } from '../utils/otp';
import userModel from "../models/userModel";
import { 
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getTokenFromHeader
} from "../utils/token";
import dotenv from "dotenv"
dotenv.config();
interface CustomRequest extends Request {
  userId?: string;}



export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    console.log("📥 Incoming signup request:", { name, email, phone });



    // ☎️ Phone number validation
    const phoneStr = phone.toString().trim();
    if (!/^\d{10}$/.test(phoneStr)) {
      return res.status(400).json({ 
        message: "Phone number must be 10 digits",
        field: "phone",
        success: false
      });
    }

    // 🔐 Password check
    // if (!passwordsMatch(password, confirmPassword)) {
    //   return res.status(400).json({ 
    //     message: "Passwords do not match",
    //     field: "confirmPassword",
    //     success: false
    //   });
    // }

    // 🔁 Check existing user
    const existingUser = await userModel.findOne({
      $or: [{ email }, { phone: parseInt(phoneStr) }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "phone";
      return res.status(400).json({ 
        message: `User with this ${field} already exists`,
        field,
        success: false
      });
    }

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const newUser = new userModel({
      name,
      email,
      phone: parseInt(phoneStr),
      password: hashedPassword,
      role:"user",
    });

    await newUser.save();

    console.log("✅ User saved to DB:", newUser.email);

    return res.status(201).json({ 
      message: "Signup successful", 
      success: true,
      userId: newUser._id 
    });

  } catch (error: any) {
    console.error("❌ Signup Error:", error);

    if (error.code === 11000) {
      const field = error.keyPattern?.email ? "email" : "phone";
      return res.status(400).json({ 
        message: `${field === "email" ? "Email" : "Phone number"} already exists`,
        field,
        success: false
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message || "Internal server error",
      success: false
    });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;
  
  try {
    console.log("Login request received:", { email, phone });

    // Validate input
    if ((!email && !phone) || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email or phone and password are required" 
      });
    }

    if (email && phone) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide either email or phone, not both" 
      });
    }

    // Verify JWT secrets
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      console.error("JWT Error: Secrets not configured");
      throw new Error("Server configuration error");
    }

    // Find user
    const query = email ? { email } : { phone: phone.toString().trim() };
    const user = await userModel.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Convert ObjectId to string for JWT
    const userIdString = user._id.toString();

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: userIdString, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m", algorithm: "HS256" }
    ) as unknown as string; // Type assertion

    const refreshToken = jwt.sign(
      { userId: userIdString },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d", algorithm: "HS256" }
    ) as unknown as string; // Type assertion

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Create user response object
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
      user: userResponse
    });

  } catch (error: any) {
    console.error("Login Error:", error);
    
    if (error.message === "Server configuration error") {
      return res.status(500).json({
        success: false,
        message: "Server misconfiguration - contact administrator",
        error: "JWT secrets not configured"
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: error.message
    });
  }
};



// Logout Controller
export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh'
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });

  } catch (error: any) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during logout",
      error: error.message
    });
  }
};


export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing"
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: string };
    
    // Find user
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000
    });

  } catch (error: any) {
    console.error("Refresh Token Error:", error);
    
    // Clear invalid refresh token
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh'
    });
    
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
      error: error.message
    });
  }
};




// Check User (for frontend auth)
export const checkUser = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userModel.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
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
