// src/pages/accessoriesDetails.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaPaw, FaStar } from "react-icons/fa";

// Mock Accessories Data
const allAccessories = [
  {
    id: 1,
    name: "Dog Belt",
    price: 4500,
    img: "/dogbelt.png",
    description:
      "Our high-quality dog belt is designed for all environments, featuring adjustable straps for a perfect fit and soft padding for comfort. Made from weather-resistant materials with a sturdy metal clasp and D-ring for leash attachment, it's secure and stylish, ideal for daily walks or outdoor adventures. Available in various colors.",
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

export default function AccessoriesDetails() {
  const { accessoryId } = useParams(); // /accessories/:accessoryId
  const navigate = useNavigate();
  const accessory = allAccessories.find((a) => a.id === Number(accessoryId));
  const [quantity, setQuantity] = useState(1);

  if (!accessory) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Accessory not found
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6 text-black rounded-xl">
        <h2 className="text-center text-pink-500 mt-4 text-4xl md:text-4xl pb-6 font-semibold" style={{ fontFamily: 'Instrument Serif' }}>
        Shop now for the best in comfort and care! ❤️
      </h2>
      {/* Top Section */}
      <div className="flex justify-between bg-pink-600 p-6 rounded-2xl items-center">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <FaArrowLeft
            onClick={() => navigate("/Accessories")}
            className="text-black text-3xl cursor-pointer hover:text-gray-200"
          />
          <img
            src={accessory.img}
            alt={accessory.name}
            className="w-52 h-54 object-contain rounded-lg shadow-md bg-white ml-10"
          />
          <div className="ml-10 text-center">
            <h1
              className="text-4xl font-bold text-white"
              style={{ fontFamily: "Itim" }}
            >
              {accessory.name}
            </h1>
            <div className="flex justify-center items-center gap-2 mt-4">
              <span className="bg-white px-6 py-2 rounded-full font-bold text-black">
                LKR {accessory.price.toLocaleString()}
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
            className="text-xl font-bold text-pink-600 mb-2"
            style={{ fontFamily: "Itim" }}
          >
            Premium Adjustable Dog Belt
          </h2>
          <p className="text-sm italic text-red-500">Durable & Comfortable</p>
          <p className="text-gray-700 mt-2">{accessory.description}</p>
        </div>

        {/* Seller Details */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2
            className="text-xl font-bold text-pink-600 mb-2"
            style={{ fontFamily: "Itim" }}
          >
            Seller Details..
          </h2>
          <div className="flex items-center gap-4">
            <img
              src={accessory.seller.profileImage}
              alt={accessory.seller.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{accessory.seller.name}</p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < accessory.seller.rating ? "" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {accessory.seller.postedTime}
            </span>
          </div>
          <p className="mt-2">
            <b>Seller Id:</b> {accessory.seller.sellerId}
          </p>
          <p>
            <b>Address:</b> {accessory.seller.address}
          </p>
          <p>
            <b>Contact Number:</b> {accessory.seller.contactNumber}
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
