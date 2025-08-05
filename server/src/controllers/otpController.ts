import { Request, Response } from "express";
import { OTP } from "../models/otpModel";
import { generateOtp } from "../utils/otp";
import {  sendEmail } from "../utils/otp";
import { otpExpiry } from "../utils/otp";
import User from "../models/userModel";

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const otp = generateOtp();
    const expiresAt = otpExpiry();

    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await  sendEmail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (error: unknown) {
    console.error("Request OTP Error:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email });

    if (!record) {
      res.status(400).json({ message: "OTP not found" });
      return;
    }

    if (record.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }

    if (record. createdAt< new Date()) {
      res.status(400).json({ message: "OTP expired" });
      return;
    }

    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      existingUser = await User.create({ email });
    }

    await OTP.deleteOne({ email });

    res.json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        email: existingUser.email,
      },
    });
    return;
  } catch (error: unknown) {
    console.error("Verify OTP Error:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
    return;
  }
};
