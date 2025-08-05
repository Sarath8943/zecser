// === Fixed ForgotPassword Flow (Split File Friendly) ===
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { axiosInstance } from '../config/AxiosInstance';

// ForgotPassword.tsx
export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async () => {
    setMessage('');
    setError('');
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    try {
      await axiosInstance.post('/api/auth/forgot-password', { email });
      setMessage('OTP sent to your email.');
      localStorage.setItem('resetEmail', email);
      navigate('/verify-otp');
    } catch (err: unknown) {
      const errorMessage = (err as any).response?.data?.message || 'Something went wrong';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-xl text-gray-700"
        >
          <IoIosArrowBack />
        </button>
        <div className="mt-8 text-center">
          <h2 className="text-lg font-bold mb-1">Forgot Your Password?</h2>
          <p className="text-sm text-gray-500">
            Enter your email address and we’ll send you an OTP to reset your password.
          </p>
        </div>
        <div className="mt-6">
          <label className="text-sm text-gray-500 mb-1 block">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
        <button
          onClick={handlePasswordReset}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-full"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}

// VerifyOtp.tsx
export function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const email = localStorage.getItem('resetEmail') || '';
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      await axiosInstance.post('/api/auth/verify-otp', { email, otp });
      navigate('/reset-password');
    } catch (err: unknown) {
      const errorMessage = (err as any).response?.data?.message || 'Invalid or expired OTP';
      setError(errorMessage);
    }
  };

  const resendOtp = async () => {
    try {
      await axiosInstance.post('/api/auth/forgot-password', { email });
    } catch (err) {
      console.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 text-center">
        <h2 className="text-lg font-bold mb-2">Verify OTP</h2>
        <p className="text-sm text-gray-500">Enter the OTP sent to {email}</p>
        <input
          type="text"
          className="w-full mt-4 px-4 py-2 border rounded-md"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button onClick={handleVerify} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full">
          Verify
        </button>
        <button onClick={resendOtp} className="mt-2 text-blue-500 text-sm">
          Resend OTP
        </button>
      </div>
    </div>
  );
}

// ResetPassword.tsx
export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const email = localStorage.getItem('resetEmail') || '';
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      await axiosInstance.post('/api/auth/reset-password', { email, newPassword: password });
      setMessage('Password changed successfully');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      const errorMessage = (err as any).response?.data?.message || 'Password reset failed';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-bold mb-4 text-center">Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full px-4 py-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
        <button
          onClick={handleReset}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}