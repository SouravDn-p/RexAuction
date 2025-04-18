"use client"

import Swal from "sweetalert2"
import { useState, useContext, useRef } from "react"
import useAuth from "../../../hooks/useAuth"
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import axios from "axios"
import ThemeContext from "../../Context/ThemeContext"
import { motion } from "framer-motion"
import SellerLandingPage from "../buyer/SellerLandingPage"
import { jsPDF } from "jspdf"
import {
  FaFileDownload,
  FaCamera,
  FaCalendarAlt,
  FaDollarSign,
  FaInfoCircle,
  FaHistory,
  FaCheck,
  FaEye,
  FaExclamationTriangle,
} from "react-icons/fa"

const apiKey = import.meta.env.VITE_IMAGE_HOSTING_KEY
const imageHostingApi = `https://api.imgbb.com/1/upload?key=${apiKey}`

export default function CreateAuction() {
  const axiosSecure = useAxiosSecure()
  const { user, dbUser } = useAuth()
  const { isDarkMode } = useContext(ThemeContext)
  const [selectedImages, setSelectedImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [auctionData, setAuctionData] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const formRef = useRef(null)

  const categories = [
    "Electronics",
    "Antiques",
    "Vehicles",
    "Furniture",
    "Jewelry",
    "Art",
    "Fashion",
    "Real Estate",
    "Others",
  ]
  const conditions = ["New", "Like New", "Good", "Fair", "Poor"]

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const maxSize = 5 * 1024 * 1024

    const validImages = files.filter((file) => file.size <= maxSize)
    const invalidImages = files.filter((file) => file.size > maxSize)

    if (invalidImages.length > 0) {
      Swal.fire({
        title: "Error",
        text: "Some images exceed 5MB and were not added.",
        icon: "warning",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      })
    }

    if (validImages.length === 0) return

    if (selectedImages.length < 4) {
      setSelectedImages((prev) => [...prev, ...validImages])
    } else {
      setSelectedImages((prev) => [...prev, ...validImages])
    }
  }

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
  }

  const validateFormData = () => {
    if (!formRef.current) return null

    const form = new FormData(formRef.current)
    const name = form.get("name")
    const category = form.get("category")
    const startingPrice = form.get("startingPrice")
    const startTimeStr = form.get("startTime")
    const endTimeStr = form.get("endTime")
    const description = form.get("description")
    const condition = form.get("condition")
    const itemYear = form.get("itemYear")
    const history = form.get("history")

    if (
      !name ||
      !category ||
      !startingPrice ||
      !startTimeStr ||
      !endTimeStr ||
      !description ||
      !condition ||
      !itemYear ||
      !history
    ) {
      Swal.fire({
        title: "Missing Information",
        text: "Please fill in all required fields",
        icon: "warning",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      })
      return null
    }

    const startTime = new Date(startTimeStr)
    const endTime = new Date(endTimeStr)

    if (endTime <= startTime) {
      Swal.fire({
        title: "Invalid Dates",
        text: "End time must be after the start time",
        icon: "error",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      })
      return null
    }

    return {
      name,
      category,
      startingPrice,
      startTime,
      endTime,
      description,
      condition,
      itemYear,
      history,
      sellerDisplayName: user?.displayName,
      sellerEmail: user?.email,
    }
  }

  const handlePreview = () => {
    const validatedData = validateFormData()
    if (!validatedData) return

    setAuctionData(validatedData)
    setShowPreview(true)

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }, 100)
  }

  const handleDownloadPDF = () => {
    if (!auctionData) {
      const validatedData = validateFormData()
      if (!validatedData) {
        Swal.fire({
          title: "Cannot Generate PDF",
          text: "Please fill in all required fields before downloading the PDF",
          icon: "warning",
          background: isDarkMode ? "#1f2937" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
          confirmButtonColor: "#9333ea",
        })
        return
      }
      setAuctionData(validatedData)
    }

    Swal.fire({
      title: "Generating PDF",
      text: "Creating your auction listing document...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
      background: isDarkMode ? "#1f2937" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    })

    setTimeout(() => {
      const doc = new jsPDF()

      doc.setFillColor(102, 51, 153)
      doc.rect(0, 0, 210, 10, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text("Auction Listing Details", 105, 8, null, null, "center")

      doc.setFontSize(12)
      doc.setTextColor(102, 51, 153)
      doc.setFont("helvetica", "bold")
      doc.text("REX AUCTION", 14, 20)

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25)

      doc.setLineWidth(0.5)
      doc.setDrawColor(102, 51, 153)
      doc.line(14, 30, 200, 30)

      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(102, 51, 153)
      doc.text("Auction Information", 14, 40)

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)

      const detailsX1 = 14
      const detailsX2 = 60
      let yPos = 50

      doc.setFont("helvetica", "bold")
      doc.text("Item Name:", detailsX1, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(auctionData.name, detailsX2, yPos)
      yPos += 8

      doc.setFont("helvetica", "bold")
      doc.text("Category:", detailsX1, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(auctionData.category, detailsX2, yPos)
      yPos += 8

      doc.setFont("helvetica", "bold")
      doc.text("Condition:", detailsX1, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(auctionData.condition, detailsX2, yPos)
      yPos += 8

      doc.setFont("helvetica", "bold")
      doc.text("Year:", detailsX1, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(auctionData.itemYear.toString(), detailsX2, yPos)
      yPos += 8

      doc.setFont("helvetica", "bold")
      doc.text("Starting Price:", detailsX1, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(
        `$${Number.parseFloat(auctionData.startingPrice).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        detailsX2,
        yPos,
      )
      yPos += 8

      doc.setFont("helvetica", "bold")
      doc.text("Start Time:", detailsX1, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(auctionData.startTime.toLocaleString(), detailsX2, yPos)
      yPos += 8

      doc.setFont("helvetica", "bold")
      doc.text("End Time:", detailsX1, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(auctionData.endTime.toLocaleString(), detailsX2, yPos)
      yPos += 15

      doc.setLineWidth(0.3)
      doc.setDrawColor(200, 200, 200)
      doc.line(14, yPos - 5, 200, yPos - 5)

      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(102, 51, 153)
      doc.text("Description", 14, yPos)
      yPos += 10

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)

      const splitDescription = doc.splitTextToSize(auctionData.description, 180)
      doc.text(splitDescription, 14, yPos)

      yPos += splitDescription.length * 7 + 10

      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(102, 51, 153)
      doc.text("History/Provenance", 14, yPos)
      yPos += 10

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)

      const splitHistory = doc.splitTextToSize(auctionData.history, 180)
      doc.text(splitHistory, 14, yPos)

      yPos += splitHistory.length * 7 + 10

      doc.setLineWidth(0.3)
      doc.setDrawColor(200, 200, 200)
      doc.line(14, yPos, 200, yPos)
      yPos += 10

      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(102, 51, 153)
      doc.text("Seller Information", 14, yPos)
      yPos += 10

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)

      doc.setFont("helvetica", "bold")
      doc.text("Seller:", detailsX1, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(auctionData.sellerDisplayName || "Anonymous", detailsX2, yPos)
      yPos += 8

      doc.setFont("helvetica", "bold")
      doc.text("Contact:", detailsX1, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(auctionData.sellerEmail || "No email provided", detailsX2, yPos)

      doc.setFillColor(102, 51, 153)
      doc.rect(0, 287, 210, 10, "F")

      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255)
      doc.text("Rex Auction © " + new Date().getFullYear(), 105, 293, null, null, "center")

      doc.save("auction-listing.pdf")

      Swal.fire({
        title: "PDF Downloaded!",
        html: `
        <div class="text-center">
          <p class="mb-2">Your auction listing has been saved as a PDF document.</p>
          <p class="text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}">You can use this document for your records or share it with others.</p>
        </div>
      `,
        icon: "success",
        confirmButtonColor: "#9333ea",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      })
    }, 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (selectedImages.length < 4) {
      Swal.fire({
        title: "Error",
        text: "Please upload at least 4 images.",
        icon: "error",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      })
      setIsSubmitting(false)
      return
    }

    Swal.fire({
      title: "Creating Auction",
      html: `
        <div class="text-left">
          <p>Uploading images and creating your auction...</p>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
            <div id="progress-bar" class="bg-purple-600 h-2.5 rounded-full" style="width: 0%"></div>
          </div>
          <p id="progress-text" class="text-sm mt-1">0/${selectedImages.length} images uploaded</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      background: isDarkMode ? "#1f2937" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    })

    const validatedData = validateFormData()
    if (!validatedData) {
      setIsSubmitting(false)
      Swal.close()
      return
    }

    const newAuctionData = {
      ...validatedData,
      status: "pending",
      sellerPhotoUrl: dbUser?.photo,
      images: [],
      topBidders: [],
      bids: 0,
      currentBid: 0,
    }

    try {
      const updateProgress = (completed, total) => {
        const progress = Math.round((completed / total) * 100)
        const progressBar = document.getElementById("progress-bar")
        const progressText = document.getElementById("progress-text")
        if (progressBar) progressBar.style.width = `${progress}%`
        if (progressText) progressText.textContent = `${completed}/${total} images uploaded`
      }

      const uploadPromises = selectedImages.map((file, index) => {
        const imageFormData = new FormData()
        imageFormData.append("image", file)
        return axios
          .post(imageHostingApi, imageFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            updateProgress(index + 1, selectedImages.length)
            return response
          })
      })

      const responses = await Promise.all(uploadPromises)
      newAuctionData.images = responses.map((res) => res.data.data.display_url)

      const { data } = await axiosSecure.post("/auctions", newAuctionData)

      setAuctionData(newAuctionData)

      Swal.fire({
        title: "Success!",
        html: `
    <div class="text-center">
      <p class="mb-2">Your auction has been created successfully!</p>
      <p class="text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}">Would you like to download a PDF copy for your records?</p>
    </div>
  `,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#9333ea",
        cancelButtonText: "Download PDF",
        cancelButtonColor: "#4f46e5",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          handleDownloadPDF()
        }
      })

      e.target.reset()
      setSelectedImages([])
      setShowPreview(false)
    } catch (error) {
      console.error("Error creating auction:", error)
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create auction. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {dbUser.role == "seller" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`flex justify-center min-h-screen items-center py-10 ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-purple-100 via-white to-purple-50 text-black"
          }`}
        >
          <div className="container mx-auto px-4">
            <div
              className={`max-w-4xl p-6 md:p-8 mx-auto rounded-xl  ${isDarkMode ? "" : ""}`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>
                  Create New Auction
                </h2>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    <FaEye /> Preview
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isDarkMode
                        ? "bg-indigo-700 hover:bg-indigo-600 text-white"
                        : "bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
                    }`}
                  >
                    <FaFileDownload /> Download PDF
                  </button>
                </div>
              </div>

              {showPreview && auctionData ? (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-8 p-6 rounded-lg ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600"
                      : "bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>
                      Auction Preview
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDownloadPDF}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                          isDarkMode
                            ? "bg-purple-700 hover:bg-purple-600 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                      >
                        <FaFileDownload /> Download PDF
                      </button>
                      <button
                        onClick={() => setShowPreview(false)}
                        className={`px-3 py-2 rounded text-sm ${
                          isDarkMode ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-white/80"}`}>
                      <div className="mb-6">
                        <h4
                          className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}
                        >
                          Item Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex">
                            <span className={`font-medium w-28 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Name:
                            </span>
                            <span>{auctionData.name}</span>
                          </div>
                          <div className="flex">
                            <span className={`font-medium w-28 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Category:
                            </span>
                            <span>{auctionData.category}</span>
                          </div>
                          <div className="flex">
                            <span className={`font-medium w-28 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Condition:
                            </span>
                            <span>{auctionData.condition}</span>
                          </div>
                          <div className="flex">
                            <span className={`font-medium w-28 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Year:
                            </span>
                            <span>{auctionData.itemYear}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4
                          className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}
                        >
                          Auction Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex">
                            <span className={`font-medium w-28 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Starting Price:
                            </span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              $
                              {Number.parseFloat(auctionData.startingPrice).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                          <div className="flex">
                            <span className={`font-medium w-28 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Start Time:
                            </span>
                            <span>{auctionData.startTime.toLocaleString()}</span>
                          </div>
                          <div className="flex">
                            <span className={`font-medium w-28 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              End Time:
                            </span>
                            <span>{auctionData.endTime.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? "bg-gray-700/50" : "bg-white/80"}`}>
                        <h4
                          className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}
                        >
                          Description
                        </h4>
                        <p className="text-sm">{auctionData.description}</p>
                      </div>

                      <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? "bg-gray-700/50" : "bg-white/80"}`}>
                        <h4
                          className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}
                        >
                          History/Provenance
                        </h4>
                        <p className="text-sm">{auctionData.history}</p>
                      </div>

                      <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-white/80"}`}>
                        <h4
                          className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}
                        >
                          Seller Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex">
                            <span className={`font-medium w-20 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Name:
                            </span>
                            <span>{auctionData.sellerDisplayName}</span>
                          </div>
                          <div className="flex">
                            <span className={`font-medium w-20 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Email:
                            </span>
                            <span>{auctionData.sellerEmail}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedImages.length < 4 && (
                    <div
                      className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                        isDarkMode ? "bg-amber-900/30 text-amber-200" : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      <FaExclamationTriangle className="text-amber-500 flex-shrink-0" />
                      <p className="text-sm">Please upload at least 4 images to complete your auction listing.</p>
                    </div>
                  )}
                </motion.div>
              ) : null}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <label
                        className={`flex items-center gap-2 text-sm font-medium ${
                          isDarkMode ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        <FaInfoCircle className="text-xs" /> Auction Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter auction name"
                        className={`w-full border ${
                          isDarkMode
                            ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                            : "border-gray-300 bg-white text-black placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                        } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        className={`flex items-center gap-2 text-sm font-medium ${
                          isDarkMode ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        <FaInfoCircle className="text-xs" /> Category
                      </label>
                      <select
                        name="category"
                        className={`w-full border ${
                          isDarkMode
                            ? "border-gray-700 bg-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                            : "border-gray-300 bg-white text-black focus:ring-purple-500 focus:border-purple-500"
                        } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label
                          className={`flex items-center gap-2 text-sm font-medium ${
                            isDarkMode ? "text-purple-300" : "text-purple-700"
                          }`}
                        >
                          <FaInfoCircle className="text-xs" /> Condition
                        </label>
                        <select
                          name="condition"
                          className={`w-full border ${
                            isDarkMode
                              ? "border-gray-700 bg-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                              : "border-gray-300 bg-white text-black focus:ring-purple-500 focus:border-purple-500"
                          } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                          required
                        >
                          <option value="">Select Condition</option>
                          {conditions.map((cond) => (
                            <option key={cond} value={cond}>
                              {cond}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label
                          className={`flex items-center gap-2 text-sm font-medium ${
                            isDarkMode ? "text-purple-300" : "text-purple-700"
                          }`}
                        >
                          <FaInfoCircle className="text-xs" /> Item Year
                        </label>
                        <input
                          type="number"
                          name="itemYear"
                          min="1000"
                          placeholder="Year"
                          max={new Date().getFullYear()}
                          className={`w-full border ${
                            isDarkMode
                              ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                              : "border-gray-300 bg-white text-black placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                          } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        className={`flex items-center gap-2 text-sm font-medium ${
                          isDarkMode ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        <FaDollarSign className="text-xs" /> Starting Price ($)
                      </label>
                      <input
                        type="number"
                        name="startingPrice"
                        placeholder="Enter starting price"
                        min="0"
                        step="0.01"
                        className={`w-full border ${
                          isDarkMode
                            ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                            : "border-gray-300 bg-white text-black placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                        } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label
                          className={`flex items-center gap-2 text-sm font-medium ${
                            isDarkMode ? "text-purple-300" : "text-purple-700"
                          }`}
                        >
                          <FaCalendarAlt className="text-xs" /> Start Time
                        </label>
                        <input
                          type="datetime-local"
                          name="startTime"
                          className={`w-full border ${
                            isDarkMode
                              ? "border-gray-700 bg-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                              : "border-gray-300 bg-white text-black focus:ring-purple-500 focus:border-purple-500"
                          } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          className={`flex items-center gap-2 text-sm font-medium ${
                            isDarkMode ? "text-purple-300" : "text-purple-700"
                          }`}
                        >
                          <FaCalendarAlt className="text-xs" /> End Time
                        </label>
                        <input
                          type="datetime-local"
                          name="endTime"
                          className={`w-full border ${
                            isDarkMode
                              ? "border-gray-700 bg-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                              : "border-gray-300 bg-white text-black focus:ring-purple-500 focus:border-purple-500"
                          } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <label
                        className={`flex items-center gap-2 text-sm font-medium ${
                          isDarkMode ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        <FaCamera className="text-xs" /> Upload Images (Minimum 4 required)
                      </label>
                      <label
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                          isDarkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50"
                        } transition`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className={`mb-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                            PNG, JPG, JPEG (MAX. 5MB each)
                          </p>
                        </div>
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                      {selectedImages.length > 0 && (
                        <div className="mt-3">
                          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Selected images: {selectedImages.length}/4
                          </p>
                          <div className="flex flex-wrap gap-3 mt-2">
                            {selectedImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(image) || "/placeholder.svg"}
                                  alt={`Preview ${index}`}
                                  className="w-20 h-20 object-cover rounded border shadow-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedImages.length < 4 && (
                        <p className={`text-sm mt-1 ${isDarkMode ? "text-red-300" : "text-red-500"}`}>
                          {selectedImages.length === 0
                            ? "Please upload at least 4 images"
                            : `Please upload ${4 - selectedImages.length} more image(s)`}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label
                        className={`flex items-center gap-2 text-sm font-medium ${
                          isDarkMode ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        <FaInfoCircle className="text-xs" /> Description
                      </label>
                      <textarea
                        name="description"
                        placeholder="Enter detailed description of the item"
                        className={`w-full border ${
                          isDarkMode
                            ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                            : "border-gray-300 bg-white text-black placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                        } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                        rows="4"
                        required
                      ></textarea>
                    </div>

                    <div className="space-y-1">
                      <label
                        className={`flex items-center gap-2 text-sm font-medium ${
                          isDarkMode ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        <FaHistory className="text-xs" /> History/Provenance
                      </label>
                      <textarea
                        name="history"
                        placeholder="Enter item history or provenance"
                        className={`w-full border ${
                          isDarkMode
                            ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                            : "border-gray-300 bg-white text-black placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                        } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                        rows="3"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 gap-4">
                  <div className="flex items-center">
                    <FaCheck className={`mr-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                    <p className="text-sm">Your auction will be reviewed by our team before going live</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || selectedImages.length < 4}
                    className={`w-full sm:w-auto py-3 px-6 rounded-lg font-medium transition ${
                      isSubmitting || selectedImages.length < 4
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
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
                        Creating...
                      </span>
                    ) : (
                      "Create Auction"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      ) : (
        <SellerLandingPage />
      )}
    </>
  )
}
