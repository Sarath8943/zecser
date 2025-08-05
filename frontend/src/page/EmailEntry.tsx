import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { axiosInstance } from '../config/AxiosInstance';

export default function EmailVerification() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailToken, setEmailToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'otp' | 'email'>('otp');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email and step from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.step === 'otp') {
      setVerificationStep('otp');
      setStep(1); // Start with OTP step
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
      
      if (verificationStep === 'otp') {
        setMessage('Sending OTP...');
        await axiosInstance.post('/otp/generate', { email });
        setStep(2);
        setMessage('OTP sent to your email');
      } else {
        setMessage('Sending email verification...');
        // This would be for standalone email verification if needed
        setStep(2);
        setMessage('Verification code sent to your email');
      }
    } catch (err: unknown) {
      const error = err as any;
      setError(error.response?.data?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verificationStep === 'otp') {
      return handleOtpVerify();
    } else {
      return handleEmailVerify();
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
      await axiosInstance.post<{ message: string }>('/otp/verify', {
        email,
        otp: code,
      });
      setMessage('✅ OTP verified! Now proceeding to email verification...');
      
      // Switch to email verification step
      setTimeout(() => {
        setVerificationStep('email');
        setStep(3); // New step for email token input
        setCode(''); // Clear OTP code
        setMessage('Please enter the email verification token sent to your email');
      }, 1500);
    } catch (err: unknown) {
      const error = err as any;
      setError(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerify = async () => {
    if (!emailToken.trim()) {
      setError('Please enter the email verification token');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await axiosInstance.post<{ message: string }>('/user/verify', {
        email,
        token: emailToken,
      });
      setMessage('✅ ' + res.data.message);

      setTimeout(() => {
        navigate('/'); 
      }, 2000); 
    } catch (err: unknown) {
      const error = err as any;
      setError(error.response?.data?.message || 'Email verification failed');
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
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Enter Verification Code</h2>
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
              onClick={handleVerify}
              className="w-full bg-blue-600 text-white py-2 rounded-full disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
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

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Final Verification</h2>
            <input
              type="text"
              placeholder="Email verification token"
              value={emailToken}
              onChange={(e) => {
                setEmailToken(e.target.value);
                setMessage('');
                setError('');
              }}
              className="w-full px-4 py-2 border rounded-md mb-4 text-center"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
            <button
              onClick={handleVerify}
              className="w-full bg-blue-600 text-white py-2 rounded-full disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
