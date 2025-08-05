export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Welcome to JobConnect!</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Search and apply for your dream jobs with ease across all devices.
        </p>

        {/* Placeholder for Job Listings */}
        <div className="border border-dashed border-gray-300 py-12 sm:py-16 rounded-lg text-gray-400">
          Job listings will appear here.
        </div>
      </div>
    </div>
  );
}


