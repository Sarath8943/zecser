import { Request, Response } from "express";
import { OTP } from "../models/otpModel";
import { generateOtp } from "../utils/otp";
import {  sendEmail } from "../utils/otp";
import { otpExpiry } from "../utils/otp";
import User from "../models/userModel";
import bcrypt from 'bcrypt';


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

    if (!email || !otp) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const record = await OTP.findOne({ otp });

    if (!record) {
      res.status(400).json({ message: "OTP not found" });
      return;
    }

    if (record.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }

    const expiryTime = new Date(record.createdAt.getTime() + 10 * 60 * 1000);
    if (new Date() > expiryTime) {
      await OTP.deleteOne({ email });
      res.status(400).json({ message: "OTP expired" });
      return;
    }

    await OTP.deleteOne({ email });

    // ✅ Send success response
    res.status(200).json({ message: "OTP verified successfully" });

  } catch (error: unknown) {
    console.error("Verify OTP Error:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};


