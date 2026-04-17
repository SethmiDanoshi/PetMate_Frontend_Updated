import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaDog, 
  FaCat, 
  FaDove, 
  FaShoppingCart, 
  FaArrowLeft,
  FaHeart,
  FaShare,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaWeight,
  FaEye,
  FaTimes,
  FaStar
} from "react-icons/fa";
import { GiSittingDog } from "react-icons/gi";
import { getAllPets, getPetsByPetId } from "../../apis/petApi";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentModal from "./PaymnetModal";
import { enqueueSnackbar } from "notistack";
import BuyerSidebar from "../../components/Buyer/BuyerSidebar";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const BuyPets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPetDetails, setShowPetDetails] = useState(false);
  const [petDetails, setPetDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());

  // Fetch pets from API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await getAllPets();
        setPets(response.data || []);
      } catch (error) {
        console.error("Error fetching pets:", error);
        enqueueSnackbar("Error loading pets", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const fetchPetDetails = async (petId) => {
    try {
      setLoadingDetails(true);
      const response = await getPetsByPetId(petId);
      setPetDetails(response.data);
      setShowPetDetails(true);
    } catch (error) {
      console.error("Error fetching pet details:", error);
      enqueueSnackbar("Error loading pet details", { variant: "error" });
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredPets =
    selectedCategory === "All"
      ? pets
      : pets.filter((pet) => pet.type === selectedCategory);

  const toggleWishlist = (petId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(petId)) {
        newWishlist.delete(petId);
        enqueueSnackbar("Removed from wishlist", { variant: "info" });
      } else {
        newWishlist.add(petId);
        enqueueSnackbar("Added to wishlist", { variant: "success" });
      }
      return newWishlist;
    });
  };

  const categories = [
    { label: "All", icon: <GiSittingDog size={24} />, count: pets.length },
    { label: "Dog", icon: <FaDog size={24} />, count: pets.filter(pet => pet.type === "Dog").length },
    { label: "Cat", icon: <FaCat size={24} />, count: pets.filter(pet => pet.type === "Cat").length },
    { label: "Bird", icon: <FaDove size={24} />, count: pets.filter(pet => pet.type === "Bird").length },
  ];

  // Pet Details Modal Component
  const PetDetailsModal = ({ pet, onClose, onAdopt }) => {
    if (!pet) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="relative">
            <img
              src={pet.imageUrls?.[0]}
              alt={pet.name}
              className="w-full h-64 md:h-80 object-cover rounded-t-2xl"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-700" />
            </button>
            <div className="absolute top-4 left-4 flex space-x-2">
              <button
                onClick={() => toggleWishlist(pet.id)}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  wishlist.has(pet.id)
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
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{pet.name}</h2>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pet.breed}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pet.age}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pet.type}
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FaWeight className="w-4 h-4 mr-2" />
                    <span>{pet.weight}</span>
                  </div>
                  {pet.eyeColor && (
                    <div className="flex items-center">
                      <FaEye className="w-4 h-4 mr-2" />
                      <span>{pet.eyeColor} eyes</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:text-right mt-4 lg:mt-0">
                <div className="text-4xl font-bold text-[#640D56] mb-2">
                  LKR {pet.price.toFixed(2)}
                </div>
                <div className="flex items-center justify-center lg:justify-end space-x-1 text-yellow-400">
                  <FaStar className="w-4 h-4" />
                  <FaStar className="w-4 h-4" />
                  <FaStar className="w-4 h-4" />
                  <FaStar className="w-4 h-4" />
                  <FaStar className="w-4 h-4" />
                  <span className="text-gray-600 ml-2 text-sm">(5.0)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">About {pet.name}</h3>
              <p className="text-gray-600 leading-relaxed">
                {pet.description || "A lovely and friendly pet looking for a forever home."}
              </p>
            </div>

            {/* Seller Information */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Seller Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FaUser className="w-4 h-4 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Seller Name</div>
                    <div className="font-medium text-gray-900">{pet.sellerName}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className="w-4 h-4 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Contact</div>
                    <div className="font-medium text-gray-900">{pet.contactNumber}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="w-4 h-4 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-medium text-gray-900">{pet.location}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="w-4 h-4 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Address</div>
                    <div className="font-medium text-gray-900">{pet.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* <button
                onClick={() => {
                  onAdopt(pet);
                  onClose();
                }}
                className="flex-1 bg-[#640D56] text-white py-4 rounded-xl hover:bg-[#8A2BE2] transition-colors font-semibold text-lg"
              >
                Adopt Now - LKR {pet.price.toFixed(2)}
              </button> */}
              <button
                onClick={onClose}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:border-gray-400 transition-colors font-semibold"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
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
                    Find Your Perfect Pet
                  </h1>
                  <p className="text-gray-600 mt-1">Discover loving companions waiting for their forever home</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex space-x-2 bg-gray-100 rounded-2xl p-1">
                  {["Pets", "Accessories", "Foods"].map((item) => (
                    <button
                      key={item}
                      onClick={() => navigate(`/${item === "Pets" ? "BuyPets" : item.toLowerCase()}`)}
                      className={`px-6 py-2 rounded-xl transition-all ${
                        item === "Pets"
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
                  <div className="text-sm text-gray-500">{category.count} pets</div>
                </div>
              </button>
            ))}
          </div>

          {/* Pets Grid */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Inria Serif" }}>
                Available Pets
                <span className="text-sm text-gray-500 font-normal ml-2">
                  ({filteredPets.length} pets)
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#640D56]"></div>
              </div>
            ) : filteredPets.length === 0 ? (
              <div className="text-center py-12">
                <GiSittingDog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <div className="text-gray-500 text-lg">No pets found</div>
                <p className="text-gray-400">Try adjusting your category filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image Section */}
                    <div className="relative overflow-hidden">
                      <img
                        src={pet.imageUrls?.[0]}
                        alt={pet.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button
                          onClick={() => toggleWishlist(pet.id)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                            wishlist.has(pet.id)
                              ? "bg-red-500 text-white"
                              : "bg-white/80 text-gray-600 hover:bg-white"
                          }`}
                        >
                          <FaHeart className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-[#640D56] text-white px-2 py-1 rounded-full text-sm font-semibold">
                        LKR {pet.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {pet.name}
                        </h3>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <FaStar className="w-3 h-3" />
                          <span className="text-xs text-gray-600">5.0</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Breed:</span> {pet.breed}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Age:</span> {pet.age}
                        </p>
                        <p className="text-gray-600 text-sm flex items-center">
                          <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                          {pet.location}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => fetchPetDetails(pet.id)}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                        >
                          View Details
                        </button>
                        {/* <button
                          onClick={() => {
                            setSelectedPet(pet);
                            setShowPaymentModal(true);
                          }}
                          className="flex-1 bg-[#640D56] text-white py-2 rounded-xl hover:bg-[#8A2BE2] transition-colors font-medium text-sm"
                        >
                          Adopt
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pet Details Modal */}
        {showPetDetails && petDetails && (
          <PetDetailsModal
            pet={petDetails}
            onClose={() => {
              setShowPetDetails(false);
              setPetDetails(null);
            }}
            onAdopt={(pet) => {
              setSelectedPet(pet);
              setShowPaymentModal(true);
            }}
          />
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedPet && (
          <PaymentModal
            open={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedPet(null);
            }}
            pet={selectedPet}
            onSuccess={(paymentIntent) => {
              enqueueSnackbar("Payment successful! Your new pet is on the way!", { variant: "success" });
            }}
          />
        )}
      </div>
    </Elements>
  );
};

export default BuyPets;