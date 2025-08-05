import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../config/AxiosInstance';

interface UserRoutesProps {
  children: ReactNode;
}

export const UserRoutes = ({ children }: UserRoutesProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axiosInstance({
          url: '/user/check-user',
          method: 'GET',
          withCredentials: true,
        });

        const data = res.data;
        console.log("User verified:", data);

      } catch (error) {
        console.error("Error occurred while checking user:", error);
        navigate("/login", { replace: true });
      }
    };

    checkUser();
  }, [navigate]);

  return <>{children}</>;
};
