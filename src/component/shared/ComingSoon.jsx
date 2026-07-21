const ComingSoon = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800">
        🚧 Coming Soon
      </h1>

      <p className="mt-4 max-w-md text-gray-600">
        This page is currently under development. We're working hard to bring
        you an amazing experience. Stay tuned!
      </p>

      <button
        disabled
        className="mt-8 cursor-not-allowed rounded-lg bg-[#00B466] px-6 py-3 font-medium text-white opacity-80"
      >
        Coming Soon
      </button>
    </div>
  );
};

export default ComingSoon;