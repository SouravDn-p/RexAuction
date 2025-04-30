import { useContext, useState, useEffect, useRef } from "react";
import {
  FaLock,
  FaCheckCircle,
  FaInfoCircle,
  FaWallet,
  FaCreditCard,
  FaTag,
  FaShippingFast,
  FaTimes,
} from "react-icons/fa";
import { BsImages, BsArrowsFullscreen } from "react-icons/bs";

import { RiSecurePaymentLine, RiAuctionLine } from "react-icons/ri";
import ThemeContext from "../../Context/ThemeContext";
import { AuthContexts } from "../../../providers/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import LoadingSpinner from "../../LoadingSpinner";

const Payment2 = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { isDarkMode } = useContext(ThemeContext);
  const { user, dbUser, setWalletBalance, setDbUser, loading, setLoading } =
    useContext(AuthContexts);
  const location = useLocation();
  const navigate = useNavigate();
  const [auctionData, setAuctionData] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [modalImage, setModalImage] = useState(0);
  const [payments, setPayments] = useState([]);
  const modalRef = useRef(null);
  const [isPaid, setIsPaid] = useState(false);
  const [hasWalletSufficientBalance, setHasWalletSufficientBalance] =
    useState(false);
  const axiosPublic = useAxiosPublic();
  const [payment, setPayment] = useState("");
  console.log(auctionData);
  // const [id ,setId] = useState([])

  // auction id get
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosPublic.get("/payments");
        const result = response.data;
        setPayments(result);

        if (auctionData?._id) {
          const matched = result.find(
            (item) => item.auctionId === auctionData._id
          );
          setPayment(matched);
          setIsPaid(matched?.PaymentStatus === "success");
          if (dbUser?.accountBalance >= calculateTotal()) {
            setHasWalletSufficientBalance(true);
          }
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, [auctionData]);

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        let auctionInfo = null;

        // Get auction data from location state
        if (location.state?.auctionData) {
          auctionInfo = location.state.auctionData;
          console.log("Auction data from location state:", auctionInfo);
        } else if (location.state?.notificationDetails?.auctionData) {
          auctionInfo = location.state.notificationDetails.auctionData;
          console.log("Auction data from notification details:", auctionInfo);
        }

        // If we have an auction ID but no complete data, fetch it from the server
        if (
          auctionInfo?._id &&
          (!auctionInfo.payment || !auctionInfo.paymentDetails)
        ) {
          console.log(
            "Fetching complete auction data from server for ID:",
            auctionInfo._id
          );
          try {
            const response = await axiosPublic.get(
              `/auction/${auctionInfo._id}`
            );
            if (response.data) {
              auctionInfo = response.data;
              console.log("Fetched auction data:", auctionInfo);
            }
          } catch (error) {
            console.error("Error fetching auction data from server:", error);
          }
        }

        if (auctionInfo) {
          setAuctionData(auctionInfo);

          // Check payment status
          if (auctionInfo.payment === "done") {
            console.log("Payment already completed for this auction");
            setPaymentSuccess(true);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in fetchAuctionData:", error);
        setLoading(false);
      }
    };

    fetchAuctionData();
  }, [location, axiosPublic]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowDetailsModal(false);
      }
    };

    if (showDetailsModal) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [showDetailsModal]);

  // Update the handleCreatePayment function to update the database
  const handleCreatePayment = async () => {
    if (!auctionData) return;
    setProcessingPayment(true);

    try {
      const paymentData = {
        auctionId: auctionData._id,
        Description: "Payment",
        price: calculateTotal(),
        serviceFee: calculateServiceFee(),
        bidAmount: auctionData.currentBid,
        transactionId: `TXN-${Date.now()}`,
        buyerId: dbUser?._id || user?.uid || "unknown",
        sellerId: auctionData.sellerId || "unknown",
        buyerInfo: {
          name: user?.name || "User",
          email: user?.email || "user@example.com",
          photoUrl: user?.photoURL || null,
        },
        sellerInfo: {
          name: auctionData.sellerDisplayName,
          email: auctionData.sellerEmail,
          photoUrl: auctionData.sellerPhotoUrl || null,
        },
        itemInfo: {
          name: auctionData.name,
          category: auctionData.category,
          condition: auctionData.condition,
          images: auctionData.images,
        },
        paymentDate: new Date(),
        PaymentStatus: "pending",
        PaymentMethod: "SSlcommerz",
      };

      const updatedBalance = dbUser.accountBalance - calculateTotal();
      setWalletBalance(updatedBalance);

      const transaction = {
        id: (dbUser?.transactions?.length || 0) + 1,
        date: new Date().toISOString(),
        description: `Deposit ${Number(calculateTotal())} Taka`,
        amount: Number(calculateTotal()),
        type: "Withdrawal",
        status: "completed",
      };
      const response = await axiosPublic.post("/paymentsWithSSL", paymentData);
      // const res = await axiosPublic.post("/paymentConfirmation", auctionData._id);

      // With this:
      //       const res = await axiosPublic.post("/paymentConfirmation", {
      //   auctionId: auctionData._id,
      // });

      if (response.data?.gatewayURL) {
        window.location.replace(response.data.gatewayURL);
      } else {
        // Payment failed
        setProcessingPayment(false);
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: "Payment processing failed. Please try again.",
        });

        return;
      }

      try {
        const res = await axiosPublic.patch(`/accountBalance/${dbUser._id}`, {
          accountBalance: updatedBalance,
          transaction,
        });

        if (res.data.success) {
          Swal.fire(
            "Updated!",
            "User accountBalance has been updated.",
            "success"
          );
          if (user?.email) {
            setLoading(true);
            axiosPublic
              .get(`/user/${user.email}`)
              .then((res) => {
                setDbUser(res.data);
                setLoading(false);
              })
              .catch((error) => {
                console.error("Error fetching user data:", error);
                setErrorMessage("Failed to load user data");
                setLoading(false);
              });
          }
        } else {
          Swal.fire("Failed!", "Could not update user role.", "error");
        }
      } catch (error) {
        console.error("Error updating role:", error);
        Swal.fire("Error!", "Something went wrong!", "error");
      }

      // Create notification for seller
      await axiosPublic.post("/notifications", {
        title: "Payment Received",
        message: `Payment for ${auctionData.name} has been completed`,
        type: "payment",
        recipient: auctionData.sellerEmail,
        auctionData: {
          _id: auctionData._id,
          name: auctionData.name,
          image: auctionData.images?.[0] || null,
        },
        read: false,
      });

      // Create notification for admin
      await axiosPublic.post("/notifications", {
        title: "New Payment Completed",
        message: `Payment of ৳${calculateTotal()} for ${
          auctionData.name
        } has been completed by ${user?.name || "User"}`,
        type: "payment",
        recipient: "admin",
        paymentData: {
          transactionId: paymentData.transactionId,
          price: calculateTotal(),
          buyerEmail: user?.email,
          sellerEmail: auctionData.sellerEmail,
          auctionId: auctionData._id,
          auctionName: auctionData.name,
          paymentMethod: paymentMethod,
          paymentDate: new Date(),
        },
        read: false,
      });

      // Redirect after success
      setTimeout(() => {
        navigate(`dashboard/payments/:${paymentData.trxid}`, {
          state: {
            trxid: paymentData.trxid, // use trxid here
            auctionData: {
              ...auctionData,
              status: "success",
              paymentDetails: paymentData,
            },
            paymentMethod,
            amount: calculateTotal(),
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setProcessingPayment(false);
      toast.error(
        "An error occurred during payment processing. Please try again."
      );
    }
  };
  // Update the handleRexPayment function to update the database
  const handleRexPayment = async () => {
    if (dbUser?.accountBalance < calculateTotal()) {
      Swal.fire({
        icon: "error",
        title: "Not Enough Money",
        text: "You do not have sufficient balance to complete this action.",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    if (!auctionData) return;
    setProcessingPayment(true);

    try {
      const paymentData = {
        auctionId: auctionData._id,
        Description: "Payment",
        price: calculateTotal(),
        serviceFee: calculateServiceFee(),
        bidAmount: auctionData.currentBid,
        transactionId: `TXN-${Date.now()}`,
        buyerId: dbUser?._id || user?.uid || "unknown",
        sellerId: auctionData.sellerId || "unknown",
        buyerInfo: {
          name: user?.displayName || "User",
          email: user?.email || "user@example.com",
          photoUrl: user?.photoURL || null,
        },
        sellerInfo: {
          name: auctionData?.sellerDisplayName,
          email: auctionData.sellerEmail,
          photoUrl: auctionData.sellerPhotoUrl || null,
        },
        itemInfo: {
          name: auctionData.name,
          category: auctionData.category,
          condition: auctionData.condition,
          images: auctionData.images,
        },
        paymentDate: new Date(),
        PaymentStatus: "success",
        PaymentMethod: "rex wallet",
      };

      const updatedBalance = dbUser.accountBalance - calculateTotal();
      setWalletBalance(updatedBalance);

      const transaction = {
        id: (dbUser?.transactions?.length || 0) + 1,
        date: new Date().toISOString(),
        description: `Payment ${calculateTotal()} Taka`,
        amount: calculateTotal(),
        type: "Withdrawals",
        status: "completed",
      };

      // First: Send payment data
      const paymentResponse = await axiosPublic.post(
        "/rexPayment",
        paymentData
      );

      if (paymentResponse?.data?.success) {
        // Then: Update account balance
        const balanceResponse = await axiosPublic.patch(
          `/accountBalance/${dbUser._id}`,
          {
            accountBalance: updatedBalance,
            transaction,
          }
        );

        if (balanceResponse?.data?.success) {
          setIsPaid(true);
          Swal.fire(
            "Success!",
            "Payment and balance updated successfully.",
            "success"
          );

          // Refresh user data
          if (user?.email) {
            setLoading(true);
            axiosPublic
              .get(`/user/${user.email}`)
              .then((res) => {
                setDbUser(res.data);
                setLoading(false);
              })
              .catch((error) => {
                console.error("Error fetching user data:", error);
                setLoading(false);
              });
          }
        } else {
          Swal.fire(
            "Failed!",
            "Payment done but balance update failed.",
            "warning"
          );
        }

        // Create notifications
        await Promise.all([
          axiosPublic.post("/notifications", {
            title: "Payment Received",
            message: `Payment for ${auctionData.name} has been completed.`,
            type: "payment",
            recipient: auctionData.sellerEmail,
            auctionData: {
              _id: auctionData._id,
              name: auctionData.name,
              image: auctionData.images?.[0] || null,
            },
            read: false,
          }),
          axiosPublic.post("/notifications", {
            title: "New Payment Completed",
            message: `Payment of ৳ ${calculateTotal()} for ${
              auctionData.name
            } has been completed by ${user?.name || "User"}.`,
            type: "payment",
            recipient: "admin",
            paymentData: {
              transactionId: paymentData.transactionId,
              price: calculateTotal(),
              buyerEmail: user?.email,
              sellerEmail: auctionData.sellerEmail,
              auctionId: auctionData._id,
              auctionName: auctionData.name,
              paymentMethod: paymentData.PaymentMethod,
              paymentDate: new Date(),
            },
            read: false,
          }),
        ]);
      } else {
        Swal.fire("Payment Failed", "Could not process the payment.", "error");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        "An error occurred during payment processing. Please try again."
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  // Calculate service fee
  const calculateServiceFee = () => {
    if (!auctionData || !auctionData.currentBid) return 0;
    return Math.round(auctionData.currentBid * 0.01);
  };

  // Calculate total amount
  const calculateTotal = () => {
    if (!auctionData || !auctionData.currentBid) return 0;
    return auctionData.currentBid + calculateServiceFee();
  };

  // Open details modal
  const openDetailsModal = (imageIndex = 0) => {
    setModalImage(imageIndex);
    setShowDetailsModal(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!auctionData) {
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">No Auction Data Found</h2>
        <p className="mb-6">Unable to find auction details for this payment.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div
          className={`max-w-md w-full p-8 rounded-2xl shadow-xl ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>

            {auctionData.payment === "done" ? (
              <div className="text-center space-y-4 w-full">
                <p className="text-center mb-2 text-gray-500">
                  You have already completed payment for this auction.
                </p>

                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-green-900/20" : "bg-green-50"
                  } border ${
                    isDarkMode ? "border-green-800" : "border-green-200"
                  }`}
                >
                  <div className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-600 dark:text-green-400">
                        Payment Completed
                      </p>
                      {auctionData.paymentDetails && (
                        <>
                          <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-1">
                            Transaction ID:{" "}
                            {auctionData.paymentDetails.transactionId || "N/A"}
                          </p>
                          <p className="text-sm text-green-600/70 dark:text-green-400/70">
                            Date:{" "}
                            {auctionData.paymentDetails.paymentDate
                              ? new Date(
                                  auctionData.paymentDetails.paymentDate
                                ).toLocaleString()
                              : "N/A"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                  } border ${
                    isDarkMode ? "border-blue-800" : "border-blue-200"
                  } mt-3`}
                >
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Your item will be delivered soon. You can track your order
                    in the dashboard.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center mb-6 text-gray-500">
                Your payment for {auctionData.name} has been processed
                successfully.
              </p>
            )}

            <div className="w-full space-y-3 mt-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Return to Dashboard
              </button>

              {auctionData.payment === "done" && (
                <button
                  onClick={() => navigate("/dashboard/orders")}
                  className={`w-full py-3 rounded-lg border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-700 hover:bg-gray-600 text-white"
                      : "border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
                  }`}
                >
                  View Order Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-200" : " text-gray-900"
      }`}
    >
      {/* Sticky Header with Progress Bar */}
      <div
        className={` ${
          isDarkMode
            ? "bg-gray-900 border-b border-gray-800"
            : "bg-gray-100 border-b border-gray-200"
        } shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className={`p-2 rounded-full ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-100"
                } shadow-md`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h2 className="text-2xl font-bold">Secure Checkout</h2>
            </div>
            <div className="flex items-center gap-2">
              <RiSecurePaymentLine className="text-green-500 text-xl" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
          </div>

          <div className="flex justify-between relative mb-2">
            <div
              className={`h-1 absolute top-4 left-0 right-0 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            ></div>

            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-purple-600" : "bg-purple-500"
                } text-white`}
              >
                1
              </div>
              <span className="text-sm mt-2">Review</span>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-purple-600" : "bg-purple-500"
                } text-white`}
              >
                2
              </div>
              <span className="text-sm mt-2">Payment</span>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-300"
                }`}
              >
                3
              </div>
              <span className="text-sm mt-2">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Order Summary (50% on desktop) */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div
              className={`rounded-xl shadow-lg overflow-hidden sticky top-32 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`p-6 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-purple-900/70 to-indigo-900/70"
                    : "bg-gradient-to-r from-purple-100 to-indigo-100"
                } border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } flex items-center justify-between`}
              >
                <div className="flex items-center">
                  <RiAuctionLine
                    className={`mr-2 text-xl ${
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                  <h3 className="text-xl font-bold">Order Summary</h3>
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 font-medium">
                  Auction Won
                </div>
              </div>

              <div className="p-6">
                {/* Product info with animated border */}
                <div className="mb-6">
                  <div
                    className={`relative p-0.5 rounded-xl overflow-hidden ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    } group`}
                  >
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div
                      className={`relative flex items-start gap-4 p-4 rounded-xl ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      {auctionData.images?.[0] ? (
                        <img
                          src={
                            auctionData.images[selectedImage] ||
                            "/placeholder.svg"
                          }
                          alt={auctionData.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div
                          className={`w-20 h-20 flex items-center justify-center rounded-lg ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          <span className="text-2xl">🖼️</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-lg">
                          {auctionData.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              isDarkMode
                                ? "bg-purple-900/30 text-purple-300"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {auctionData.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              isDarkMode
                                ? "bg-blue-900/30 text-blue-300"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {auctionData.condition}
                          </span>
                        </div>
                        <button
                          onClick={() => openDetailsModal(selectedImage)}
                          className={`mt-2 text-sm flex items-center px-3 py-1 rounded-full transition-all duration-300 ${
                            isDarkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-purple-500 hover:text-white"
                          }`}
                        >
                          <BsArrowsFullscreen className="mr-1" />
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Gallery - Small preview */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-sm flex items-center">
                    <BsImages className="mr-2" />
                    Image Gallery
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {auctionData.images?.map((img, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedImage(index)}
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`${auctionData.name} ${index + 1}`}
                          className={`h-16 w-16 object-cover rounded-md transition-all duration-300 ${
                            selectedImage === index
                              ? "ring-2 ring-purple-500 scale-105"
                              : "hover:ring-1 hover:ring-purple-400 hover:scale-105"
                          }`}
                        />
                        <div
                          className={`absolute inset-0 rounded-md ${
                            selectedImage === index
                              ? "bg-purple-500/20"
                              : "bg-black/0 group-hover:bg-black/10"
                          } transition-all duration-300`}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price breakdown */}
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-700/80 to-gray-700/50"
                      : "bg-gradient-to-br from-purple-50 to-indigo-50"
                  }`}
                >
                  <h4 className="font-medium mb-3 flex items-center">
                    <FaTag className="mr-2" />
                    Price Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        Winning Bid
                      </span>
                      <span className="font-medium">
                        ৳{auctionData.currentBid?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        Service Fee (1%)
                      </span>
                      <span className="font-medium">
                        ৳{calculateServiceFee().toLocaleString()}
                      </span>
                    </div>
                    <div className="h-px bg-gray-300 dark:bg-gray-600 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <motion.span
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.5, repeat: 0 }}
                        className={`font-bold text-lg ${
                          isDarkMode ? "text-purple-400" : "text-purple-700"
                        }`}
                      >
                        ৳{calculateTotal().toLocaleString()}
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-100"
                  }`}
                >
                  <h4 className="font-medium mb-2 flex items-center">
                    <FaShippingFast className="mr-2" />
                    Shipping Information
                  </h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }
                      >
                        Recipient
                      </span>
                      <span className="font-medium">
                        {user?.name || "User"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }
                      >
                        Email
                      </span>
                      <span className="font-medium">
                        {user?.email || "user@example.com"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }
                      >
                        Estimated Delivery
                      </span>
                      <span className="font-medium">3-5 Business Days</span>
                    </div>
                  </div>
                </div>

                {/* Security note */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center text-gray-400 text-sm">
                    <FaLock className="mr-2" />
                    <span>Your information is secure and encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Payment methods (50% on desktop) */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div
              className={`rounded-xl shadow-lg overflow-hidden mb-6 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`p-6 ${
                  isDarkMode ? "bg-gray-750" : "bg-gray-50"
                } border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3 className="text-xl font-bold">Choose Payment Method</h3>
              </div>

              <div className="p-6 space-y-4">
                {/* Wallet Payment */}
                <div
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "wallet"
                      ? isDarkMode
                        ? "border-purple-500 bg-purple-900/20"
                        : "border-purple-500 bg-purple-50"
                      : isDarkMode
                      ? "border-gray-700 hover:border-gray-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("wallet")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-3 rounded-lg ${
                          isDarkMode ? "bg-purple-900/30" : "bg-purple-100"
                        }`}
                      >
                        <FaWallet className="text-xl text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Rex Wallet</h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Balance:{" "}
                          {dbUser?.accountBalance?.toLocaleString() || 0} BDT
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "wallet"
                            ? isDarkMode
                              ? "border-purple-500"
                              : "border-purple-600"
                            : isDarkMode
                            ? "border-gray-600"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "wallet" && (
                          <div
                            className={`w-3 h-3 rounded-full ${
                              isDarkMode ? "bg-purple-500" : "bg-purple-600"
                            }`}
                          ></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {paymentMethod === "wallet" && (
                    <div
                      className={`mt-4 p-4 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      {hasWalletSufficientBalance ? (
                        <div className="flex items-center text-green-500">
                          <FaCheckCircle className="mr-2" />
                          <span>Sufficient balance for this purchase</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center text-yellow-500 mb-2">
                            <FaInfoCircle className="mr-2" />
                            <span>Insufficient balance for this purchase</span>
                          </div>
                          <button
                            onClick={() => navigate("/dashboard/walletHistory")}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                          >
                            Add Balance
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Credit Card Payment */}
                <div
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-900/20"
                        : "border-blue-500 bg-blue-50"
                      : isDarkMode
                      ? "border-gray-700 hover:border-gray-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-3 rounded-lg ${
                          isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
                        }`}
                      >
                        <FaCreditCard className="text-xl text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Credit / Debit Card</h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Visa, Mastercard, American Express
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "card"
                            ? isDarkMode
                              ? "border-blue-500"
                              : "border-blue-600"
                            : isDarkMode
                            ? "border-gray-600"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "card" && (
                          <div
                            className={`w-3 h-3 rounded-full ${
                              isDarkMode ? "bg-blue-500" : "bg-blue-600"
                            }`}
                          ></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            {paymentMethod === "card" ? (
              <div
                className={`rounded-xl shadow-lg overflow-hidden mb-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } p-6`}
              >
                <button
                  onClick={handleCreatePayment}
                  disabled={
                    processingPayment ||
                    isPaid ||
                    (paymentMethod === "wallet" && !hasWalletSufficientBalance)
                  }
                  className={`w-full py-4 rounded-lg font-semibold transition flex items-center justify-center ${
                    processingPayment ||
                    isPaid ||
                    (paymentMethod === "wallet" && !hasWalletSufficientBalance)
                      ? "bg-gray-500 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                      : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg"
                  }`}
                >
                  {processingPayment ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" />
                      {isPaid ? "Payment Completed" : "Pay Now"}
                    </>
                  )}
                </button>

                {/* Security badges */}
                <div className="mt-6 flex flex-wrap justify-center gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <FaLock className="text-green-500" />
                    <span className="text-sm font-medium">
                      Secure Encryption
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiSecurePaymentLine className="text-blue-500" />
                    <span className="text-sm font-medium">
                      PCI DSS Compliant
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    <span className="text-sm font-medium">
                      Verified by Visa
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-xl shadow-lg overflow-hidden mb-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } p-6`}
              >
                <button
                  onClick={handleRexPayment}
                  disabled={
                    processingPayment ||
                    isPaid ||
                    (paymentMethod === "wallet" && !hasWalletSufficientBalance)
                  }
                  className={`w-full py-4 rounded-lg font-semibold transition flex items-center justify-center ${
                    processingPayment ||
                    isPaid ||
                    (paymentMethod === "wallet" && !hasWalletSufficientBalance)
                      ? "bg-gray-500 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                      : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg"
                  }`}
                >
                  {processingPayment ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" />
                      {isPaid ? "Payment Completed" : "Pay With Rex Wallet "}
                    </>
                  )}
                </button>

                {/* Security badges */}
                <div className="mt-6 flex flex-wrap justify-center gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <FaLock className="text-green-500" />
                    <span className="text-sm font-medium">
                      Secure Encryption
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiSecurePaymentLine className="text-blue-500" />
                    <span className="text-sm font-medium">
                      PCI DSS Compliant
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    <span className="text-sm font-medium">
                      Verified by Visa
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={closeDetailsModal}
            >
              <div
                className={`absolute inset-0 ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-500"
                } opacity-75`}
              ></div>
            </div>

            {/* Modal content */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              ref={modalRef}
              className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className={`bg-transparent rounded-md text-gray-400 hover:text-gray-500 focus:outline-none`}
                  onClick={closeDetailsModal}
                >
                  <span className="sr-only">Close</span>
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-2xl leading-6 font-bold mb-4">
                      {auctionData.name}
                    </h3>

                    {/* Main image */}
                    <div className="mb-4">
                      <img
                        src={
                          auctionData.images?.[modalImage] || "/placeholder.svg"
                        }
                        alt={auctionData.name}
                        className="w-full h-64 object-contain rounded-lg shadow-md mx-auto"
                      />
                    </div>

                    {/* Image thumbnails */}
                    <div className="grid grid-cols-4 gap-2 mb-6">
                      {auctionData.images?.map((img, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer rounded-md overflow-hidden ${
                            modalImage === index ? "ring-2 ring-purple-500" : ""
                          }`}
                          onClick={() => setModalImage(index)}
                        >
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`${auctionData.name} ${index + 1}`}
                            className="w-full h-16 object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Auction details */}
                    <div
                      className={`p-4 rounded-lg mb-4 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <h4 className="font-semibold mb-3">Auction Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Category
                          </p>
                          <p className="font-medium">{auctionData.category}</p>
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Condition
                          </p>
                          <p className="font-medium">{auctionData.condition}</p>
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Year
                          </p>
                          <p className="font-medium">{auctionData.itemYear}</p>
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Auction ID
                          </p>
                          <p className="font-medium">
                            {auctionData._id.substring(0, 10)}...
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Seller
                          </p>
                          <p className="font-medium">
                            {auctionData.sellerDisplayName}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            End Time
                          </p>
                          <p className="font-medium">
                            {new Date(auctionData.endTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {auctionData.description && (
                      <div
                        className={`p-4 rounded-lg ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm">{auctionData.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                  isDarkMode ? "bg-gray-750" : "bg-gray-50"
                }`}
              >
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDetailsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment2;
