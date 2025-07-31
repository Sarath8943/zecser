"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.requestOTP = void 0;
const mailer_1 = require("../utils/mailer");
const otpModel_1 = __importDefault(require("../models/otpModel"));
const otp_1 = require("../utils/otp");
const userModel_1 = __importDefault(require("../models/userModel"));
const requestOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        const otp = (0, otp_1.generateOtp)();
        const expiresAt = (0, otp_1.otpExpiry)();
        await otpModel_1.default.findOneAndUpdate({ email }, {
            otp,
            expiresAt,
            attempts: 0,
            verified: false,
            createdAt: new Date(),
        }, { upsert: true, new: true });
        await (0, mailer_1.sendEmail)(email, otp);
        return res.status(200).json({ message: "OTP sent to email" });
    }
    catch (error) {
        console.error("OTP Request Error:", error);
        return res.status(500).json({ message: "Failed to send OTP" });
    }
};
exports.requestOTP = requestOTP;
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    try {
        const record = await otpModel_1.default.findOne({ email });
        if (!record) {
            return res.status(400).json({ message: "OTP not found" });
        }
        if (record.verified) {
            return res.status(400).json({ message: "OTP already verified" });
        }
        if (record.expiresAt < new Date()) {
            await otpModel_1.default.deleteOne({ email });
            return res.status(400).json({ message: "OTP expired" });
        }
        if (record.attempts >= 3) {
            await otpModel_1.default.deleteOne({ email });
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
        const user = await userModel_1.default.findOne({ email });
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
    }
    catch (error) {
        console.error("OTP Verification Error:", error);
        return res.status(500).json({ message: "Server error during OTP verification" });
    }
};
exports.verifyOTP = verifyOTP;
//# sourceMappingURL=otpController.js.map