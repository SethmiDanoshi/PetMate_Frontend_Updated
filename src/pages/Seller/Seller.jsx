import React from 'react';
import { Link } from 'react-router-dom';

const Seller = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
        {/* Left Side - Image & Text */}
        <div className="relative">
            <img
                src="/pets-banner.png"
                alt="Pets Hero"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 top-12 md:top-24 mx-4 md:mx-8 text-center">
                <p
                className="text-8xl text-white italic"
                style={{ fontFamily: 'Italianno' }}
                >
                Bringing Pets & People Together!
                </p>
            </div>
            </div>

        {/* Right Side - Content */}
        <div className="bg-white flex items-center justify-center p-7">
          <div className="max-w-md text-center">
            <h1
              className="text-4xl md:text-5xl font-bold text-pink-600 mb-4 leading-snug"
              style={{ fontFamily: 'Irish Grover' }}
            >
              Join Our Pet Marketplace <br />
              Connect with Loving Pet Owners & Sell with Confidence!
            </h1>
            <p
              className="text-gray-700 mb-6 text-lg"
              style={{ fontFamily: 'Instrument Serif' }}
            >
              Register as a seller today and showcase your pets, accessories,
              and pet care products to a wide audience. Start your journey with
              us and find the perfect homes for your pets!
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/seller/signup"
                className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2"
              >
                Sign Up
                <span role="img" aria-label="paw">🐾</span>
              </Link>
              <Link
                to="/seller/signin"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-full font-semibold"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seller;
