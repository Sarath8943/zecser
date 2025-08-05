import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../../config/AxiosInstance';

interface LoginFormData {
  email: string;
  password: string;
}

interface ApiResponse {
  userId: string;
  username: string;
  // Add other fields your API might return
  message?: string;
  token?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
     console.log('Form Data:', data);
    try {
      const response = await axiosInstance.post<ApiResponse>('/user/login', data, {
        withCredentials: true,
      });

      toast.success('Login successful', {
        style: {
          background: '#334155',
          color: '#fff',
        },
      });

      // Store user info safely with fallbacks
      localStorage.setItem('userId', response.data.userId || '');
      localStorage.setItem('username', response.data.username || '');

      navigate('/home');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Login failed', {
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="text-center pt-6">
          <h1 className="text-2xl font-bold mb-4">Logo</h1>
          <div className="flex justify-center border-b">
            <button className="w-1/2 py-3 font-semibold text-blue-600 border-b-2 border-blue-600">
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="w-1/2 py-3 font-semibold text-gray-400"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8">
          <h2 className="text-lg font-bold mb-1">Welcome Back!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Log in to your account to connect with professionals and explore opportunities.
          </p>

          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
            className="w-full mb-2 px-4 py-2 border rounded-md focus:outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required' })}
            className="w-full mb-2 px-4 py-2 border rounded-md focus:outline-none"
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

          <Link to="/forgot-password" className="text-right text-sm text-blue-500 mb-4 block">
            Forgot Password
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-full mb-6 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-gray-500 mb-4">Or Continue With</div>
          <div className="flex justify-center gap-6">
            <div className="flex flex-col items-center text-gray-600">
              <FcGoogle size={24} />
              <span className="text-xs mt-1">Google</span>
            </div>
            <div className="flex flex-col items-center text-blue-600">
              <FaFacebook size={24} />
              <span className="text-xs mt-1">Facebook</span>
            </div>
            <div className="flex flex-col items-center text-black">
              <FaApple size={24} />
              <span className="text-xs mt-1">Apple ID</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}