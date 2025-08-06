import express, { Router } from 'express';
import {  checkUser, login, logout, resetPassword, signup, verifyOtp } from '../controllers/userController';


const router: Router = express.Router();
router.post("/sign", signup);
router.post("/login", login);
router.post('/forgot-password', resetPassword);
router.post('/verify-otp',verifyOtp );
router.post("/logout",logout );
router.get("/check-user", checkUser);

export default router;