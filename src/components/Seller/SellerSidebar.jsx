import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ShoppingCart, 
  Package, 
  PlusCircle, 
  ChevronRight,
  User,
  LogOut,
  Settings
} from "lucide-react";

const SellerSidebar = ({ name, email, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(null);

  const menuItems = [
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      path: "/seller/orders",
      description: "Manage customer orders"
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      path: "/seller/products",
      description: "View and edit products"
    },
    {
      id: "pets",
      label: "Sell Pets",
      icon: PlusCircle,
      path: "/seller/All-pets",
      description: "Add new pets for sale"
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-80 bg-gradient-to-b from-[#640D56] to-[#8A2BE2] text-white flex flex-col min-h-screen shadow-2xl">
      {/* Profile Section */}
      <div className="flex flex-col items-center p-8 mb-4 relative">
        <div className="relative group">
          <img
            src="https://images.unsplash.com/photo-1611872508586-6c6d1796aa11?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white/80 shadow-lg object-cover transition-all duration-300 group-hover:scale-105 group-hover:border-white"
          />
          <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h2
          className="mt-6 text-3xl font-light bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
          style={{ fontFamily: "Italianno" }}
        >
          {name || "Seller"}
        </h2>
        <p className="text-gray-200 text-sm mt-2 bg-white/10 px-3 py-1 rounded-full">
          {email || "seller@example.com"}
        </p>
        
        {/* Status Indicator */}
        <div className="flex items-center mt-3 space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-300">Online</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setIsHovered(item.id)}
              onMouseLeave={() => setIsHovered(null)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                active
                  ? "bg-white/20 shadow-lg backdrop-blur-sm border border-white/30"
                  : "bg-white/5 hover:bg-white/15 hover:shadow-md border border-transparent"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  active 
                    ? "bg-white text-[#640D56]" 
                    : "bg-white/10 text-white group-hover:bg-white group-hover:text-[#640D56]"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span 
                    className={`block text-lg font-medium transition-colors duration-300 ${
                      active ? "text-white" : "text-gray-100 group-hover:text-white"
                    }`}
                    style={{ fontFamily: "Inria Serif" }}
                  >
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-300 mt-1 block">
                    {item.description}
                  </span>
                </div>
              </div>
              
              <ChevronRight 
                className={`w-4 h-4 transition-all duration-300 ${
                  active || isHovered === item.id ? "translate-x-1 opacity-100" : "opacity-0"
                }`} 
              />
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/10 space-y-3">
        <button
          onClick={() => navigate("/seller/settings")}
          className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300 group"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </button>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-200 hover:text-white hover:bg-red-500/20 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
        
        {/* Version Info */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            Seller Portal v1.0
          </p>
        </div>
      </div>
    </aside>
  );
};

export default SellerSidebar;