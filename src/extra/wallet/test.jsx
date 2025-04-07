import React, { useContext, useState } from "react";
import { AuthContexts } from "../../providers/AuthProvider";
import ThemeContext from "../../component/Context/ThemeContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaArrowLeft, FaWallet } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const AddBalance = () => {
  const {
    user,
    setLoading,
    setErrorMessage,
    dbUser,
    setDbUser,
    setWalletBalance,
  } = useContext(AuthContexts);
  const { isDarkMode } = useContext(ThemeContext);
  const [depositAmount, setDepositAmount] = useState(300);
  const [accountNumber, setAccountNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const handleDepositSubmit = async () => {
    console.log(dbUser._id);

    if (!accountNumber) {
      toast.error("Please enter your account number");
      return;
    }

    const updatedBalance = dbUser.accountBalance + Number(depositAmount);
    setWalletBalance(updatedBalance);

    try {
      const res = await axiosPublic.patch(`/accountBalance/${dbUser._id}`, {
        accountBalance: updatedBalance,
      });

      if (res.data.success) {
        Swal.fire(
          "Updated!",
          "User accountBalance has been upgraded.",
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

    toast.success(`Successfully added ${depositAmount} to your wallet!`);
    setShowWalletModal(false);
    setAccountNumber("");
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } py-10 px-4 flex items-center justify-center`}
    >
      <div
        className={`w-full max-w-md rounded-lg shadow-xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`p-4 ${
            isDarkMode
              ? "bg-purple-900"
              : "bg-gradient-to-r from-purple-600 to-purple-500"
          } flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <FaArrowLeft className="text-white" />
            </Link>
            <h2 className="text-xl font-bold text-white">
              Add Money to Wallet
            </h2>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <FaWallet className="text-white text-xl" />
          </div>
        </div>

        {/* Current Balance */}
        <div
          className={`px-6 pt-6 pb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <p className="text-sm">Current Balance</p>
          <p
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {dbUser?.accountBalance?.toLocaleString() || 0} BDT
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="mb-6">
            <label
              className={`block mb-2 text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Amount (Min 300.00 BDT / Max 20,000.00 BDT):
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className={`w-full p-2 border rounded-md ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
              min="300"
              max="20000"
            />
          </div>

          <div className="mb-6">
            <p
              className={`mb-2 text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Please enter or select your deposit amount
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[500, 1000, 2000, 5000, 10000, 20000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDepositAmount(amount)}
                  className={`py-2 border rounded-md ${
                    depositAmount === amount
                      ? isDarkMode
                        ? "bg-purple-700 border-purple-600 text-white"
                        : "bg-purple-100 border-purple-300 text-purple-800"
                      : isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              className={`block mb-2 text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Account number:
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your account number"
              className={`w-full p-2 border rounded-md ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex-1 py-3 ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } text-center font-medium rounded-md transition-colors duration-200`}
            >
              CANCEL
            </button>

            <button
              onClick={handleDepositSubmit}
              disabled={isSubmitting}
              className={`flex-1 py-3 ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white font-medium rounded-md transition-colors duration-200 flex items-center justify-center`}
            >
              {isSubmitting ? (
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
                "CONFIRM"
              )}
            </button>
          </div>

          {/* Payment Methods */}
          <div className="mt-8">
            <p
              className={`text-sm font-medium mb-3 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              RECOMMENDED PAYMENT METHODS
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`border rounded-md p-3 ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <img
                    src="https://i.ibb.co/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                    alt="bKash"
                    className="h-8"
                  />
                  <span className="text-xs font-medium text-green-500">
                    +5%
                  </span>
                </div>
                <p
                  className={`text-center text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Fast bKash
                </p>
              </div>

              <div
                className={`border rounded-md p-3 ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <img
                    src="https://i.ibb.co/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                    alt="Nagad"
                    className="h-8"
                  />
                </div>
                <p
                  className={`text-center text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Fast Nagad
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBalance;
