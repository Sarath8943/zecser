import express, { Router } from 'express';
import { requestOTP, verifyOTP } from '../controllers/otpController';


const router: Router = express.Router();

router.post('/generate',requestOTP ,);
router.post('/verify' ,verifyOTP ,);
// router.post("/user/signup", );
// router.post("/user/login", );

export default router;