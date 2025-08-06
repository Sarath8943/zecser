import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { axiosInstance } from '../config/AxiosInstance';
import { toast } from 'react-hot-toast';

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem('resetEmail') || '';

  const handleSendOtp = async () => {
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      const res = await axiosInstance.post<{ message: string }>('/user/send-otp', { email });
      toast.success(res.data.message || 'OTP sent');
      setOtpSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error('Enter the OTP');
    setLoading(true);
    try {
      const res = await axiosInstance.post<{ message: string }>('/user/verify-otp', { email, otp });
      toast.success(res.data.message || 'OTP Verified');
      setOtpVerified(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!otpVerified) {
      toast.error('Please verify OTP before resetting password');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post<{ message: string }>(
        '/user/reset-password',
        {
          email,
          newPassword: password,
        }
      );

      toast.success(response.data.message || 'Password changed successfully');
      localStorage.removeItem('resetEmail');
      navigate('/');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Password reset failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-center mb-4">Reset Password</h2>

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-full mb-3"
          >
            {loading ? 'Sending OTP...' : 'Send OTP to Email'}
          </button>
        ) : !otpVerified ? (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-md mb-3"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-full mb-3"
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>
          </>
        ) : (
          <>
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-md mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-md mt-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleReset}
              disabled={loading}
              className={`mt-4 w-full bg-blue-600 text-white py-2 rounded-full ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Resetting...' : 'Change Password'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
