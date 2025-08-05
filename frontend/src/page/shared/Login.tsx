import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { axiosInstance } from "../../config/AxiosInstance";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  userId: string;
  username: string;
  accessToken?: string;
  message?: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post<LoginResponse>("/user/login", data, {
        withCredentials: true,
      });

      toast.success("Login successful", {
        style: { background: "#334155", color: "#fff" },
      });

      localStorage.setItem("userId", response.data.userId || "");
      localStorage.setItem("username", response.data.username || "");
      navigate("/Header");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed", {
        style: { background: "#ef4444", color: "#fff" },
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
              onClick={() => navigate("/signup")}
              className="w-1/2 py-3 font-semibold text-gray-400"
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8">
          <h2 className="text-lg font-bold mb-1">Welcome Back!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Log in to your account to connect with professionals and explore opportunities.
          </p>

          <input
            type="text"
            placeholder="Email or Phone"
            {...register("email", { required: "Email or phone is required" })}
            className="w-full mb-2 px-4 py-2 border rounded-md focus:outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
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
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-gray-500 mb-4">Or Continue With</div>
          <div className="flex justify-center gap-6 pb-6">
            <div className="flex flex-col items-center text-gray-600 cursor-pointer">
              <FcGoogle size={24} />
              <span className="text-xs mt-1">Google</span>
            </div>
            <div className="flex flex-col items-center text-blue-600 cursor-pointer">
              <FaFacebook size={24} />
              <span className="text-xs mt-1">Facebook</span>
            </div>
            <div className="flex flex-col items-center text-black cursor-pointer">
              <FaApple size={24} />
              <span className="text-xs mt-1">Apple ID</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}