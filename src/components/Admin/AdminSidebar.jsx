import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Users, 
  ChevronDown, 
  ChevronUp, 
  LayoutDashboard,
  UserCheck,
  Stethoscope,
  LogOut,
  Settings,
  Menu,
  X,
  PawPrint,
  ShoppingCart,
  Calendar,
  Package
} from "lucide-react";

const AdminSidebar = ({ name, email }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true
    },
    {
      path: "/Admin/VetDoctorRequests",
      label: "Vet Doctor Requests",
      icon: UserCheck
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: Package
    },
    {
      path: "/admin/pets",
      label: "Pets",
      icon: PawPrint
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: ShoppingCart
    },
    {
      path: "/admin/appointments",
      label: "Appointments",
      icon: Calendar
    }
  ];

  const userSubItems = [
    {
      path: "/Admin/SellerList",
      label: "Sellers & Buyers",
      icon: Users
    },
    {
      path: "/Admin/VetDoctorList",
      label: "Vet Doctors",
      icon: Stethoscope
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#640D56] text-white p-2 rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-80 bg-[#640D56] text-white flex flex-col
        transform transition-transform duration-300 ease-in-out z-40
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8 pt-12 px-6 border-b border-purple-500 pb-8">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
          />
          <h2
            className="mt-4 text-3xl font-light"
            style={{ fontFamily: "Italianno" }}
          >
            {name || "Admin"}
          </h2>
          <p className="text-sm text-gray-200 mt-1">{email || "admin@example.com"}</p>
          
          {/* Online Status */}
          <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-300">Online</span>
          </div>
        </div>

        {/* Navigation Menu - Enhanced Scrollbar */}
        <nav className="flex-1 flex flex-col space-y-2 w-full px-4 pt-4 overflow-y-auto
          /* Hide scrollbar for Chrome, Safari and Opera */
          scrollbar-none
          /* Hide scrollbar for IE, Edge and Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
          
          /* Custom scrollbar for webkit browsers */
          &::-webkit-scrollbar {
            display: none;
          }
          
          /* Smooth scrolling */
          scroll-behavior: smooth;
        ">
          {/* Main Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200
                  ${active 
                    ? 'bg-white text-[#640D56] shadow-lg transform scale-105' 
                    : 'bg-transparent hover:bg-purple-600 hover:shadow-md'
                  }
                `}
                style={{ fontFamily: "Inria Serif" }}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#640D56]' : 'text-white'}`} />
                <span className="text-lg font-medium">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-[#640D56] rounded-full"></div>
                )}
              </button>
            );
          })}

          {/* Handle Users Dropdown */}
          <div className="mt-2">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`
                flex items-center justify-between w-full py-3 px-4 rounded-xl transition-all duration-200
                ${dropdownOpen ? 'bg-purple-600 shadow-md' : 'bg-transparent hover:bg-purple-600 hover:shadow-md'}
              `}
              style={{ fontFamily: "Inria Serif" }}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5" />
                <span className="text-lg font-medium">Manage Users</span>
              </div>
              {dropdownOpen ? (
                <ChevronUp className="w-4 h-4 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform" />
              )}
            </button>

            {/* Dropdown Content */}
            <div className={`
              ml-4 mt-1 flex flex-col space-y-1 overflow-hidden transition-all duration-300
              ${dropdownOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
            `}>
              {userSubItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      flex items-center space-x-3 py-2 px-4 rounded-lg transition-all duration-200
                      ${active 
                        ? 'bg-white text-[#640D56] shadow-inner' 
                        : 'bg-transparent hover:bg-purple-500 text-gray-200'
                      }
                    `}
                    style={{ fontFamily: "Inria Serif" }}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#640D56]' : 'text-gray-300'}`} />
                    <span className="text-md">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-purple-500 mt-auto">
          {/* Settings */}
          <button
            onClick={() => handleNavigation("/admin/settings")}
            className="flex items-center space-x-3 w-full py-3 px-4 rounded-xl hover:bg-purple-600 transition-all duration-200 mb-2"
            style={{ fontFamily: "Inria Serif" }}
          >
            <Settings className="w-5 h-5" />
            <span className="text-lg font-medium">Settings</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              // Handle logout logic here
              console.log("Logging out...");
            }}
            className="flex items-center space-x-3 w-full py-3 px-4 rounded-xl hover:bg-red-600 transition-all duration-200"
            style={{ fontFamily: "Inria Serif" }}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-lg font-medium">Logout</span>
          </button>

          {/* Version Info */}
          <div className="text-center mt-4 pt-4 border-t border-purple-500">
            <p className="text-xs text-gray-400">Admin Panel v1.0</p>
            <p className="text-xs text-gray-500 mt-1">PetMate © 2024</p>
          </div>
        </div>
      </aside>

      {/* Add custom CSS for scrollbar hiding */}
      <style jsx>{`
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;