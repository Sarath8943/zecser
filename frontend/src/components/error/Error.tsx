import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <h1 className="text-9xl font-bold text-red-500">404</h1>
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mt-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 mt-2 text-lg">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={handleBack}
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
      >
        Go Home
      </button>
    </div>
  );
};

export default ErrorPage;
