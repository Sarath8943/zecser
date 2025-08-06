import { axiosInstance } from "../../config/AxiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axiosInstance.post("/user/logout"); // ✅ API path correct? Confirm

      // Clear frontend data
      localStorage.removeItem("userId");
      localStorage.removeItem("username");

      toast.success("Logged out successfully", {
        style: { background: "#334155", color: "#fff" },
      });

      navigate("/"); // ✅ Go to login page
    } catch (error: any) {
      toast.error("Logout failed", {
        style: { background: "#ef4444", color: "#fff" },
      });
      console.error("Logout error:", error);
    }
  };

  return logout;
};
