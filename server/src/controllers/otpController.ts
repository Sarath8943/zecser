import { Request, Response } from "express";
import { sendEmail } from "../utils/mailer";
import OtpModel from "../models/otpModel";
import { generateOtp, otpExpiry} from "../utils/otp";
import User from "../models/userModel";


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

    await sendEmail(email, otp); // ← if this fails, it throws now

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("OTP Request Error:", error);
    return res.status(500).json({ 
      message: "Failed to send OTP",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};


export const verifyOTP = async (req: Request, res: Response): Promise<Response> => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const record = await OtpModel.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.verified) {
      return res.status(400).json({ message: "OTP already verified" });
    }

    if (record.expiresAt < new Date()) {
      await OtpModel.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.attempts >= 3) {
      await OtpModel.deleteOne({ email });
      return res.status(400).json({
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({
        message: "Incorrect OTP",
        remainingAttempts: 3 - record.attempts,
      });
    }

    record.verified = true;
    await record.save();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ message: "Server error during OTP verification" });
  }
};

