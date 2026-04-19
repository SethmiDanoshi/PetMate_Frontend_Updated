import React, { useState } from "react";
import { Mail, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AdminAuthApi } from "../../apis/adminApi";

const AdminSignup = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      enqueueSnackbar("Please fix the errors before submitting", {
        variant: "error",
      });
      return;
    }

    setErrors({});
    try {
      const response = await AdminAuthApi.signup(formData);
      console.log("response --------->", JSON.stringify(response, null, 2));
      if (response.status) {
        console.log("Admin Signup successfully.");
        enqueueSnackbar("Admin Signup Successful!", { variant: "success" });
        setTimeout(() => {
            navigate('/admin/signin',{
              state:{
                fromSignup:true,
                email: formData.email
              }
            });
          },1500);
      }else{
        console.error("Signup failed.", response.error);
        enqueueSnackbar('Signup failed', {variant: 'error'});
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
        console.error("Signup error:", message);
        enqueueSnackbar(message, { variant: 'error' });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side with Image and Slogan */}
      <div
        className="w-3/4 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/adminSignup.png')" }}
      >
        <div className="absolute inset-0 top-[200px] flex flex-col justify-start items-center text-white">
          <h1
            className="text-lg text-center leading-[100px]"
            style={{ fontFamily: "Italianno", fontSize: "100px" }}
          >
            Join us today and manage your <br /><span className="text-[#e91e63]">  platform with ease!</span>
          </h1>
          <div className="mt-6 flex items-center p-5">
            <div className="relative flex rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-[#e91e63] w-full h-full"></div>
              <button
                className="relative z-10 bg-white text-black text-3xl px-10 py-3 rounded-full"
                style={{ fontFamily: "Instrument Serif, serif" }}
                onClick={() => navigate("/admin/signup")}
              >
                Sign Up
              </button>
              <button
                className="relative z-10 text-white text-3xl px-10 py-3 rounded-full ml-[-10px]"
                style={{ fontFamily: "Instrument Serif, serif" }}
                onClick={() => navigate("/admin/signin")}
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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-start items-center w-full"
        >
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
            {errors.email && (
              <p className="text-red-500 text-sm ml-4">{errors.email}</p>
            )}

            {/* Full Name */}
            <div className="flex items-center bg-[#9bd8ec] rounded-full px-4 py-3">
              <User className="text-[#0ea5b7]" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your Full Name"
                className="w-full bg-transparent focus:outline-none ml-2 placeholder-white text-gray-900"
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-sm ml-4">{errors.fullName}</p>
            )}

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
            {errors.password && (
              <p className="text-red-500 text-sm ml-4">{errors.password}</p>
            )}

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
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm ml-4">
                {errors.confirmPassword}
              </p>
            )}

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
                I have read and agree to the terms and conditions and the
                privacy policy.
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm ml-2">
                {errors.termsAccepted}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-1/3 bg-[#e91e63] text-white text-2xl py-2.5 mt-6 rounded-full shadow-md hover:bg-pink-500"
            style={{ fontFamily: "Instrument Serif, serif" }}
          >
            Sign Up
          </button>
        </form>

        {/* Already a user */}
        <p className="text-center text-sm mt-4">
          Already a user?{" "}
          <span
            className="text-[#e91e63] cursor-pointer"
            onClick={() => navigate("/admin/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
