import React, { useEffect, useState } from "react";
import SellerSidebar from "../../components/Seller/SellerSidebar";
import { createProduct } from "../../apis/productApi";
import { enqueueSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

const AddNewAccessories = () => {
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    price: "",
    category: "",
    quantity: "",
    date: "",
    description: "",
    sellerId: "",
    type: "accessories",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const user = {
      uid: sessionStorage.getItem('uid'),
      token: sessionStorage.getItem('token'),
      fullName: sessionStorage.getItem('fullName'),
      email: sessionStorage.getItem('email'),
      role: sessionStorage.getItem('role'),
    }
    if (user && user.uid) {
      setFormData((prev) => ({
        ...prev,
        sellerId: user.uid,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = new FormData();

      data.append("product", new Blob([JSON.stringify(formData)], { type: "application/json" }));

      images.forEach((file) => {
        data.append("images", file);
      });

      const response = await createProduct(data);
      console.log("Response from createProduct API:", JSON.stringify(response, null, 2));

      if (!response.status) {
        throw new Error("Failed to create product");
      }

      enqueueSnackbar('Product added successfully', { variant: 'success' });


      setFormData({
        productName: "",
        brand: "",
        price: "",
        category: "",
        quantity: "",
        date: "",
        description: "",
      });
      setImages([]);

    } catch (error) {
      console.error("Error creating product:", error);
      enqueueSnackbar('Failed to add product', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />

      <div className="flex-1 p-8">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ fontFamily: "Irish Grover" }}
        >
          Add New Pet Accessories
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
        >
          {/* Product Name */}
          <div>
            <label className="block font-semibold">Product Name :</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Brand & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Brand :</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter Brand name"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Price :</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter Price"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Category & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Category :</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select category</option>
                <option value="all">All</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Quantity :</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter Quantity"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block font-semibold">Date :</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold">Description :</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Product description"
              className="w-full p-2 border rounded-lg"
              rows="4"
              required
            />
          </div>

          {/* Product Gallery */}
          <div>
            <label className="block font-semibold">Product Gallery :</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            <div className="flex gap-2 mt-2">
              {images.length > 0 &&
                images.slice(0, 2).map((file, index) => (
                  <div
                    key={index}
                    className="w-24 h-24 border rounded-lg flex items-center justify-center bg-gray-100"
                  >
                    <span className="text-xs">{file.name}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600"
            >
              {loading ? <CircularProgress/> : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAccessories;


