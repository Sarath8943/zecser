import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from "../page/services/authService";
import { axiosInstance } from '../config/AxiosInstance';

export default function EmailVerification() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSendCode = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('Sending OTP...');
      await axiosInstance.post('/otp/generate', { email });
      setStep(2);
      setMessage('OTP sent to your email');
    } catch (err: unknown) {
      const error = err as any;
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
     setMessage('Verifying OTP...');

      await axiosInstance.post('/otp/verify', { email, otp: code });
 // 2. Get pending signup data from localStorage
    const dataString = localStorage.getItem("pendingSignup");
    if (!dataString) {
      setError("Signup data not found. Please sign up again.");
      return;
    }
     
      const data =JSON.parse(dataString)

      if ( !data.email || !data.name || !data.phone || !data.password) {
  setError("Incomplete signup data. Please try again.");
  return;
}
console.log("Registering user with data:", data);


      await registerUser(data);
      localStorage.removeItem("pendingSignup");

      setMessage('✅ OTP verified and user registered! Redirecting to login...');

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err: unknown) {
      const error = err as any;
      setError(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Verify your email</h2>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage('');
                setError('');
              }}
              className="w-full px-4 py-2 border rounded-md mb-4"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
            <button
              onClick={handleSendCode}
              className="w-full bg-blue-600 text-white py-2 rounded-full disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Enter OTP</h2>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
                setMessage('');
              }}
              className="w-full px-4 py-2 border rounded-md text-center mb-4"
              placeholder="------"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
            <button
              onClick={handleOtpVerify}
              className="w-full bg-blue-600 text-white py-2 rounded-full disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              onClick={handleSendCode}
              className="w-full bg-gray-200 text-blue-600 py-2 mt-4 rounded-full disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Resend OTP'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
