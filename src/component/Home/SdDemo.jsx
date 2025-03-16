import { Gift, Lock, ThumbsUp, Gem } from "lucide-react";

const SdDemo = () => {
  const features = [
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Buy & Sell Easily",
      description:
        "Effortlessly list and purchase products with a seamless experience.",
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      shadowColor: "shadow-pink-500/20",
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Secure Transaction",
      description:
        "Your payments and data are fully protected with encrypted security.",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
      shadowColor: "shadow-purple-500/20",
    },
    {
      icon: <ThumbsUp className="h-8 w-8" />,
      title: "Products Control",
      description: "Manage your listings, bids, and sales with ease.",
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/20",
    },
    {
      icon: <Gem className="h-8 w-8" />,
      title: "Quality Platform",
      description:
        "A trusted marketplace ensuring high-quality products and services.",
      color: "bg-gradient-to-br from-amber-400 to-orange-500",
      shadowColor: "shadow-amber-400/20",
    },
  ];

  return (
    <div className="w-full py-16 bg-gradient-to-b from-violet-50 to-violet-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Our Amazing Features
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover why thousands of users choose our platform for their
            marketplace needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-xl p-6 transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={`${feature.color} ${feature.shadowColor} text-white p-4 rounded-xl shadow-lg mb-5`}
                >
                  {feature.icon}
                </div>

                <h3 className="font-bold text-xl mb-3 text-gray-800">
                  {feature.title}
                </h3>

                <p className="text-gray-600">{feature.description}</p>

                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 mt-5 group-hover:w-20 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SdDemo;
