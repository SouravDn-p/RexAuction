import { useLoaderData } from "react-router-dom";

const PaymentSuccess = () => {
  const payment = useLoaderData();

  if (!payment) {
    return (
      <div className="text-center text-red-500 mt-10">
        No payment data found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md mt-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-2">Payment Successful</h2>
        <p className="text-gray-600 dark:text-gray-300">Thank you for your payment!</p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Payment Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Transaction ID:</strong> {payment.trxid}</p>
            <p><strong>Payment ID:</strong> {payment.transactionId}</p>
            <p><strong>Amount Paid:</strong> ৳{payment.price}</p>
            <p><strong>Service Fee:</strong> ৳{payment.serviceFee}</p>
            <p><strong>Bid Amount:</strong> ৳{payment.bidAmount}</p>
            <p><strong>Status:</strong> <span className="text-green-500 font-semibold">{payment.PaymentStatus}</span></p>
            <p><strong>Date:</strong> {new Date(payment.paymentDate).toLocaleString()}</p>
            <p><strong>Auction ID:</strong> {payment.auctionId}</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Buyer Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Name:</strong> {payment.buyerInfo?.name}</p>
            <p><strong>Email:</strong> {payment.buyerInfo?.email}</p>
            <p><strong>Buyer ID:</strong> {payment.buyerId}</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Item Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Item Name:</strong> {payment.itemInfo?.name}</p>
            <p><strong>Category:</strong> {payment.itemInfo?.category}</p>
            <p><strong>Condition:</strong> {payment.itemInfo?.condition}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
