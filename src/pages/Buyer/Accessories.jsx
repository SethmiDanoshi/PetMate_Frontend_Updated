// src/pages/Accessories.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDog,
  FaCat,
  FaDove,
  FaShoppingCart,
  FaArrowLeft,
  FaSearch,
  FaStar,
  FaHeart,
  FaShare,
} from "react-icons/fa";
import { GiSittingDog } from "react-icons/gi";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BuyerSidebar from "../../components/Buyer/BuyerSidebar";
import PaymentModal from "./PaymnetModal";


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Accessories = () => {
  const navigate = useNavigate();
  const [accessories, setAccessories] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await response.json();
        if (result.status && Array.isArray(result.data)) {
          const accessoriesOnly = result.data.filter(
            (item) => item.type === "accessories"
          );
          setAccessories(accessoriesOnly);
          setFilteredAccessories(accessoriesOnly);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply category & search filters
  useEffect(() => {
    let filtered = accessories;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (acc) => acc.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((acc) =>
        acc.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAccessories(filtered);
  }, [selectedCategory, searchTerm, accessories]);

  const handleBuyNow = (accessory) => {
    setSelectedAccessory(accessory);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log("Payment successful:", paymentIntent);
    // Show success message or redirect
    alert(`Payment successful! Order for ${selectedAccessory.productName} has been placed.`);
  };

  const toggleWishlist = (accessoryId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(accessoryId)) {
        newWishlist.delete(accessoryId);
      } else {
        newWishlist.add(accessoryId);
      }
      return newWishlist;
    });
  };

  const categories = [
    { label: "All", icon: <GiSittingDog size={24} />, count: accessories.length },
    { label: "Dog", icon: <FaDog size={24} />, count: accessories.filter(acc => acc.category?.toLowerCase() === "dog").length },
    { label: "Cat", icon: <FaCat size={24} />, count: accessories.filter(acc => acc.category?.toLowerCase() === "cat").length },
    { label: "Bird", icon: <FaDove size={24} />, count: accessories.filter(acc => acc.category?.toLowerCase() === "bird").length },
  ];

  return (
    <Elements stripe={stripePromise}>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        {/* Sidebar */}
        <BuyerSidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <button
                  onClick={() => navigate("/BuyerDashboard")}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Instrument Serif" }}>
                    Pet Accessories
                  </h1>
                  <p className="text-gray-600 mt-1">Stylish & durable accessories for your beloved pets</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex space-x-2 bg-gray-100 rounded-2xl p-1">
                  {["Pets", "Accessories", "Foods"].map((item) => (
                    <button
                      key={item}
                      onClick={() => navigate(`/${item === "Pets" ? "BuyPets" : item.toLowerCase()}`)}
                      className={`px-6 py-2 rounded-xl transition-all ${
                        item === "Accessories"
                          ? "bg-white shadow-sm text-[#640D56] font-semibold"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      style={{ fontFamily: "Inika" }}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/cart")}
                  className="relative p-3 bg-[#640D56] text-white rounded-2xl hover:bg-[#8A2BE2] transition-colors"
                >
                  <FaShoppingCart className="text-xl" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mt-6 max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search accessories by name, brand, or category..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#640D56] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.label}
                onClick={() => setSelectedCategory(category.label)}
                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${
                  selectedCategory === category.label
                    ? "bg-white shadow-lg border-2 border-[#640D56]"
                    : "bg-white/80 hover:bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <div className={`p-3 rounded-xl ${
                  selectedCategory === category.label ? "bg-[#640D56] text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {category.icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{category.label}</div>
                  <div className="text-sm text-gray-500">{category.count} items</div>
                </div>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Inria Serif" }}>
                Popular Accessories
                <span className="text-sm text-gray-500 font-normal ml-2">
                  ({filteredAccessories.length} products)
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#640D56]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-2">Error loading accessories</div>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : filteredAccessories.length === 0 ? (
              <div className="text-center py-12">
                <GiSittingDog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <div className="text-gray-500 text-lg">No accessories found</div>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAccessories.map((accessory) => (
                  <div
                    key={accessory.id}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image Section */}
                    <div className="relative overflow-hidden">
                      <img
                        src={accessory.imageUrls?.[0] || "https://via.placeholder.com/300x300?text=Accessory"}
                        alt={accessory.productName}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button
                          onClick={() => toggleWishlist(accessory.id)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                            wishlist.has(accessory.id)
                              ? "bg-red-500 text-white"
                              : "bg-white/80 text-gray-600 hover:bg-white"
                          }`}
                        >
                          <FaHeart className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white/80 text-gray-600 rounded-full backdrop-blur-sm hover:bg-white transition-colors">
                          <FaShare className="w-4 h-4" />
                        </button>
                      </div>
                      {accessory.isNew && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          NEW
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {accessory.productName}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <FaStar className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-600">4.5</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {accessory.description || "High-quality pet accessory"}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-[#640D56]">
                            LKR {accessory.price.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">{accessory.brand}</div>
                        </div>
                        
                        <button
                          onClick={() => handleBuyNow(accessory)}
                          className="bg-[#640D56] text-white px-6 py-2 rounded-xl hover:bg-[#8A2BE2] transition-colors font-semibold"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedAccessory && (
          <PaymentModal
            open={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            item={selectedAccessory}
            itemType="accessory"
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </Elements>
  );
};

export default Accessories;