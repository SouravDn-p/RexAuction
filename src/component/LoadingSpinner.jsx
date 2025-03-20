const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-16 h-16 border-4 border-dashed border-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
