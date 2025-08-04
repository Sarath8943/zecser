import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { VerifyErrors } from "jsonwebtoken";
import User from "../models/userModel";
import { generateTokens } from "../utils/token";
import { passwordsMatch } from "../utils/passwordUtils";
import OtpModel from "../models/otpModel";
import { requestOTP, } from "../controllers/otpController";
import { verifyOTP } from "../controllers/otpController";




export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword || !role) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (!passwordsMatch(password, confirmPassword)) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    // Don't save user or OTP here, just confirm details are valid.
    res.status(200).json({
      message: "Signup details received. OTP will be sent to email for verification.",
    });

  } catch (error: any) {
    console.error("Signup error:", error.message || error);
    res.status(500).json({ message: "Internal server error", error: error.message || "Unknown error" });
  }
};




export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser || !existingUser.isEmailVerified) {
      res.status(403).json({ message: "Email not verified or user doesn't exist" });
      return;
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(
      existingUser._id.toString(),
      existingUser.role
    );

    // ✅ Set both tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Send plain text success message only
    res.status(200).send("Login successfully");

  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, name, password, role } = req.body;

    if (!email || !otp || !name || !password || !role) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check OTP record
    const otpRecord = await OtpModel.findOne({ email });

    if (
      !otpRecord ||
      otpRecord.otp !== otp ||
      otpRecord.expiresAt < new Date()
    ) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Delete OTP record after successful registration
    await OtpModel.deleteOne({ email });

    res.status(201).json({
      message: "OTP verified and user registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("OTP verification error:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401).json({ message: "Refresh token not found" });
      return;
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, async (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        res.status(403).json({ message: "Invalid refresh token" });
        return;
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(
        user._id.toString(),
        user.role
      );

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error: any) {
    console.error("Refresh error:", error);
    res.status(500).json({ message: "Server error" });
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

