import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const SellerSignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Add your validation/login logic here
    console.log('Seller Sign In:', formData);
  };

  return (
    <div className="flex h-screen">
      {/* Left Side with Image and Slogan */}
      <div
        className="w-3/4 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/sellerSignup.png')" }}
      >
        <div className="absolute inset-0 top-[200px] flex flex-col justify-start items-center text-white">
          <h1
            className="text-lg text-center leading-[100px]"
            style={{ fontFamily: 'Italianno', fontSize: '100px' }}
          >
            Empowering Sellers with<br/>
            <span className="text-[#e91e63]"> Smart Connections!</span>
          </h1>
          <div className="mt-6 flex items-center p-5">
            <div className="relative flex rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-white w-full h-full"></div>
              <button
                className="relative z-10 bg-pink-600 text-white text-3xl px-10 py-3 rounded-full transition duration-300"
                style={{ fontFamily: 'Instrument Serif, serif' }}
                onClick={() => navigate("/seller/signup")}
              >
                Sign Up
              </button>
              <button
                className="relative z-10 text-black text-3xl px-10 py-3 rounded-full ml-[-10px] transition duration-300"
                style={{ fontFamily: 'Instrument Serif, serif' }}
                onClick={() => navigate("/seller/signin")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Seller SignIn Form */}
      <div className="w-1/2 flex flex-col justify-start items-center p-10">
        <h2
          className="text-4xl text-[#e91e63] mb-6 p-4"
          style={{ fontFamily: 'Instrument Serif, serif' }}
        >
          Please Sign In to continue..
        </h2>

        <div className="space-y-4 w-3/4 p-5">
          <div className="flex items-center bg-[#9bd8ec] rounded-full px-4 py-3">
            <Mail className="text-[#0ea5b7]" />
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none ml-2 placeholder-white text-gray-900"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm ml-4 mt-0">{errors.email}</p>
          )}

          <div className="flex items-center bg-[#9bd8ec] rounded-full px-4 py-3">
            <Lock className="text-[#0ea5b7]" />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none ml-2 placeholder-white text-gray-900"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm ml-4 mt-0">{errors.password}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-1/3 bg-[#e91e63] text-white text-3xl py-2.5 rounded-full shadow-md hover:bg-pink-500"
          style={{ fontFamily: 'Instrument Serif, serif' }}
        >
          Sign In
        </button>

        <p
          className="text-center text-sm mt-4 text-[#e91e63] cursor-pointer"
          onClick={() => console.log('Forgot Password')}
        >
          Forgot Password?
        </p>

        <p className="text-center text-sm mt-4 text-gray-700">
          New to Hoomans?{' '}
          <span
            className="text-[#e91e63] cursor-pointer"
            onClick={() => navigate("/seller/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SellerSignIn;
