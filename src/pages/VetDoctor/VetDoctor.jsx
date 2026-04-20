import React from 'react';
import { Link } from 'react-router-dom';

const VetDoctor = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
        <div className="relative">
          <img src="/VetDoc.png" alt="Vet Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 top-16 md:top-24 mx-4 md:mx-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
              <p className="text-4xl md:text-6xl italic" style={{ fontFamily: 'Italianno' }}>
                Every Furry Friend Deserves the Best
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white flex items-center justify-center p-7">
          <div className="max-w-md text-center">
            <h1 className="text-5xl  font-bold text-[#640D56] mb-4" style={{ fontFamily: 'Irish Grover' }}>
              Join Our Vet Doctor Platform – Connect with Pet Owners & Provide Expert Care!
            </h1>
            <p className="text-gray-700 mb-6 text-xl" style={{ fontFamily: 'Instrument Serif' }}>
              Register as a vet today and offer your expertise to pet owners in need. Manage appointments, medical records, and consultations seamlessly. Start your journey with us and ensure the best health for every pet!
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/vetdoctor/signup" className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-full font-semibold">
                Sign Up
              </Link>
              <Link to="/vetdoctor/signin" className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-full font-semibold">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default VetDoctor;
