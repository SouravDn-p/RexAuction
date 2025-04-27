"use client";

import { useState, useEffect, useRef, useContext } from "react";
import {
  Calendar,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Filter,
  Search,
} from "lucide-react";
import { HiOutlinePlus, HiOutlineDocumentDownload } from "react-icons/hi";
import { Link } from "react-router-dom";
import ThemeContext from "../../component/Context/ThemeContext";
import useAuth from "../../hooks/useAuth";
import { jsPDF } from "jspdf";
import rexLogo from "../../assets/Logos/Rex_2.png";

export default function WalletHistory() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const filterRef = useRef(null);
  const { isDarkMode } = useContext(ThemeContext);
  const { dbUser, loading } = useAuth();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  const filteredTransactions =
    dbUser?.transactions?.filter((transaction) => {
      if (!transaction) return false;

      const matchesType =
        filterType === "all" ||
        (filterType === "deposit" && transaction.type === "Deposit") ||
        (filterType === "withdrawal" && transaction.type === "Withdrawal");

      const matchesSearch =
        (transaction.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          transaction.amount?.toString().includes(searchQuery) ||
          transaction.status
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())) ??
        false;

      return matchesType && matchesSearch;
    }) || [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();

      const logoImg = new Image();
      logoImg.src = rexLogo;

      await new Promise((resolve) => {
        logoImg.onload = resolve;
      });

      doc.setFillColor(102, 51, 153);
      doc.rect(0, 0, 210, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Wallet Transaction History", 105, 8, null, null, "center");

      doc.addImage(logoImg, "PNG", 14, 15, 40, 15);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);

      doc.setLineWidth(0.5);
      doc.setDrawColor(102, 51, 153);
      doc.line(14, 40, 200, 40);

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(102, 51, 153);
      doc.text("Account Summary", 14, 50);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      let yPos = 60;

      doc.setFont("helvetica", "bold");
      doc.text("Account Holder:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(dbUser?.displayName || dbUser?.name || "User", 60, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Current Balance:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${formatNumber(dbUser?.accountBalance)} Taka`, 60, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Email:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(dbUser?.email || "Not available", 60, yPos);
      yPos += 15;

      doc.setLineWidth(0.3);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 5, 200, yPos - 5);

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(102, 51, 153);
      doc.text("Transaction History", 14, yPos);
      yPos += 10;

      doc.setFillColor(240, 240, 250);
      doc.rect(14, yPos, 186, 8, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(102, 51, 153);
      doc.text("Date", 16, yPos + 5.5);
      doc.text("Description", 50, yPos + 5.5);
      doc.text("Amount", 120, yPos + 5.5);
      doc.text("Status", 170, yPos + 5.5);
      yPos += 8;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);

      const transactions = filteredTransactions;

      if (transactions.length === 0) {
        doc.text(
          "No transactions found matching your filters",
          105,
          yPos + 10,
          null,
          null,
          "center"
        );
      } else {
        transactions.forEach((transaction, index) => {
          if (index % 2 === 0) {
            doc.setFillColor(248, 248, 255);
            doc.rect(14, yPos, 186, 7, "F");
          }

          const date = formatDate(transaction.date);
          doc.text(date, 16, yPos + 5);

          let description = transaction.description || "N/A";
          if (description.length > 30) {
            description = description.substring(0, 27) + "...";
          }
          doc.text(description, 50, yPos + 5);

          if (transaction.type === "Deposit") {
            doc.setTextColor(46, 125, 50);
          } else {
            doc.setTextColor(198, 40, 40);
          }

          doc.text(`${formatNumber(transaction.amount)} Taka`, 120, yPos + 5);

          doc.setTextColor(0, 0, 0);

          if (transaction.status === "completed") {
            doc.setTextColor(46, 125, 50);
          } else {
            doc.setTextColor(255, 152, 0);
          }

          doc.text(
            transaction.status === "completed" ? "Completed" : "Pending",
            170,
            yPos + 5
          );

          doc.setTextColor(0, 0, 0);

          yPos += 7;

          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
      }

      doc.setFillColor(102, 51, 153);
      doc.rect(0, 287, 210, 10, "F");

      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(
        "Rex Auction © " + new Date().getFullYear(),
        105,
        293,
        null,
        null,
        "center"
      );

      doc.save("wallet-transaction-history.pdf");
      alert("Transaction history has been exported as a PDF document.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-purple-50 to-white"
        }`}
      >
        <p className={isDarkMode ? "text-white" : "text-gray-800"}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <section
      className={`min-h-screen py-10 px-4 flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 to-white"
      }`}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div
          className={`rounded-xl shadow-xl overflow-hidden border transform transition-all duration-300 hover:shadow-2xl ${
            isDarkMode ? "border-gray-700" : "border-purple-100"
          }`}
        >
          <div
            className={`relative overflow-hidden ${
              isDarkMode
                ? "bg-purple-900"
                : "bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500"
            } p-8`}
          >
            {!isDarkMode && (
              <>
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
                  <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white"></div>
                </div>
              </>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  Wallet History
                </h2>
                <p className="text-purple-100 text-sm">
                  Track your financial activities
                </p>
              </div>
              <div
                className="mt-4 md:mt-0 text-right bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20
                transform transition-all duration-300 hover:scale-105"
              >
                <p className="text-sm text-purple-100 font-medium">
                  Current Balance
                </p>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(dbUser?.accountBalance)}{" "}
                  <span className="text-lg">Taka</span>
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 ${
              isDarkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-white text-gray-800"
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Link
                  to={"/addBalance"}
                  className="flex items-center gap-2 bg-purple-700 hover:bg-purple-900 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <HiOutlinePlus className="h-4 w-4" />
                  Add Balance
                </Link>
                

                <button
                  onClick={exportToPDF}
                  className={`flex items-center gap-2 rounded-lg px-5 py-2.5 shadow-md hover:shadow-lg 
                  transition-all duration-300 transform hover:scale-105 ${
                    isDarkMode
                      ? "bg-green-700 hover:bg-green-600 text-white"
                      : "bg-white hover:bg-gray-50 text-purple-700 border border-purple-200"
                  }`}
                >
                  <HiOutlineDocumentDownload />
                  Export PDF
                </button>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full rounded-lg py-2.5 pl-10 pr-4 transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode
                        ? "bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:ring-gray-500"
                        : "bg-white text-gray-700 border border-purple-200 placeholder-gray-500 focus:ring-purple-500"
                    } focus:outline-none focus:ring-2`}
                  />
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                      isDarkMode ? "text-gray-400" : "text-purple-500"
                    }`}
                  />
                </div>

                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center justify-between w-[150px] rounded-lg py-2.5 px-4 
                    transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode
                        ? "bg-gray-700 text-white border border-gray-600 hover:bg-gray-600"
                        : "bg-white text-gray-700 border border-purple-200 hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-purple-500" />
                      <span>
                        {filterType === "all"
                          ? "All Types"
                          : filterType === "deposit"
                          ? "Deposits"
                          : "Withdrawals"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isFilterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isFilterOpen && (
                    <div
                      className={`absolute z-10 mt-1 w-full rounded-lg shadow-lg border 
                      transform transition-all duration-300 origin-top ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-purple-100"
                      }`}
                    >
                      {[
                        { id: "all", label: "All Types" },
                        { id: "deposit", label: "Deposits" },
                        { id: "withdrawal", label: "Withdrawals" },
                      ].map((type) => (
                        <div
                          key={type.id}
                          className={`py-2 px-4 cursor-pointer first:rounded-t-lg last:rounded-b-lg transition-colors duration-200 ${
                            isDarkMode
                              ? "hover:bg-gray-600 text-white"
                              : "hover:bg-purple-50 text-gray-700"
                          } ${
                            filterType === type.id
                              ? isDarkMode
                                ? "bg-gray-600"
                                : "bg-purple-50"
                              : ""
                          }`}
                          onClick={() => {
                            setFilterType(type.id);
                            setIsFilterOpen(false);
                          }}
                        >
                          {type.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl border overflow-hidden ${
                isDarkMode ? "border-gray-700" : "border-purple-100"
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead
                    className={isDarkMode ? "bg-gray-700" : "bg-purple-50"}
                  >
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-sm uppercase tracking-wider whitespace-nowrap">
                        <div
                          className={`flex items-center gap-2 ${
                            isDarkMode ? "text-purple-300" : "text-purple-700"
                          }`}
                        >
                          <Calendar />
                          Date
                        </div>
                      </th>
                      <th
                        className={`text-left py-4 px-6 font-medium text-sm uppercase tracking-wider ${
                          isDarkMode ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        Description
                      </th>
                      <th
                        className={`text-left py-4 px-6 font-medium text-sm uppercase tracking-wider ${
                          isDarkMode ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        Amount
                      </th>
                      <th
                        className={`text-right py-4 px-6 font-medium text-sm uppercase tracking-wider ${
                          isDarkMode ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction, index) => (
                        <tr
                          key={transaction.id}
                          className={`transform transition-all duration-200 hover:scale-[1.01] ${
                            isDarkMode
                              ? "hover:bg-gray-700 border-t border-gray-700"
                              : "hover:bg-purple-50/50 border-t border-purple-100"
                          }`}
                          style={{
                            transitionDelay: `${index * 50}ms`,
                            opacity: 0,
                            animation: `fadeIn 0.5s ease forwards ${
                              index * 0.1
                            }s`,
                          }}
                        >
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div
                              className={`font-medium ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {formatDate(transaction.date)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(transaction.date)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {transaction.description || "N/A"}
                          </td>
                          <td className="py-4 px-6">
                            <div
                              className={`flex items-center gap-1 font-medium ${
                                transaction.type === "Deposit"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {transaction.type === "Deposit" ? (
                                <ArrowDown />
                              ) : (
                                <ArrowUp />
                              )}
                              {formatNumber(transaction.amount)} Taka
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span 貿>
                              {transaction.status === "completed"
                                ? "Completed"
                                : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-gray-500"
                        >
                          No transactions found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              Showing {filteredTransactions.length} of{" "}
              {dbUser?.transactions?.length || 0} transactions
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
