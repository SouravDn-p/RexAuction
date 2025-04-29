import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ThemeContext from "../../../Context/ThemeContext";
import axios from "axios";
import LoadingSpinner from "../../../LoadingSpinner";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const BlogDetails = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/blog/${id}`);
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
    if (isError) return (
        <p className="text-center text-red-500 mt-10 text-lg">Failed to load blog details.</p>
    );

    const galleryImages = blog.imageUrls?.map((url) => ({
        original: url,
        thumbnail: url,
    })) || [];

    return (
        <div
            className={`min-h-screen pt-20 pb-14 px-6 md:px-10 ${isDarkMode
                ? "bg-gray-900 text-white"
                : "bg-gradient-to-b from-purple-100 via-orange-100 to-pink-100 text-gray-900"
                }`}
        >
            {/* Title */}
            <h1 className="max-w-5xl mx-auto text-4xl md:text-5xl font-bold mb-10 text-center leading-tight">
                {blog.title}
            </h1>

            {/* Image Gallery */}
            {galleryImages.length > 0 && (
                <div className="max-w-4xl mx-auto mb-10 rounded-xl overflow-hidden shadow-lg">
                    <ImageGallery items={galleryImages} showPlayButton={false} showFullscreenButton={true} />
                </div>
            )}

            {/* Blog Metadata */}
            <div className="max-w-4xl mx-auto mb-8 text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-2 md:flex-row md:justify-between md:items-center border-b pb-4 border-gray-300 dark:border-gray-600">
                <p className="capitalize">
                    Published: <span className="font-medium">{new Date(blog.createdAt).toLocaleDateString()}</span>
                </p>
                <p>
                    Author: <span className="font-medium">{blog.authorName}</span>
                </p>
                <p>
                    Email: <span className="font-medium">{blog.authorEmail}</span>
                </p>
            </div>

            {/* Full Content */}
            <div className="max-w-4xl mx-auto text-lg leading-relaxed whitespace-pre-line bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                {blog.fullContent}
            </div>
        </div>
    );
};

export default BlogDetails;
