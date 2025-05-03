import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ThemeContext from "../../../Context/ThemeContext";
import axios from "axios";
import LoadingSpinner from "../../../LoadingSpinner";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import {
  FaCalendarAlt,
  FaUserAlt,
  FaEnvelope,
  FaArrowLeft,
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";

const BlogDetails = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `https://rex-auction-server-side-jzyx.onrender.com/blog/${id}`
        );
        setBlog(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4 text-red-500">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Failed to Load Blog</h2>
          <p className="mb-6">
            We couldn't retrieve the blog details. Please try again later.
          </p>
          <Link
            to="/blogs"
            className={`px-6 py-3 rounded-full font-medium inline-flex items-center ${
              isDarkMode
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
          >
            <FaArrowLeft className="mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );

  const galleryImages =
    blog.imageUrls?.map((url) => ({
      original: url,
      thumbnail: url,
      // Add fixed height styling
      originalClass: "gallery-image-height",
      thumbnailClass: "gallery-thumbnail-height",
    })) || [];

  const readingTime = Math.ceil(blog.fullContent.length / 1000);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blog.title,
          text: blog.fullContent.substring(0, 100) + "...",
          url: window.location.href,
        })
        .catch(console.error);
    }
  };

  return (
    <div
      className={`min-h-screen pt-6 pb-14 px-4 md:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-b from-purple-50 via-orange-50 to-pink-50 text-gray-900"
      }`}
    >
      {/* Add CSS for fixed height images */}
      <style>
        {`
                .gallery-image-height {
                    height: 500px;
                    object-fit: cover;
                    width: 100%;
                }
                .gallery-thumbnail-height {
                    height: 80px;
                    object-fit: cover;
                }
                .image-gallery-slide-wrapper {
                    height: 500px;
                }
                .image-gallery-thumbnails-wrapper {
                    margin-top: 10px;
                }
                .image-gallery-content.fullscreen .gallery-image-height {
                    height: 100vh;
                }
                @media (max-width: 768px) {
                    .gallery-image-height {
                        height: 300px;
                    }
                    .image-gallery-slide-wrapper {
                        height: 300px;
                    }
                }
                `}
      </style>

      <div className="max-w-6xl mx-auto">
        <Link
          to="/blogs"
          className={`inline-flex items-center mb-6 px-4 py-2 rounded-full transition-all ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-white hover:bg-gray-100"
          } shadow-sm`}
        >
          <FaArrowLeft className="mr-2" />
          Back to Blogs
        </Link>

        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">
          {blog.title}
        </h1>

        <div
          className={`flex flex-wrap gap-4 mb-8 text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <div className="flex items-center">
            <FaUserAlt className="mr-2" />
            <span>{blog.authorName}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center">
            <IoMdTime className="mr-2" />
            <span>{readingTime} min read</span>
          </div>
          {blog.category && (
            <div className="flex items-center">
              <BiCategoryAlt className="mr-2" />
              <span className="capitalize">{blog.category}</span>
            </div>
          )}
        </div>

        {galleryImages.length > 0 && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-xl">
            <ImageGallery
              items={galleryImages}
              showPlayButton={false}
              showFullscreenButton={true}
              showNav={false}
              slideDuration={500}
              additionalClass="custom-gallery"
            />
          </div>
        )}

        <div
          className={`p-6 md:p-8 rounded-2xl shadow-lg mb-10 transition-all duration-300 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="prose max-w-none dark:prose-invert prose-lg">
            <p className="whitespace-pre-line leading-relaxed">
              {blog.fullContent}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-3 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {isBookmarked ? (
                <FaBookmark className="text-purple-500" />
              ) : (
                <FaRegBookmark />
              )}
            </button>
            <button
              onClick={handleShare}
              className={`p-3 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              aria-label="Share this blog"
            >
              <FaShareAlt />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm">Share:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <FaFacebook className="text-blue-600" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                blog.title
              )}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <FaTwitter className="text-blue-400" />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                window.location.href
              )}&title=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <FaLinkedin className="text-blue-700" />
            </a>
          </div>
        </div>

        {blog.authorBio && (
          <div
            className={`p-6 rounded-2xl shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-xl font-bold mb-4">About the Author</h3>
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-full overflow-hidden ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                {blog.authorImage ? (
                  <img
                    src={blog.authorImage}
                    alt={blog.authorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUserAlt className="text-2xl" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold">{blog.authorName}</h4>
                {blog.authorEmail && (
                  <div className="flex items-center text-sm mb-2">
                    <FaEnvelope className="mr-2" />
                    <span>{blog.authorEmail}</span>
                  </div>
                )}
                <p className="text-sm">{blog.authorBio}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
