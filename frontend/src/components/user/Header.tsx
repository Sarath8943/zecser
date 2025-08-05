import { FaUserCircle, FaMicrophone, FaBell, FaCommentDots, FaBriefcase, FaUsers, FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 flex flex-col gap-4 mb-6">
      {/* Top Bar: Profile + Search + Icons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Profile + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto gap-4 flex-1">
          <FaUserCircle className="text-3xl text-gray-600 shrink-0" />

          {/* Search Bar with Voice */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for jobs, companies..."
              className="w-full px-4 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaMicrophone className="absolute top-2.5 right-4 text-gray-500 cursor-pointer" />
          </div>
        </div>

        {/* Icons: Messages & Notifications */}
        <div className="flex gap-4 justify-center sm:justify-end">
          <FaCommentDots className="text-xl text-gray-600 cursor-pointer" title="Messages" />
          <FaBell className="text-xl text-gray-600 cursor-pointer" title="Notifications" />
        </div>
      </div>

      {/* Navigation Buttons: Jobs, My Network, Logout */}
      <div className="flex justify-around text-sm text-gray-700 border-t pt-4">
        <button className="flex flex-col items-center hover:text-blue-600">
          <FaBriefcase className="text-xl mb-1" />
          <span>Jobs</span>
        </button>
        <button className="flex flex-col items-center hover:text-blue-600">
          <FaUsers className="text-xl mb-1" />
          <span>My Network</span>
        </button>
        <button className="flex flex-col items-center hover:text-red-500">
          <FaSignOutAlt className="text-xl mb-1" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
