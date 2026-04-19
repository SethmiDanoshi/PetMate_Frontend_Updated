import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerSidebar from "../../components/Seller/SellerSidebar";

const SellerPetAccessories = () => {
  const navigate = useNavigate();
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    price: "",
    category: "",
    quantity: "",
    description: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const uid = sessionStorage.getItem("uid");
        if (!uid) {
          setError("User ID not found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8080/api/products/seller/${uid}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await response.json();

        if (result.status && Array.isArray(result.data)) {
          const accessoriesOnly = result.data.filter(
            (item) => item.type === "accessories"
          );
          setAccessories(accessoriesOnly);
        } else {
          setError("Unexpected API response");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    // TODO: Delete API integration
    setAccessories(accessories.filter((item) => item.id !== id));
  };

  const handleUpdateClick = (item) => {
    setSelectedItem(item);
    setFormData({
      productName: item.productName,
      brand: item.brand,
      price: item.price,
      category: item.category,
      quantity: item.quantity,
      description: item.description,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${selectedItem.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const result = await response.json();

      // Update UI
      setAccessories((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? result.data : item))
      );

      setShowModal(false);
      setSelectedItem(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Pet Accessories</h1>
          <button
            onClick={() => navigate("/seller-AddPetAccessories")}
            className="bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            + Add New Accessory
          </button>
        </div>

        {loading && <p className="text-center">Loading accessories...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && accessories.length === 0 && (
          <p className="text-center text-gray-500">
            No accessories available. Start by adding one!
          </p>
        )}

        {!loading && !error && accessories.length > 0 && (
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-left">
                  <th className="p-3 border">Image</th>
                  <th className="p-3 border">Product Name</th>
                  <th className="p-3 border">Brand</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accessories.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 border">
                      <img
                        src={item.imageUrls?.[0]}
                        alt={item.productName}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-3 border">{item.productName}</td>
                    <td className="p-3 border">{item.brand}</td>
                    <td className="p-3 border capitalize">{item.category}</td>
                    <td className="p-3 border">Rs.{item.price}</td>
                    <td className="p-3 border">{item.quantity}</td>
                    <td className="p-3 border flex gap-2">
                      <button
                        onClick={() => handleUpdateClick(item)}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Update Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-xl font-bold mb-4">Update Accessory</h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  placeholder="Product Name"
                />
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  placeholder="Brand"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  placeholder="Price"
                />
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  placeholder="Category"
                />
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  placeholder="Quantity"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="border p-2 rounded col-span-2"
                  placeholder="Description"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPetAccessories;
