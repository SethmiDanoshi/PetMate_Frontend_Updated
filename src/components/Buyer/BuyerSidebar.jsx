import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Calendar, 
  ListOrdered, 
  ShoppingCart, 
  LogOut,
  Settings,
  Menu,
  X,
  Home
} from "lucide-react";

const BuyerSidebar = ({ name, email }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      path: "/buyerdashboard",
      label: "Dashboard",
      icon: Home,
      exact: true
    },
    {
      path: "/appointments",
      label: "Appointments",
      icon: Calendar
    },
    {
      path: "/buyer/orders",
      label: "My Orders",
      icon: ListOrdered
    },
    {
      path: "/accessories",
      label: "Accessories",
      icon: ListOrdered
    },
    {
      path: "/foods",
      label: "Pet Foods",
      icon: ListOrdered
    },
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
            {name || "Buyer"}
          </h2>
          <p className="text-sm text-gray-200 mt-1">{email || "buyer@example.com"}</p>
          
          {/* Online Status */}
          <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-300">Online</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col space-y-2 w-full px-4 pt-4 overflow-y-auto
          scrollbar-hide 
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]">
          
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
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-purple-500 mt-auto">
          {/* Settings */}
          <button
            onClick={() => handleNavigation("/buyer/settings")}
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
            <p className="text-xs text-gray-400">Buyer Portal v1.0</p>
            <p className="text-xs text-gray-500 mt-1">PetMate © 2024</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default BuyerSidebar;