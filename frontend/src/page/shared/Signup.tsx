import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";


interface SignUpFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  // role: string;
}



const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof SignUpFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreed) {
      setMessage("You must agree to the Terms & Conditions.");
      return false;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setMessage("Please fix the errors above.");
      return false;
    }

    return true;
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setMessage("");

  if (!validateForm()) return;

  setLoading(true);
  try {
  const { confirmPassword, ...signupData } = formData;

  localStorage.setItem("pendingSignup", JSON.stringify(signupData)); // ✅ Use cleaned data

  navigate("/verify", { state: { email: signupData.email,} });
  } catch (error: any) {
    if (error.response) {
      const { field, message } = error.response.data;
      if (field) {
        setErrors((prev) => ({ ...prev, [field]: message }));
      }
      setMessage(message);
    } else {
      setMessage(error.message || "An unexpected error occurred.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="text-center pt-6">
          <h1 className="text-2xl font-bold mb-4">Logo</h1>
          <div className="flex justify-center border-b">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-1/2 py-3 font-semibold text-gray-400"
            >
              Login
            </button>
            <button
              type="button"
              className="w-1/2 py-3 font-semibold text-blue-600 border-b-2 border-blue-600"
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8">
          <h2 className="text-lg font-bold mb-1">Create an account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Build your profile, connect with peers, and discover jobs.
          </p>

          {message && <p className="text-red-500 text-sm mb-4">{message}</p>}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>   setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none"
          />
          {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none"
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>
          )}

          <label className="flex items-center text-sm mb-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I agree to the Terms & Conditions and Privacy Policy
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-full mb-6 hover:bg-blue-700 transition"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <div className="text-center text-gray-500 mb-4">Or Sign Up With</div>
          <div className="flex justify-center gap-6 pb-4">
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
};

export default SignUpPage;




