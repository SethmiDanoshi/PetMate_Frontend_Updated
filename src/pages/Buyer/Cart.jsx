import { useEffect, useState } from "react";
import BuyerSidebar from "../../components/Buyer/BuyerSidebar";
import { FaTrash } from "react-icons/fa";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items from backend API
    fetch("/api/cart") // Replace with your backend endpoint
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error(err));
  }, []);

  // Remove item from cart
  const handleRemove = async (id) => {
    try {
      const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete item from backend");
      }

      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error removing item. Please try again.");
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="flex">
      {/* Sidebar */}
      <BuyerSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-4xl font-bold mt-4 mb-3" style={{ fontFamily: 'Irish Grover' }}>Stock Up for Your Pet's Happiness</h1>
          <div className="relative w-full">
            {/* Image */}
            <img 
              src="/BuyFoods.png" 
              alt="Food and Accessories" 
              className="w-full h-[400px] object-cover rounded-lg"
            />

            {/* Text Overlay */}
            <p className="absolute bottom-20 left-0 w-full text-center text-pink-600 italic text-2xl bg-white/60 py-2">
              Add Food and Accessories to Your Cart Now!
            </p>
          </div>
        </div>

        {/* Cart Table */}
        <div className="mx-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-sky-200 text-black font-semibold">
              <tr>
                <th className="py-3">Item</th>
                <th>Item Name</th>
                <th>Item Type</th>
                <th>KG/G</th>
                <th>Quantity</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 flex justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td>{item.weight || "-"}</td>
                  <td>{item.quantity}</td>
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
              {cartItems.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-6 text-gray-500">
                    Your cart is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total + Checkout */}
        {cartItems.length > 0 && (
          <div className="mx-8 mt-6 flex justify-between items-center bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold">Total: Rs. {totalPrice.toFixed(2)}</h2>
            <button className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded-xl">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
