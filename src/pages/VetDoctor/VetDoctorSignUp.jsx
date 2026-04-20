import React, { useState } from "react";
import { Mail, User, Lock, Upload, Phone, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { doctorSignUp } from "../../apis/doctorAPI";
import { CircularProgress } from "@mui/material";

const VetDoctorSignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    license: null,
    contactNumber: "",
    address: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.contactNumber) newErrors.contactNumber = "Contact number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.license) newErrors.license = "License upload is required";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      enqueueSnackbar("Please fix the errors before submitting", { variant: "error" });
      return;
    }

    try {
      const res = await doctorSignUp(formData);
      if (res.status) {
        setLoading(false);
        enqueueSnackbar("Vet Doctor Signup Successful!", { variant: "success" });
      }

      setTimeout(() => {
        navigate("/vetdoctor/signin");
      }, 1500);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err?.msg || "Signup failed", { variant: "error" });
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side with Image and Slogan */}
      <div
        className="w-3/4 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/Vet.png')" }}
      >
        <div className="absolute inset-0 top-[200px] flex flex-col justify-start items-center text-white">
          <h1 className="text-xl" style={{ fontFamily: 'Italianno', fontSize: '100px' }}>
            Connecting Pets with <span className="text-[#e91e63]">Expert Care!</span>
          </h1>
          <div className="mt-6 flex items-center p-5">
            <div className="relative flex rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-[#e91e63] w-full h-full"></div>
              <button
                className="relative z-10 bg-white text-black text-3xl px-10 py-3 rounded-full"
                style={{ fontFamily: "Instrument Serif, serif" }}
                onClick={() => navigate("/vetdoctor/signup")}
              >
                Sign Up
              </button>
              <button
                className="relative z-10 text-white text-3xl px-10 py-3 rounded-full  ml-[-10px]"
                style={{ fontFamily: "Instrument Serif, serif" }}
                onClick={() => navigate("/vetdoctor/signin")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-1/2 flex flex-col justify-start items-center p-12 overflow-y-auto">
        <h2
          className="text-4xl text-[#e91e63] mb-6 p-4"
          style={{ fontFamily: "Instrument Serif, serif" }}
        >
          Please Sign Up to continue..
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col justify-start items-center w-full">
          <div className="space-y-4 w-full max-w-md">
            
            {/* Email */}
            <div className="flex items-center bg-[#9bd8ec] rounded-full px-4 py-3">
              <Mail className="text-[#0ea5b7]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email"
                className="w-full bg-transparent focus:outline-none ml-2 placeholder-white text-gray-900"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm ml-4">{errors.email}</p>}

            {/* Full Name */}
            <div className="flex items-center bg-[#9bd8ec] rounded-full px-4 py-3">
              <User className="text-[#0ea5b7]" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your Name"
                className="w-full bg-transparent focus:outline-none ml-2 placeholder-white text-gray-900"
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-sm ml-4">{errors.fullName}</p>}

            {/* Contact Number */}
            <div className="flex items-center bg-[#9bd8ec] rounded-full px-4 py-3">
              <Phone className="text-[#0ea5b7]" />
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter Contact Number"
                className="w-full bg-transparent focus:outline-none ml-2 placeholder-white text-gray-900"
              />
            </div>
            {errors.contactNumber && <p className="text-red-500 text-sm ml-4">{errors.contactNumber}</p>}

            {/* Address */}
            <div className="flex items-center bg-[#9bd8ec] rounded-full px-4 py-3">
              <Home className="text-[#0ea5b7]" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Address"
                className="w-full bg-transparent focus:outline-none ml-2 placeholder-white text-gray-900"
              />
            </div>
            {errors.address && <p className="text-red-500 text-sm ml-4">{errors.address}</p>}

            {/* Password */}
            <div className="flex items-center bg-[#9bd8ec] rounded-full px-4 py-3">
              <Lock className="text-[#0ea5b7]" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full bg-transparent focus:outline-none ml-2 placeholder-white text-gray-900"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm ml-4">{errors.password}</p>}

            {/* Confirm Password */}
            <div className="flex items-center bg-[#9bd8ec] rounded-full px-4 py-3">
              <Lock className="text-[#0ea5b7]" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full bg-transparent focus:outline-none ml-2 placeholder-white text-gray-900"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm ml-4">{errors.confirmPassword}</p>}

            {/* License Upload */}
            <div>
              <p className="text-sm text-gray-700 mb-2">
                Upload license: <span className="text-red-500">*</span>
              </p>
              <div className="rounded-2xl bg-[#9bd8ec] p-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="text-[#0ea5b7]" />
                  <p>Drag and Drop to upload file</p>
                  <p className="text-sm text-gray-700">or</p>
                  <input type="file" name="license" onChange={handleChange} />
                </div>
              </div>
              {errors.license && <p className="text-red-500 text-sm ml-2">{errors.license}</p>}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="w-4 h-4 accent-[#e91e63]"
              />
              <label
                htmlFor="terms"
                className="text-sm"
                style={{ color: errors.termsAccepted ? "red" : "black" }}
              >
                I have read and agree to the terms and conditions and the privacy policy.
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm ml-2">{errors.termsAccepted}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-1/3 bg-[#e91e63] text-white text-2xl py-2.5 mt-6 rounded-full shadow-md hover:bg-pink-500"
            style={{ fontFamily: "Instrument Serif, serif" }}
          >
            {loading ? (
              <>
                <CircularProgress/>
              </>
            ) : (
              <>
              Sign Up
              </>
            )}
          </button>
        </form>

        {/* Already a user */}
        <p className="text-center text-sm mt-4">
          Already a user?{" "}
          <span
            className="text-[#e91e63] cursor-pointer"
            onClick={() => navigate("/vetdoctor/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default VetDoctorSignUp;
