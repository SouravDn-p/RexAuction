const SellingSection = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Start Selling Section */}
        <div className="bg-violet-700 text-white p-10 flex flex-col items-center justify-center">
          <div className="text-center">
            <i className="text-4xl mb-4">💰</i>{" "}
            {/* Replace with an actual icon */}
            <p className="text-sm uppercase"> Turn Your Items into Cash!</p>
            <h2 className="text-3xl font-bold">
              START <span className="text-gray-800">SELLING</span>
            </h2>
            <button className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-500">
              Open Your Shop!
            </button>
          </div>
        </div>

        {/* Start Buying Section */}
        <div className="bg-gray-800 text-white p-10 flex flex-col items-center justify-center">
          <div className="text-center">
            <i className="text-4xl mb-4">🏷️</i>{" "}
            {/* Replace with an actual icon */}
            <p className="text-sm uppercase">
              Bid, Win, and Own Exclusive Items!
            </p>
            <h2 className="text-3xl font-bold">
              <span className=" text-violet-500">START </span> BIDDING
            </h2>
            <button className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700">
              Register Now!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellingSection;
