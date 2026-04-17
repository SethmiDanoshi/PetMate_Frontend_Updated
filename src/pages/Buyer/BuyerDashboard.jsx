import React from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import BuyerSidebar from "../../components/Buyer/BuyerSidebar"; 

export default function BuyerDashboard({ name, email }) {
  const navigate = useNavigate();

  // Navigation functions
  const goToBuyPets = () => navigate("/BuyPets");
  const goToBuyAccessories = () => navigate("/accessories");
  const goToAppointment = () => navigate("/appointments");
  const goToVetClinic = () => navigate("/vet-clinic");

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <BuyerSidebar name={name} email={email} />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Irish Grover' }}>
          Hello {name} ....
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {/* New Pets */}
          <div className="relative rounded-lg overflow-hidden h-48 w-full">
            <img src="NewPets.png" alt="Dog" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-center items-start p-6">
              <h2 className="text-3xl font-semibold text-black" style={{ fontFamily: 'Irish Grover' }}>
                New Pets?
              </h2>
              <button
                className="mt-3 bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-200"
                style={{ fontFamily: 'Inria Serif' }}
                onClick={goToBuyPets}
              >
                Take Home
              </button>
            </div>
          </div>

          {/* Buy Accessories */}
          <div className="relative rounded-lg overflow-hidden h-48 w-full">
            <img src="BuyFoods.png" alt="Food" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-center items-start p-6">
              <h2 className="text-3xl font-semibold text-black" style={{ fontFamily: 'Irish Grover' }}>
                Buy Accessories <br /> and Foods
              </h2>
              <button
                className="mt-3 bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-200"
                style={{ fontFamily: 'Inria Serif' }}
                onClick={goToBuyAccessories}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Appointment Booking */}
          <div className="col-span-2 relative rounded-lg overflow-hidden h-48 w-full">
            <img src="AppointmentBooking.png" alt="Cat" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-center items-start p-6">
              <h2 className="text-3xl font-bold text-black" style={{ fontFamily: 'Irish Grover' }}>
                Appointment booking
              </h2>
              <button
                className="bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-300"
                style={{ fontFamily: 'Inria Serif' }}
                onClick={goToAppointment}
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Find nearby Vet Clinic */}
          <div className="col-span-2 relative rounded-lg overflow-hidden h-48 w-full">
            <img src="NearbyVet.png" alt="Vet" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-center items-start p-6">
              <h2 className="text-3xl font-bold text-black" style={{ fontFamily: 'Irish Grover' }}>
                Find nearby Vet Clinic
              </h2>
              <button
                className="bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-200"
                style={{ fontFamily: 'Inria Serif' }}
                onClick={goToVetClinic}
              >
                Locate Now
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-3xl font-semibold" style={{ fontFamily: 'Irish Grover' }}>
            Your pet can feel our <span className="text-red-500">Love</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
