const trendingData = [
  // Car Categories
  {
    title: "Used Cars under $15,000",
    img: "https://i.ibb.co.com/F2H7Wb6/image.png",
    price: "$12,500",
  },
  {
    title: "Compact SUVs",
    img: "https://i.ibb.co.com/nsPdGCGH/image.png",
    price: "$18,900",
  },
  {
    title: "Electric Cars",
    img: "https://i.ibb.co.com/20DDpz7G/image.png",
    price: "$35,000",
  },
  {
    title: "Luxury Cars",
    img: "https://i.ibb.co.com/JRfzyRkf/image.png",
    price: "$60,000",
  },

  // Property Categories
  {
    title: "Apartments for Rent",
    img: "https://i.ibb.co.com/99PHsJh6/image.png",
    price: "$1,200/month",
  },
  {
    title: "Luxury Villas",
    img: "https://i.ibb.co.com/YBpBvGcM/image.png",
    price: "$850,000",
  },
  {
    title: "Commercial Spaces",
    img: "https://i.ibb.co.com/J0zqqdL/image.png",
    price: "$4,500/month",
  },
  {
    title: "Beachfront Houses",
    img: "https://i.ibb.co.com/BHhxG2CT/image.png",
    price: "$1,200,000",
  },

  // Electronics Categories
  {
    title: "Latest Smartphones",
    img: "https://i.ibb.co.com/67pkRx4v/image.png",
    price: "$999",
  },
  {
    title: "Laptops & Computers",
    img: "https://i.ibb.co.com/Vcz92Py7/image.png",
    price: "$1,500",
  },
  {
    title: "Gaming Consoles",
    img: "https://i.ibb.co.com/v4B1V2Pn/image.png",
    price: "$499",
  },
  {
    title: "Smart TVs",
    img: "https://i.ibb.co.com/jP8DthB1/image.png",
    price: "$1,200",
  },
];

const Card = () => {
  return (
    <div className=" w-11/12 mx-auto p-6">
      <div className="flex flex-col items-center">
        <img
          className="w-12 h-12"
          src="https://i.ibb.co.com/97V5rJ7/images.png"
          alt=""
        />
        <h2 className="text-2xl font-bold mb-4">
          <span className="text-violet-600">Latest</span> Auctions
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {trendingData.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <img src={item.img} className="w-full h-48 object-cover" />
            <div className="p-4 flex justify-between">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="p-1 bg-violet-300 rounded-2xl">{item.price}</p>
            </div>
            <div className="flex justify-center pb-4">
              <button className="bg-violet-700 font-bold p-1 text-white rounded-2xl w-6/12">
                More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
