"use client";

const Loader = () => {
  return (
    <div className="fixed inset-0 top-0 bottom-0 bg-gray-600 opacity-60 z-99999 flex items-center justify-center">
      <div className="flex items-center space-x-4 bg-gray px-6 py-4 rounded shadow-lg">
        <span className="text-2xl sm:text-4xl mr-4">Loading</span>
        <svg
          className="animate-spin w-8 h-8 sm:h-12 sm:w-12 text-gray-950"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Loader;
