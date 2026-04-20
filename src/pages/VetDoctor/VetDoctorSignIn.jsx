import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { loginDoctor } from '../../apis/doctorAPI';


const VetDoctorSignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    try {
      const data = await loginDoctor(formData.email, formData.password);
      console.log("Login success:", data);

      localStorage.setItem("token", data.data.token);
      sessionStorage.setItem("doctorId", data.data.id);

      navigate("/vetdoctor/dashboard"); 
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ form: error.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side with Image and Slogan */}
      <div className="w-3/4 bg-cover bg-center relative" style={{ backgroundImage: "url('/Vet.png')" }}>
        <div className="absolute inset-0 top-[200px] flex flex-col justify-start items-center text-white">
          <h1 className="text-xl" style={{ fontFamily: 'Italianno', fontSize: '100px' }}>
            Connecting Pets with<span className="text-[#e91e63]"> Expert Care!</span>
          </h1>
          <div className="mt-6 flex items-center p-5">
            <div className="relative flex rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-white w-full h-full"></div>
              <button
                className="relative z-10 bg-pink-600 text-white text-3xl px-10 py-3 rounded-full transition duration-300"
                style={{ fontFamily: 'Instrument Serif, serif' }}
                onClick={() => navigate("/vetdoctor/signup")}
              >
                Sign Up
              </button>
              <button
                className="relative z-10 text-black text-3xl px-10 py-3 rounded-full  ml-[-10px] transition duration-300"
                style={{ fontFamily: 'Instrument Serif, serif' }}
                onClick={() => navigate("/vetdoctor/signin")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - VetDoctor SignIn Form */}
      <div className="w-1/2 flex flex-col justify-start items-center p-10">
        <h2 className="text-4xl text-[#e91e63] mb-6 p-4" style={{ fontFamily: 'Instrument Serif, serif' }}>
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
          {errors.email && <p className="text-red-500 text-sm ml-4 mt-0">{errors.email}</p>}

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
          {errors.password && <p className="text-red-500 text-sm ml-4 mt-0">{errors.password}</p>}
        </div>

        {errors.form && <p className="text-red-500 text-sm mt-2">{errors.form}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-1/3 bg-[#e91e63] text-white text-3xl py-2.5 rounded-full shadow-md hover:bg-pink-500 disabled:opacity-50"
          style={{ fontFamily: 'Instrument Serif, serif' }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-center text-sm mt-4 text-[#e91e63] cursor-pointer" onClick={() => console.log('Forgot Password')}>
          Forgot Password?
        </p>

        <p className="text-center text-sm mt-4 text-gray-700">
          New to Hoomans?{' '}
          <span className="text-[#e91e63] cursor-pointer" onClick={() => navigate("/vetdoctor/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default VetDoctorSignIn;
