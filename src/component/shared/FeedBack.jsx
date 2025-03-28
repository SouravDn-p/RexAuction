import React, { useContext } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import ThemeContext from "../Context/ThemeContext";

// Motion Variants
const textVariant = () => ({
  hidden: { opacity: 0, y: -50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
});

const feedbacks = [
  {
    name: "John Doe",
    role: "Buyer",
    date: "March 20, 2025",
    image: "/images/user1.jpg",
    feedback:
      "The auction experience was smooth, and I got a great deal on a rare collectible!",
    iconBg: "#ffcc00",
  },
  {
    name: "Sarah Smith",
    role: "Seller",
    date: "March 18, 2025",
    image: "/images/user2.jpg",
    feedback:
      "Selling my vintage art piece was effortless. The bidding was competitive and rewarding!",
    iconBg: "#ff5733",
  },
  {
    name: "Michael Lee",
    role: "Buyer",
    date: "March 15, 2025",
    image: "/images/user3.jpg",
    feedback:
      "I loved the interface and how transparent the bidding process was. Great experience!",
    iconBg: "#33aaff",
  },

  {
    name: "Emily Carter",
    role: "Seller",
    date: "March 10, 2025",
    image: "/images/user4.jpg",
    feedback:
      "The auction process was seamless, and I got a great price for my antique collection!",
    iconBg: "#ff9800",
  },
  {
    name: "David Johnson",
    role: "Buyer",
    date: "March 8, 2025",
    image: "/images/user5.jpg",
    feedback:
      "Loved the bidding system! I managed to secure a rare watch at an amazing deal.",
    iconBg: "#4caf50",
  },
  {
    name: "Sophia Martinez",
    role: "Seller",
    date: "March 5, 2025",
    image: "/images/user6.jpg",
    feedback:
      "A fantastic platform! Listing my artwork was easy, and I got multiple bids quickly.",
    iconBg: "#e91e63",
  },
  {
    name: "James Wilson",
    role: "Buyer",
    date: "March 3, 2025",
    image: "/images/user7.jpg",
    feedback:
      "Transparent process and fast transactions. Highly recommend for collectors!",
    iconBg: "#9c27b0",
  },
  {
    name: "Olivia Brown",
    role: "Seller",
    date: "March 1, 2025",
    image: "/images/user8.jpg",
    feedback:
      "Selling vintage furniture here was a breeze. Great experience overall!",
    iconBg: "#03a9f4",
  },
];

const FeedbackCard = ({ feedback, isDarkMode }) => (
  <VerticalTimelineElement
    contentStyle={{
      background: isDarkMode ? "#1f2937" : "#fff",
      color: isDarkMode ? "#f9fafb" : "#333",
    }}
    contentArrowStyle={{
      borderRight: `7px solid ${isDarkMode ? "#374151" : "#ddd"}`,
    }}
    date={feedback.date}
    iconStyle={{ background: feedback.iconBg }}
    icon={
      <div className="flex justify-center items-center w-full h-full">
        <img
          src={feedback.image}
          alt={feedback.name}
          className="w-[60%] h-[60%] object-cover rounded-full"
        />
      </div>
    }
  >
    <div>
      <h3
        className={`text-2xl font-bold ${
          isDarkMode ? "text-gray-200" : "text-gray-900"
        }`}
      >
        {feedback.name}
      </h3>
      <p
        className={`text-lg font-semibold ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {feedback.role}
      </p>
    </div>
    <p className="mt-5 text-[14px] tracking-wider text-gray-500 dark:text-gray-300">
      {feedback.feedback}
    </p>
  </VerticalTimelineElement>
);

const Feedback = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <section
      className={`py-16 px-4 rounded-lg ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-purple-100 text-gray-900"
      }`}
    >
      <motion.div
        className="text-center"
        variants={textVariant()}
        initial="hidden"
        animate="show"
      >
        <p className="text-purple-600 dark:text-purple-400 text-lg">
          Real Voices
        </p>
        <h2 className="text-4xl font-bold text-purple-800 dark:text-purple-300">
          Customer Feedback
        </h2>
      </motion.div>

      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {feedbacks.map((feedback, index) => (
            <FeedbackCard
              key={index}
              feedback={feedback}
              isDarkMode={isDarkMode}
            />
          ))}
        </VerticalTimeline>
      </div>
    </section>
  );
};

export default Feedback;
