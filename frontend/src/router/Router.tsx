import { Routes, Route } from "react-router-dom";
import Home from "../page/Home";
import Login from "../page/shared/Login";
import SignUp from "../page/shared/Signup";
import  { ForgotPassword, ResetPassword, VerifyOtp } from "../page/ForgotPassword";
import EmailVerification from "../page/EmailEntry";
import ErrorPage from "../components/error/Error";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/verify" element={<EmailVerification />} />
  <Route path="/verify-otp" element={<VerifyOtp />} />
  <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected / Main Route */}
      <Route path="/home" element={<Home />} />

      {/* Catch-all for unknown routes */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
