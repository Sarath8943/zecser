import express, { Router } from 'express';
import { requestOTP, verifyOTP } from '../controllers/otpController';
import { checkUser, login, logout, signup } from '../controllers/userController';


const router: Router = express.Router();

router.post('/generate',requestOTP );
router.post('/verify' ,verifyOTP );
router.post("/signup",signup );
router.post("/login", login);
router.post("/logout",logout );
router.get("/check-user", checkUser);

export default router;