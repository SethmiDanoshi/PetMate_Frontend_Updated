import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomeVisit = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Back Button */}
      <div className="p-4">
        <FaArrowLeft
          onClick={() => navigate(-1)}
          className="text-4xl cursor-pointer text-black hover:text-gray-700"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-10">
        {/* Left Text Section */}
        <div className="md:w-1/2 text-left space-y-6">
          <h1 className="text-4xl font-bold text-black mb-4" style={{ fontFamily: "Itim" }}>Home Visits</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-4" style={{ fontFamily: "Jacques Francois" }}>
            Modern life often leads to rough and tough days for us all.
            Regardless we know your pet is constantly on your mind. If you need
            us on a busy day, our teams are happy to help you out by bringing
            our services to your doorstep.
          </p>
          <button
            onClick={() => navigate("/Add-appointment")}
            className="mt-3 mb-9 bg-pink-600 text-white px-9 py-2 rounded-full text-lg font-medium hover:bg-pink-700 transition"
          >
            Book an appointment
          </button>
        </div>

        {/* Right Image Section */}
        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
          <img
            src="/House-visit.png" // <-- Replace with your image path
            alt="Dog and Cat"
            className="rounded-3xl shadow-lg max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeVisit;
