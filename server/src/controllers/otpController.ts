import { Request, Response } from "express";
import { sendEmail } from "../utils/mailer";
import OtpModel from "../models/otpModel";
import { generateOtp, otpExpiry } from "../utils/otp";
import User from "../models/userModel";
import bcrypt from "bcrypt";

export const requestOTP = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const otp = generateOtp();
    const expiresAt = otpExpiry();

    await OtpModel.findOneAndUpdate(
      { email },
      {
        otp,
        expiresAt,
        attempts: 0,
        verified: false,
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is: <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    });

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("OTP Request Error:", error);
    return res.status(500).json({
      message: "Failed to send OTP",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, name, password, role } = req.body;

    if (!email || !otp || !name || !password || !role) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const otpRecord = await OtpModel.findOne({ email });

    if (
      !otpRecord ||
      otpRecord.otp !== otp ||
      otpRecord.expiresAt < new Date()
    ) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Delete OTP record after successful verification
    await OtpModel.deleteOne({ email });

    res.status(201).json({
      message: "Email verified and user registered",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("OTP Verify Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
