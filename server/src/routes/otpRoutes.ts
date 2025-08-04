import express, { Router } from "express";
import { requestOTP, verifyOTP } from "../controllers/otpController";
import { refreshToken, } from "../controllers/userController"; // renamed for clarity

const router: Router = express.Router();

// OTP-related routes
router.post("/generate", requestOTP);
router.post("/verify", verifyOTP);

// Refresh token route
router.get("/refresh-token", refreshToken);

export default router;
