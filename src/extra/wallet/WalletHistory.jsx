"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineArrowDown,
  HiOutlineArrowUp,
  HiOutlineChevronDown,
  HiOutlineDocumentDownload,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import ThemeContext from "../../component/Context/ThemeContext";

export default function WalletHistory() {
  const { isDarkMode } = useContext(ThemeContext);
  const [balance, setBalance] = useState(1250.75);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2023-06-15",
      description: "Deposit",
      amount: 500,
      type: "credit",
      status: "completed",
    },
    {
      id: 2,
      date: "2023-06-10",
      description: "Withdrawal",
      amount: 150,
      type: "debit",
      status: "completed",
    },
    {
      id: 3,
      date: "2023-06-05",
      description: "Purchase - Coffee Shop",
      amount: 8.5,
      type: "debit",
      status: "completed",
    },
    {
      id: 4,
      date: "2023-06-01",
      description: "Salary",
      amount: 2500,
      type: "credit",
      status: "completed",
    },
    {
      id: 5,
      date: "2023-05-28",
      description: "Refund - Online Store",
      amount: 45.99,
      type: "credit",
      status: "pending",
    },
  ]);

  // Navigate to Add Balance page
  const navigateToAddBalance = () => {
    router.push("/addBalance");
  };

  // Export to PDF function
  const exportToPDF = () => {
    // In a real application, you would use a library like jsPDF or react-pdf
    // This is a simplified example that creates a text file instead
    const content =
      `Wallet History\n\nCurrent Balance: $${balance.toFixed(2)}\n\n` +
      transactions
        .map(
          (t) =>
            `${t.date} | ${t.description} | $${t.amount.toFixed(2)} | ${
              t.status
            }`
        )
        .join("\n");

    // Create a blob and download it
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wallet-history.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Alert the user that in a real app this would be a PDF
    alert(
      "In a production app, this would generate a properly formatted PDF document."
    );
  };

  return (
    <section
      className={`min-h-screen pt- ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } py-10 px-4 flex items-center justify-center`}
    >
      <div
        className={`max-w-4xl mx-auto p-4 transition-colors duration-200 dark:bg-gray-900`}
      >
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }  rounded-lg shadow-lg border-0 overflow-hidden transition-colors duration-200`}
        >
          {/* Card Header */}
          <div
            className={`${
              isDarkMode
                ? "bg-purple-900"
                : "bg-gradient-to-r from-purple-600 to-purple-500"
            } rounded-t-lg p-6 transition-colors duration-200`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Wallet History
                </h2>
                <p className="text-white text-sm">
                  Track your financial activities
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white font-medium">
                  Current Balance
                </p>
                <p className="text-3xl font-bold text-white">
                  ${balance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 dark:text-gray-200">
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
                  className={`flex items-center gap-2 rounded-md px-4 py-2 ${
                    isDarkMode
                      ? "bg-green-900 hover:bg-green-700"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  <HiOutlineDocumentDownload className="h-4 w-4" />
                  Export PDF
                </button>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-auto">
                  <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 w-full md:w-[250px] border border-emerald-200 dark:border-gray-600 dark:bg-gray-700  dark:text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Custom Select */}
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center justify-between w-[130px] rounded-md py-2 px-3 transition-colors border 
          ${
            isDarkMode
              ? "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
              : "border-emerald-200 bg-white text-gray-800 hover:bg-emerald-50"
          }
        `}
                  >
                    <span>
                      {filterValue === "all"
                        ? "All"
                        : filterValue === "credit"
                        ? "Credits"
                        : "Debits"}
                    </span>
                    <HiOutlineChevronDown className="h-4 w-4 ml-2" />
                  </button>

                  {isFilterOpen && (
                    <div
                      className={`absolute z-10 mt-1 w-full rounded-md shadow-lg border transition-colors
            ${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-emerald-100"
            }
          `}
                    >
                      {["all", "credit", "debit"].map((type) => (
                        <div
                          key={type}
                          className={`py-1 px-3 cursor-pointer transition-colors 
                ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-white"
                    : "hover:bg-emerald-50 text-gray-800"
                }
              `}
                          onClick={() => {
                            setFilterValue(type);
                            setIsFilterOpen(false);
                          }}
                        >
                          {type === "all"
                            ? "All"
                            : type === "credit"
                            ? "Credits"
                            : "Debits"}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-100 dark:border-gray-700 overflow-hidden transition-colors">
              <table className="w-full">
                <thead className="bg-emerald-50 dark:bg-emerald-900/30 transition-colors">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-emerald-800 dark:text-emerald-300 w-[100px]">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-emerald-800 dark:text-emerald-300">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-emerald-800 dark:text-emerald-300">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-emerald-800 dark:text-emerald-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 border-t border-emerald-100 dark:border-gray-700 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <HiOutlineCalendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                          {transaction.date}
                        </div>
                      </td>
                      <td className="py-3 px-4">{transaction.description}</td>
                      <td className="py-3 px-4">
                        <div
                          className={`flex items-center gap-1 font-medium ${
                            transaction.type === "credit"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <HiOutlineArrowDown className="h-3.5 w-3.5" />
                          ) : (
                            <HiOutlineArrowUp className="h-3.5 w-3.5" />
                          )}
                          ${transaction.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.status === "completed"
                              ? "border border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-900/30"
                              : "border border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:bg-amber-900/30"
                          }`}
                        >
                          {transaction.status === "completed"
                            ? "Completed"
                            : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Showing {transactions.length} of {transactions.length}{" "}
              transactions
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
