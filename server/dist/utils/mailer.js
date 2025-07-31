"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendEmail = async (email, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: " Your OTP Code",
        text: `Your OTP is: ${text}`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email}`);
    }
    catch (error) {
        console.error("❌ Email sending failed:", error);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=mailer.js.map