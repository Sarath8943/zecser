// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { IoIosArrowBack } from 'react-icons/io';
// import { axiosInstance } from '../config/AxiosInstance';


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 relative">
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute top-4 left-4 text-xl text-gray-700"
//         >
//           <IoIosArrowBack />
//         </button>

//         {/* Title */}
//         <div className="mt-8 text-center">
//           <h2 className="text-lg font-bold mb-1">Forgot Your Password?</h2>
//           <p className="text-sm text-gray-500">
//             Enter your email address and we’ll send you a link to reset your password.
//           </p>
//         </div>

//         <div className="mt-6">
//           <label className="text-sm text-gray-500 mb-1 block">Email</label>
//           <input
//             type="email"
//             placeholder="you@example.com"
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         {/* Error / Success Messages */}
//         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//         {message && <p className="text-green-500 text-sm mt-2">{message}</p>}

//         {/* Submit Button */}
//         <button
//           onClick={handlePasswordReset}
//           className="mt-6 w-full bg-blue-600 text-white py-2 rounded-full disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? 'Sending...' : 'Send Reset Link'}
//         </button>
//       </div>
//     </div>
//   );
// }