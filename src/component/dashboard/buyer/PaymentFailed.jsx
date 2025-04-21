import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-lg w-full shadow-lg text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Unfortunately, your payment could not be processed. This might be due to a network issue, invalid card information, or canceled transaction.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/dashboard"
            className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-900 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/auction"
            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
