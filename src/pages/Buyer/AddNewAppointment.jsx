import React, { useEffect, useState } from "react";
import BuyerSidebar from "../../components/Buyer/BuyerSidebar";
import axiosInstance from "../../apis/axios";
import { enqueueSnackbar } from "notistack";

const AddNewAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    ownerName: "",
    address: "",
    contactNumber: "",
    date: "",
    doctorId: "",
    petType: "",
    symptoms: "",
    bookingType: "",
    timeSlot: "",
  });

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get('/admin/doctors/verified');
        const data = await response.data.data;
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle time slot click
  const handleTimeSlot = (slot) => {
    setFormData((prev) => ({
      ...prev,
      timeSlot: slot,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // build request body from your formData
      const payload = {
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.timeSlot ? `${formData.timeSlot}:00` : "",
        symptoms: formData.symptoms,
        appointmentType: formData.bookingType,
        petType: formData.petType.toUpperCase(),
        userContactNumber: formData.contactNumber,
      };

      const response = await axiosInstance.post(
        "/appointments",
        payload,
        {
          headers: {
            "User-Id": sessionStorage.getItem('uid'),
          },
        }
      );

      if (response.data.status) {
        setFormData({
          ownerName: "",
          address: "",
          doctorId: "",
          date: "",
          timeSlot: "",
          symptoms: "",
          bookingType: "",
          petType: "",
          contactNumber: "",
        });
      }

      console.log("Appointment created:", response.data);
      enqueueSnackbar('Appointment booked successfully!', { variant: 'success' });
    } catch (error) {
      console.error("Error booking appointment:", error.response?.data || error);
      enqueueSnackbar(error.response?.data?.message || "Something went wrong", { variant: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <BuyerSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-white p-6 pt-5 ml-3">
        <h1 className="text-4xl font-bold text-center mb-10" style={{ fontFamily: "Inika" }}>
          Add New Appointment
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <label className="block mb-2 font-medium">Pet Owner Name:</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Enter Your name"
                className="w-full p-3 rounded-full bg-gray-100 outline-none"
              />

              <label className="block mt-6 mb-2 font-medium">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Your Address"
                className="w-full p-3 rounded-full bg-gray-100 outline-none"
              />

              <label className="block mt-6 mb-2 font-medium">
                Contact Number:
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter Your Contact number"
                className="w-full p-3 rounded-full bg-gray-100 outline-none"
              />

              <label className="block mt-6 mb-2 font-medium">Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 rounded-full bg-gray-100 outline-none"
              />

              <label className="block mt-6 mb-2 font-medium">
                Available doctors:
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full p-3 rounded-full bg-gray-100 outline-none"
              >
                <option value="">Select the doctor</option>
                {loading ? (
                  <option>Loading...</option>
                ) : (
                  doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Right Column */}
            <div>
              <label className="block mb-2 font-medium">Type of the pet:</label>
              <select
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                className="w-full p-3 rounded-full bg-gray-100 outline-none"
              >
                <option value="">Dog / Cat</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>

              <label className="block mt-6 mb-2 font-medium">
                Symptoms of the pet:
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Enter Symptoms"
                rows="3"
                className="w-full p-3 rounded-2xl bg-gray-100 outline-none"
              />

              <label className="block mt-6 mb-2 font-medium">
                Type of the Booking:
              </label>
              <select
                name="bookingType"
                value={formData.bookingType}
                onChange={handleChange}
                className="w-full p-3 rounded-full bg-gray-100 outline-none"
              >
                <option value="">Select type</option>
                <option value="IN_CLINIC">In-Clinic</option>
                <option value="ONLINE">Online</option>
                <option value="HOME_VISIT">Home Visit</option>
              </select>

              <label className="block mt-6 mb-2 font-medium">
                Available Time slots:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["8:30", "10:30", "12:30", "14:30", "16:30", "18:30"].map(
                  (time) => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => handleTimeSlot(time)}
                      className={`p-2 rounded-full ${formData.timeSlot === time
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 hover:bg-pink-200"
                        }`}
                    >
                      {time}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-pink-600 text-white px-10 py-3 rounded-full text-lg font-semibold hover:bg-pink-700"
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAppointment;
