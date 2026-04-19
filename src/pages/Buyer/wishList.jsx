import { useEffect, useState } from "react";
import BuyerSidebar from "../../components/Buyer/BuyerSidebar";
import { FaTrash } from "react-icons/fa";

export default function WishList() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Fetch wishlist items from backend API
    fetch("/api/wishlist") // Replace with your backend endpoint
      .then((res) => res.json())
      .then((data) => setWishlist(data))
      .catch((err) => console.error(err));
  }, []);

  // Remove from wishlist
  const handleRemove = async (id) => {
    try {
      const res = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to remove item from backend");
      }

      setWishlist(wishlist.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error removing wishlist item. Please try again.");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <BuyerSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-4xl font-bold mt-4 mb-3" style={{ fontFamily: 'Irish Grover' }}>Save Your Favorites</h1>
          <h2 className="text-orange-600 text-3xl font-extrabold mt-2 mb-3">WISH LISTS</h2>
          <div className="relative w-full">
            {/* Image */}
            <img 
              src="/BuyFoods.png" 
              alt="Food and Accessories" 
              className="w-full h-[400px] object-cover rounded-lg"
            />

            {/* Text Overlay */}
            <p className="absolute bottom-20 left-0 w-full text-center text-pink-600 italic text-2xl bg-white/60 py-2">
             Build the Perfect Wish List for Your Furry Friends!
            </p>
          </div>
        </div>

        {/* Wishlist Table */}
        <div className="mx-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-sky-200 text-black font-semibold">
              <tr>
                <th className="py-3">Pet</th>
                <th>Pet Name</th>
                <th>Pet Type</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 flex justify-center">
                    <img
                      src={item.image}
                      alt={item.petName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </td>
                  <td>{item.petName}</td>
                  <td>{item.petType}</td>
                  <td>{item.breed}</td>
                  <td>{item.age}</td>
                  <td>Rs. {item.price.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {wishlist.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-6 text-gray-500">
                    Your wishlist is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
