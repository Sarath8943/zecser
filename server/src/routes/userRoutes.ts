import express, { Router } from 'express';
import { checkUser, login, logout, signup } from '../controllers/userController';


const router: Router = express.Router();
router.post("/sign", signup);
router.post("/login", login);
// router.post("/forgot-password", forgotPassword);
router.post("/logout",logout );
router.get("/check-user", checkUser);

export default router;