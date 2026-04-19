import React, { useState } from "react";
import SellerSidebar from "../../components/Seller/SellerSidebar";
import { createPet } from "../../apis/petApi";
import { enqueueSnackbar } from "notistack";

const AddNewPet = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
    location: "",
    price: "",
    description: "",
    eyeColor: "",
    images: [],
    sellerName: "",
    sellerId: "",
    address: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const uid = sessionStorage.getItem('uid');
  if (uid) {
    formData.sellerId = uid;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        breed: formData.breed,
        age: formData.age,
        weight: formData.weight,
        location: formData.location,
        eyeColor: formData.eyeColor,
        price: parseFloat(formData.price),
        description: formData.description,
        sellerName: formData.sellerName,
        sellerId: formData.sellerId,
        address: formData.address,
        contactNumber: formData.contactNumber
      };

      const fd = new FormData();
      fd.append("pet", new Blob([JSON.stringify(payload)], { type: "application/json" }));

      formData.images.forEach(file => fd.append("images", file));

      const res = await createPet(fd);

      if (!res.status) throw new Error("Create failed");

      // const body = await res.json();
      enqueueSnackbar('Pet added successfully', { variant: 'success' });

      setFormData({
        name: "",
        type: "",
        breed: "",
        age: "",
        weight: "",
        location: "",
        price: "",
        description: "",
        images: [],
        sellerName: "",
        sellerId: uid || "",
        address: "",
        contactNumber: "",
      });

    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to add a new pet.', { variant: 'error' });
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1
          className="text-3xl font-bold mb-6 mt-4"
          style={{ fontFamily: "Irish Grover" }}
        >
          Add New Pet
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
        >
          {/* Pet Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Pet Name :</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter pet name"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Type :</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select type</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
              </select>
            </div>
          </div>

          {/* Breed, Age, Weight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold">Breed :</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="Enter breed"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Age :</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Eg: 6 Months / 3 Years"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Weight :</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Eg: 12Kgs"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            {/* Eye color */}
          <div>
            <label className="block font-semibold">Eye color :</label>
            <input
              type="text"
                name="eyeColor"
                value={formData.eyeColor}
                onChange={handleChange}
                placeholder="Enter eye color"
                className="w-full p-2 border rounded-lg"
                required
            />
          </div>
          </div>

          {/* Location & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Location :</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Price (LKR) :</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold">Description :</label>
            <input
                name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter pet description"
              className="w-full p-2 border rounded-lg"
              rows="4"
              required
              />
          </div>

          

          {/* Seller Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold">Seller Name :</label>
              <input
                type="text"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                placeholder="Enter seller name"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            {/* <div>
              <label className="block font-semibold">Seller Id :</label>
              <input
                type="text"
                name="sellerId"
                value={formData.sellerId}
                onChange={handleChange}
                placeholder="Eg: PS001"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div> */}
            <div>
              <label className="block font-semibold">Contact Number :</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Eg: +94 71 234 5678"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold">Address :</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter seller address"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Product Gallery */}
          <div>
            <label className="block font-semibold">Pet Images :</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            <div className="flex gap-2 mt-2">
              {formData.images.length > 0 &&
                formData.images.slice(0, 2).map((file, index) => (
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
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewPet;
