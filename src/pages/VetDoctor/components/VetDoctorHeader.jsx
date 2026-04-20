import React from 'react';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VetDoctorHeader = ({ onMenuClick, sidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session or token if needed
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");


    navigate("/");
  };

  return (
    <header className="bg-[#640D56] text-white fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Menu Button and Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-[#4A0A41] transition-colors lg:hidden"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
          
          <div className="flex items-center space-x-3">
            <img src="/PetMate.png" alt="PetMate Logo" className="h-10" />
            <div className="hidden md:block">
              <div
                className="text-lg font-bold text-white"
                style={{ fontFamily: 'Irish Grover' }}
              >
                PetMate
              </div>
              <p
                className="text-sm text-gray-200"
                style={{ fontFamily: 'italianno' }}
              >
                Every Paw Deserves a Perfect Home.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center space-x-3">
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors">
            My Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default VetDoctorHeader;
