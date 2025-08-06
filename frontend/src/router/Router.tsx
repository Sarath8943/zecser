import { Routes, Route } from "react-router-dom";
import Home from "../page/Home";
import Login from "../page/shared/Login";
import SignUp from "../page/shared/Signup";
import  { ResetPassword, } from "../page/ForgotPassword";
import EmailVerification from "../page/EmailEntry";
import ErrorPage from "../components/error/Error";
import Header from "../components/user/Header";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify" element={<EmailVerification />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/header" element={<Header/>} />

      {/* Protected / Main Route */}
      <Route path="/home" element={<Home />} />

      {/* Catch-all for unknown routes */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
