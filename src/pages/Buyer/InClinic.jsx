import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const InClinic = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center text-center pt-3 bg-white">
      {/* Back Button */}
      <div className="p-4 self-start">
        <FaArrowLeft
          onClick={() => navigate(-1)}
          className="text-4xl cursor-pointer text-black hover:text-gray-700"
        />
      </div>

      {/* Title */}
      <h1
        className="text-4xl font-bold mt-1 mb-4"
        style={{ fontFamily: "Itim" }}
      >
        In - Clinic Appointment Booking
      </h1>

      {/* Image */}
      <div className="w-full flex justify-center">
        <img
          src="/ClinicAppointment.png"
          alt="Vet with dog"
          className="rounded-lg shadow-md w-full"
        />
      </div>

      {/* Description */}
      <p
        className="mt-6 text-gray-700 max-w-3xl px-4 text-lg"
        style={{ fontFamily: "Jacques Francois" }}
      >
        Life can get hectic, but your pet's health is always a priority. Book an
        in-clinic appointment today and give your furry friend the expert care
        they deserve. Our team is ready to welcome you and your pet with open
        paws!
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/Add-appointment")}
        className="mt-3 mb-9 bg-pink-600 text-white px-9 py-2 rounded-full text-lg font-medium hover:bg-pink-700 transition"
      >
        Book an appointment
      </button>
    </div>
  );
};

export default InClinic;
