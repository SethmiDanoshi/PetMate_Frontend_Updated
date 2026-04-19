// src/pages/PetDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaPaw, FaArrowLeft, FaShoppingCart } from "react-icons/fa";

// Mock data to test
const allPets = [
  {
    id: 1,
    name: "Dexter",
    type: "Dog",
    breed: "Labrador retriever",
    age: "6 Months",
    weight: "12Kgs",
    location: "Moratuwa, Sri Lanka",
    img: "/Dexter.png",
    price: 45000,
    description:
      "Dexter is a playful and loyal dog with a friendly personality. He loves being around people and gets along well with other pets. Dexter is energetic and enjoys long walks, playing fetch, and outdoor adventures. His gentle nature makes him a great companion for families or individuals looking for a loving and faithful friend. Dexter is also smart and quick to learn new tricks, making training a breeze.",
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
  {
    id: 2,
    name: "Luna",
    type: "Cat",
    breed: "Ragdoll Cat",
    age: "3 Years",
    weight: "5Kgs",
    location: "Colombo, Sri Lanka",
    img: "/luna.png",
    price: 30000,
    description: "Luna is a calm and affectionate cat who loves cuddles.",
    seller: {
      name: "Jane Smith",
      sellerId: "PS002",
      address: "Colombo 05",
      contactNumber: "+94 71 234 5678",
      profileImage: "/seller.png",
      rating: 4,
      postedTime: "Posted 1 Hour Ago",
    },
  },
];

export default function PetDetails() {
  const { petId } = useParams(); // /pets/:petId
  const navigate = useNavigate();
  const pet = allPets.find((p) => p.id === Number(petId));

  if (!pet) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Pet not found
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6 pt-5 text-black rounded-xl">
      <div className="flex justify-between bg-pink-600 p-6 rounded-2xl">
        {/* Pet Image & Info */}
        <div className="flex items-start gap-6 ">
          {/* Back Button */}
          <FaArrowLeft
            onClick={() => navigate("/BuyPets")}
            className="text-black text-3xl cursor-pointer hover:text-gray-200"
          />
          <img
            src={pet.img}
            alt={pet.name}
            className="w-52 h-54 object-cover rounded-lg shadow-md bg-white ml-10"
          />
          <div className="ml-10">
            <h1 className="text-4xl font-bold text-white text-center" style={{ fontFamily: 'Itim' }}>{pet.name}</h1>
            <p className="text-white text-2xl pt-3" style={{ fontFamily: 'Instrument Serif' }}>
              Breed: {pet.breed}
            </p>
            <p className="text-white text-2xl pt-3" style={{ fontFamily: 'Instrument Serif' }}>
              Age: {pet.age}
            </p>
            <p className="text-white text-2xl pt-3" style={{ fontFamily: 'Instrument Serif' }}>
              Weight: {pet.weight}
            </p>
            <p className="text-white text-2xl pt-3 pb-3" style={{ fontFamily: 'Instrument Serif' }}>
              Location: {pet.location}
            </p>
            <div className="bg-white text-black px-6 py-2 mt-2  rounded-full font-bold inline-block">
              LKR {pet.price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Cart Icon */}
        <div>
          <FaShoppingCart
            onClick={() => navigate("/Cart")}
            className="text-black text-3xl cursor-pointer hover:text-gray-200"
          />
        </div>
      </div>

      {/* About Pet & Seller Details in Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* About Pet */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold text-pink-600 mb-2" style={{ fontFamily: 'Itim' }}>
            About {pet.name}..
          </h2>
          <p className="text-gray-700">{pet.description}</p>
        </div>

        {/* Seller Details */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold text-pink-600 mb-2" style={{ fontFamily: 'Itim' }}>Seller Details..</h2>
          <div className="flex items-center gap-4">
            <img
              src={pet.seller.profileImage}
              alt={pet.seller.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{pet.seller.name}</p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < pet.seller.rating ? "" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">{pet.seller.postedTime}</span>
          </div>
          <p className="mt-2">
            <b>Seller Id:</b> {pet.seller.sellerId}
          </p>
          <p>
            <b>Address:</b> {pet.seller.address}
          </p>
          <p>
            <b>Contact Number:</b> {pet.seller.contactNumber}
          </p>
        </div>
      </div>

      {/* Action Buttons Centered */}
      <div className="flex justify-center mt-10 p-8 gap-6 bg-pink-600 rounded-2xl">
        <button
          onClick={() => navigate("/wish-list")}
          className="bg-[#640D56] px-6 py-3 rounded-full shadow flex items-center gap-2 font-semibold text-white hover:bg-[#fa3e7d]"
        >
          <FaHeart className="text-pink-600" /> WishList
        </button>
        <button 
        onClick={() => navigate("/TakeMe")}
        className="bg-[#640D56] px-6 py-3 rounded-full shadow flex items-center gap-2 font-semibold text-white hover:bg-[#fa3e7d]">
          Take me Home <FaPaw className="text-pink-600" />
        </button>
      </div>
    </div>
  );
}
