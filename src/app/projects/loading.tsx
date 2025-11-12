export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
          {/* Animated spinning gradient ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          {/* Inner pulsing circle */}
          <div className="absolute inset-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Loading Projects
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Fetching repositories from GitHub...
        </p>
      </div>
    </div>
  );
}
