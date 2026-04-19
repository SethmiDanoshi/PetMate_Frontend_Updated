import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerSidebar from "../../components/Seller/SellerSidebar";
import { getAllPets, getPetsBySellerId } from "../../apis/petApi";

const SellerAllPets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const result = await getPetsBySellerId(uid);
        if (result.status) {
          setPets(result.data);
        } else {
          setPets([]);
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [uid]);

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1
          className="text-4xl font-bold mb-6 mt-4"
          style={{ fontFamily: "Irish Grover" }}
        >
          All My Pets
        </h1>

        {/* Loading & Empty States */}
        {loading ? (
          <p className="text-gray-600">Loading pets...</p>
        ) : pets.length === 0 ? (
          <p className="text-gray-600">No pets available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition"
              >
                <img
                  src={pet.imageUrls?.[0] || "/default-pet.jpg"}
                  alt={pet.name}
                  className="w-40 h-40 object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-bold">{pet.name}</h2>
                <p className="text-gray-600">
                  {pet.type} - {pet.breed}
                </p>
                <p className="text-gray-500">{pet.age}</p>
                <p className="text-green-600 font-semibold mt-2">
                  LKR {pet.price?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{pet.location}</p>
                {/* <button className="mt-4 bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-900">
                  Take me Home
                </button> */}
              </div>
            ))}
          </div>
        )}

        {/* Add New Pet Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/seller-AddNewPet")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            + Add New Pet
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerAllPets;
