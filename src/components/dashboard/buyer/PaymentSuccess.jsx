import { useLoaderData } from "react-router-dom";
import { jsPDF } from "jspdf";

const PaymentSuccess = () => {
  const payment = useLoaderData();

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    const shipping = 0; // ekhane shipping free dhore nilam
    const total = payment.bidAmount + shipping; // bidAmount + shipping = total

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(36, 66, 120);
    doc.text("Invoice", 105, 20, null, null, "center");

    // Line under title
    doc.setLineWidth(0.5);
    doc.setDrawColor(36, 66, 120);
    doc.line(14, 25, 200, 25);

    // Order Summary
  // Order Summary
doc.setFontSize(14);
doc.setFont("helvetica", "normal");
doc.setTextColor(0, 0, 0);
doc.text("Order Summary", 14, 35);

doc.setFontSize(12);
doc.text("Auction Item:", 14, 45);
doc.text(payment.itemInfo?.name || "Auction Item", 100, 45);

doc.text("Winning Bid:", 14, 55);
doc.text(`${payment.bidAmount?.toLocaleString() || "0.00"} BDT`, 100, 55);

doc.text("Shipping:", 14, 65);
doc.text(`${shipping.toLocaleString()} BDT`, 100, 65);

doc.text("Total:", 14, 75);
doc.text(`${total.toLocaleString()} BDT`, 100, 75);

    // Line under order summary
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 80, 200, 80);

    // Auction Details
    doc.setFontSize(14);
    doc.text("Auction Details", 14, 90);

    doc.setFontSize(12);
    doc.text("Auction ID:", 14, 100);
    doc.text(payment.auctionId || "N/A", 100, 100);

    doc.text("Category:", 14, 110);
    doc.text(payment.itemInfo?.category || "N/A", 100, 110);

    doc.text("Condition:", 14, 120);
    doc.text(payment.itemInfo?.condition || "N/A", 100, 120);

    doc.text("Seller:", 14, 130);
    doc.text(payment.sellerInfo?.name || "N/A", 100, 130);

    // Line under auction details
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 135, 200, 135);

    // Shipping Info
    doc.setFontSize(14);
    doc.text("Buyer Information", 14, 145);

    doc.setFontSize(12);
    doc.text(payment.buyerInfo?.name || "User", 14, 155);
    doc.text(payment.buyerInfo?.email || "user@example.com", 14, 165);

    // Line under shipping info
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 175, 200, 175);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("RexAuction", 14, 185);
    doc.text("support@rexauction.com", 14, 190);
    doc.text("1-800-REX-HELP", 14, 195);

    // Footer Line
    doc.setLineWidth(0.5);
    doc.setDrawColor(36, 66, 120);
    doc.line(14, 200, 200, 200);

    // Save PDF
    const filename = payment.itemInfo?.name
      ? `invoice-${payment.itemInfo.name.replace(/\s+/g, "-").toLowerCase()}.pdf`
      : "invoice.pdf";

    doc.save(filename);
  };

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

        <div className="text-center mt-6">
          <button
            onClick={handleDownloadInvoice}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
