import React from "react";
import { useNavigate } from "react-router-dom";
import SellerSidebar from "../../components/Seller/SellerSidebar";

const SellerProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-white p-6 pt-5 ml-3">
        <div className="flex justify-between items-center pb-5">
          <h1
            className="text-5xl font-bold"
            style={{ fontFamily: "Inika" }}
          >
            Products
          </h1>
        </div>

        {/* Pet Food Items */}
        <div className="relative rounded-lg overflow-hidden h-[250px] w-full mt-6">
          <img
            src="/PetFood.png"
            alt="Pet Food"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-end p-6">
            <div className="flex flex-col items-center">
              <h2
                className="text-3xl font-semibold text-black"
                style={{ fontFamily: "Irish Grover" }}
              >
                Pet Food Items
              </h2>
              <button
                onClick={() => navigate("/seller-products/food")}
                className="mt-3 bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200"
                style={{ fontFamily: "Inria Serif" }}
              >
                View
              </button>
            </div>
          </div>
        </div>

        {/* Pet Accessories */}
        <div className="relative rounded-lg overflow-hidden h-[250px] w-full mt-6">
          <img
            src="/PetAccessories.png"
            alt="Pet Accessories"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-start p-6">
            <div className="flex flex-col items-center">
              <h2
                className="text-3xl font-semibold text-black"
                style={{ fontFamily: "Irish Grover" }}
              >
                Pet Accessories
              </h2>
              <button
                onClick={() => navigate("/seller-products/accessories")}
                className="mt-3 bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200"
                style={{ fontFamily: "Inria Serif" }}
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;
