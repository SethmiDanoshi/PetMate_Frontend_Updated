import React, { useEffect, useState } from "react";
import { Calendar, FileText, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Edit3 } from "lucide-react";

const VetDoctorSidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  // Fetch doctor profile from backend API
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vetdoctor/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`, // if using JWT
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDoctor(data);
        }
      } catch (error) {
        console.error("Error fetching vet doctor profile:", error);
      }
    };

    fetchDoctor();
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Appointments", icon: Calendar },
    { id: "appointment-requests", label: "Appointment Requests", icon: FileText },
    { id: "schedule", label: "Schedule", icon: Clock },
    { id: "appointment-history", label: "Appointment History", icon: Star },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 h-full bg-[#640D56] text-white z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:top-0
          w-64 flex flex-col items-center py-6
        `}
      >
        {/*  Profile Section */}
        <div className="flex flex-col items-center mb-8 pt-6">
          <div className="relative">
            <img
              src={doctor?.profileImage || "https://via.placeholder.com/100"}
              alt={doctor?.name || "Vet Doctor"}
              className="w-28 h-28 rounded-full border-4 border-white object-cover"
            />
            <button className="absolute top-0 right-0 p-1 bg-white rounded-full shadow">
              <Edit3 className="h-4 w-4 text-[#640D56]" />
            </button>
          </div>
          <h2 className="mt-3 text-2xl" style={{ fontFamily: "Italianno" }}>
            {doctor?.name || "Loading..."}
          </h2>
          <p className="text-sm text-gray-200">{doctor?.email || ""}</p>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex flex-col space-y-4 w-full px-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center space-x-3 py-2 px-4 rounded-lg text-lg
                  ${
                    isActive
                      ? "bg-[#4A0A41] shadow-md"
                      : "bg-[#640D56] hover:bg-purple-600"
                  }`}
                style={{ fontFamily: "Inria Serif" }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/*  Quick Links */}
          <div className="mt-6 w-full">
            <p className="text-xs uppercase tracking-wide text-gray-300 mb-2">
              Quick Links
            </p>
            <button
              onClick={() => navigate("/vetdoctor/in-clinic")}
              className="block w-full px-4 py-2 rounded-lg bg-[#4A0A41] hover:bg-purple-600 text-left"
            >
              In-Clinic Appointments
            </button>
            <button
              onClick={() => navigate("/vetdoctor/home-visit")}
              className="block w-full px-4 py-2 rounded-lg bg-[#4A0A41] hover:bg-purple-600 text-left mt-2"
            >
              Home-Visit Appointments
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default VetDoctorSidebar;
