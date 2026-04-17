import React, { useState, useRef, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Avatar } from "@mui/material";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [active, setActive] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = {
      uid : sessionStorage.getItem('uid'),
      token: sessionStorage.getItem('token'),
      fullName :sessionStorage.getItem('fullName'),
      email : sessionStorage.getItem('email'),
      role : sessionStorage.getItem('role'),
  }
  const myAccountRoute = user.role === 'SELLER' ? '/seller/dashboard' : '/buyerdashboard';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavClick = (section) => {
    if (location.pathname !== "/") {
      navigate(`/?scrollTo=${section}`);
    } else {
      setActive(section);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#640D56] text-white px-6 py-3 flex justify-between items-center z-50">
      {/* Logo and Tagline */}
      <div className="flex flex-col items-start">
        <div className="flex items-center space-x-2">
          <img src="/PetMate.png" alt="PetMate Logo" className="h-10" />
          <div
            className="text-xxl font-bold text-[40px]"
            style={{ fontFamily: "Irish Grover" }}
          >
            PetMate
          </div>
        </div>
        <p
          className="text-[20px] font-italianno text-white"
          style={{ fontFamily: "italianno" }}
        >
          Every Paw Deserves a Perfect Home.
        </p>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8">
        {["home", "about", "features", "social-impact", "contact"].map((item) => (
          <ScrollLink
            key={item}
            to={item}
            smooth={true}
            duration={100}
            className={`relative text-[20px] cursor-pointer hover:text-gray-300 pb-1 transition-all ${
              active === item
                ? "after:w-full after:left-0"
                : "after:w-0 after:left-1/2"
            } after:content-[''] after:absolute after:bottom-0 after:h-[4px] after:bg-white after:rounded-full after:transition-all after:duration-300`}
            style={{ fontFamily: "Inika", fontWeight: "400" }}
            onClick={() => handleNavClick(item)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1).replace("-", " ")}
          </ScrollLink>
        ))}
      </div>

      {/*//? User Avatar with Dropdown */}
      {isAuthenticated ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
          >
            <Avatar
              alt={user.fullName}
              src={user.avatar || "/default-avatar.png"}
              className="cursor-pointer hover:ring-2 hover:ring-white transition-all"
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                <p className="font-medium">Hi, {user.fullName}</p>
              </div>
              <RouterLink
                to={myAccountRoute}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                My Account
              </RouterLink>
              <RouterLink
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Settings
              </RouterLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex space-x-4">
        <button
          className="bg-[#1661d9] hover:bg-[#fa3e7d] text-white px-7 py-2 rounded-full text-[20px]"
          style={{ fontFamily: "Inika", fontWeight: "400" }}
          onClick={() => navigate("/vetdoctor/signin")}
        >
          Vet Doctors
        </button><button
          className="bg-[#D91656] hover:bg-[#fa3e7d] text-white px-7 py-2 rounded-full text-[20px]"
          style={{ fontFamily: "Inika", fontWeight: "400" }}
          onClick={() => navigate("/SignUp")}
        >
          SignUp
        </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;