
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaPaw, FaStar } from "react-icons/fa";

// Mock Food Data
const allFood = [
  {
    id: 1,
    name: "PEDIGREE DRY DOG FOOD",
    price: 1950,
    img: "/dogfood.png", // replace with actual food image path
    description:
      "This dry dog food offers balanced nutrition with high-quality chicken and vegetables, supporting strong muscles, digestion, coat health, and teeth. Rich in vitamins, minerals, and Omega 6, it's ideal for maintaining your dog's overall health and vitality. Suitable for all adult breeds.",
    nutrition: [
      { label: "Protein", value: "21%" },
      { label: "Fat", value: "10%" },
      { label: "Fiber", value: "5%" },
      { label: "Calcium", value: "1.0%" },
      { label: "Phosphorus", value: "0.8%" },
    ],
    seller: {
      name: "John Doe",
      sellerId: "PS001",
      address: "Katubedda, Moratuwa",
      contactNumber: "+94 76 345 6758",
      profileImage: "/seller.png",
      rating: 3,
      postedTime: "Posted 4 Min Ago",
    },
  },
];

export default function FoodDetails() {
  const { foodId } = useParams(); // /food/:foodId
  const navigate = useNavigate();
  const food = allFood.find((f) => f.id === Number(foodId));
  const [quantity, setQuantity] = useState(1);

  if (!food) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Food item not found
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6 text-black rounded-xl">
      <h2
        className="text-center text-pink-500 mt-4 text-2xl md:text-3xl pb-6 font-semibold"
        style={{ fontFamily: "Instrument Serif" }}
      >
        Nourish Your Pet with the Best! 🐾
      </h2>

      {/* Top Section */}
      <div className="flex justify-between bg-pink-600 p-6 rounded-2xl items-center">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <FaArrowLeft
            onClick={() => navigate("/Foods")}
            className="text-black text-3xl cursor-pointer hover:text-gray-200"
          />
          <img
            src={food.img}
            alt={food.name}
            className="w-52 h-54 object-contain rounded-lg shadow-md bg-white ml-10"
          />
          <div className="ml-10 text-center">
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "Itim" }}
            >
              {food.name}
            </h1>
            <div className="flex justify-center items-center gap-2 mt-4">
              <span className="bg-white px-6 py-2 rounded-full font-bold text-black">
                LKR {food.price.toLocaleString()}
              </span>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-lg font-bold"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Icon */}
        <FaShoppingCart
          onClick={() => navigate("/Cart")}
          className="text-black text-3xl cursor-pointer hover:text-gray-200"
        />
      </div>

      {/* Description & Seller Details */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2
            className="text-xl font-bold text-green-800 mb-2"
            style={{ fontFamily: "Itim" }}
          >
            {food.name}
          </h2>
          <p className="text-gray-700 mt-2">{food.description}</p>

          {/* Nutrition */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800">
              Nutritional Information (Per 100g):
            </h3>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              {food.nutrition.map((item, idx) => (
                <li key={idx}>
                  {item.label}: {item.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Seller Details */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2
            className="text-xl font-bold text-green-800 mb-2"
            style={{ fontFamily: "Itim" }}
          >
            Seller Details..
          </h2>
          <div className="flex items-center gap-4">
            <img
              src={food.seller.profileImage}
              alt={food.seller.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{food.seller.name}</p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < food.seller.rating ? "" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {food.seller.postedTime}
            </span>
          </div>
          <p className="mt-2">
            <b>Seller Id:</b> {food.seller.sellerId}
          </p>
          <p>
            <b>Address:</b> {food.seller.address}
          </p>
          <p>
            <b>Contact Number:</b> {food.seller.contactNumber}
          </p>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-center mt-10 p-8 gap-6 bg-pink-600 rounded-2xl">
        <button
          onClick={() => navigate("/Cart")}
          className="bg-[#640D56] px-6 py-3 rounded-full shadow flex items-center gap-2 font-semibold text-white hover:bg-[#fa3e7d]"
        >
          <FaShoppingCart className="text-pink-600" /> Add to Cart
        </button>

        <button
          onClick={() => navigate("/BuyItem")}
          className="bg-[#640D56] px-6 py-3 rounded-full shadow flex items-center gap-2 font-semibold text-white hover:bg-[#fa3e7d]"
        >
          Buy Item <FaPaw className="text-pink-600" />
        </button>
      </div>
    </div>
  );
}
