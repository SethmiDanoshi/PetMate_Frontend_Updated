import React from "react";
import { useNavigate } from "react-router-dom";

import BuyerSidebar from "../../components/Buyer/BuyerSidebar";

const AppointmentBooking = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <BuyerSidebar  />

      {/* Main Content */}
      <div className="flex-1 bg-white p-6 pt-5 ml-3">
        <div className="flex justify-between items-center pb-5">
          <h1 className="text-5xl font-bold" style={{ fontFamily: "Inika" }}>Appointment booking</h1>
          <button
            onClick={() => navigate("/my-appointments")}
            className="bg-[#640D56] text-white px-5 py-2  rounded-full hover:bg-[#fa3e7d]"
          >
            My Appointments
          </button>
        </div>

        {/* In-Clinic Booking */}
        <div className="relative rounded-lg overflow-hidden h-[300px] w-full mt-6">
          <img
            src="InClinic.png"
            alt="Vet clinic"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-end p-6">
            <div className="flex flex-col items-center">
              <h2
                className="text-4xl font-semibold text-black"
                style={{ fontFamily: "Irish Grover" }}
              >
                In-Clinic booking
              </h2>
              <button
                onClick={() => navigate("/in-clinic")}
                className="mt-3 bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-200"
                style={{ fontFamily: "Inria Serif" }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>


        {/* Home Visit Booking */}
        <div className="relative rounded-lg overflow-hidden h-[300px] w-full mt-6">
          <img
            src="Home-visit.png"
            alt="Home visit"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-start p-6">
            <div className="flex flex-col items-center">
            <h2
              className="text-4xl font-semibold text-black"
              style={{ fontFamily: "Irish Grover" }}
            >
              Home - visit booking
            </h2>
            <button
              onClick={() => navigate("/home-visit")}
              className="mt-3 bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-gray-200"
              style={{ fontFamily: "Inria Serif" }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div> 
</div>
  );
};

export default AppointmentBooking;
