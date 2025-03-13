import { FaGift, FaLock, FaThumbsUp, FaGem } from "react-icons/fa";

const FeatureDemo = () => {
  const features = [
    {
      icon: <FaGift />,
      title: "Buy & Sell Easily",
      description:
        " Effortlessly list and purchase products with a seamless experience.",
    },
    {
      icon: <FaLock />,
      title: "Secure Transaction",
      description:
        " Your payments and data are fully protected with encrypted security.",
    },
    {
      icon: <FaThumbsUp />,
      title: "Products Control",
      description: "Manage your listings, bids, and sales with ease.",
    },
    {
      icon: <FaGem />,
      title: "Quality Platform",
      description:
        "A trusted marketplace ensuring high-quality products and services.",
    },
  ];
  return (
    <div>
      <div className="bg-violet-100 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`relative flex items-center justify-center w-20 h-20 rounded-full bg-white text-violet-600 text-3xl`}
              >
                {feature.icon}
              </div>
              <h3 className="mt-4 font-semibold text-lg">{feature.title}</h3>
              <p className="text-gray-600 text-sm px-2">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureDemo;
