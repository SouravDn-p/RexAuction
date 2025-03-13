import { Link } from "react-router-dom";
import animationData from "../../assets/Animation - 1736879773410.json";
import Lottie from "react-lottie-player";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full bg-white rounded-lg  p-8 flex flex-col items-center">
        <div className="w-full flex items-center justify-center mb-6">
          <Lottie
            loop
            animationData={animationData}
            play
            className="w-full max-w-xs"
          />
        </div>
        <div className="w-full flex justify-center">
          <Link to="/" className="text-blue-500 hover:underline font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
