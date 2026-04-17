import React, { useState } from "react";
import { FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import { GiEgyptianProfile } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { signUpSchema } from "../schemas/SignUpSchema";
import { AuthApi } from "../apis/authApi";
import { useSnackbar } from "notistack";


const SignUp = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
      email:"",
      fullName:"",
      role:"",
      password:"",
      mobileNumber:"",
      confirmPassword:"",
      termsAccepted: false
    });

    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("FormData submitted", formData);

      try {
        const result = signUpSchema.safeParse(formData);

        if(!result.success){
          const fieldErrors = {};
          result.error.errors.forEach((err) => {
            fieldErrors[err.path[0]] = err.message
          });
          setErrors(fieldErrors);
          console.log(fieldErrors);
          return;
        }

        setErrors({});

        //!Submit formData
        const response = await AuthApi.signup(formData);
        console.log("response --------->",JSON.stringify(response, null,2));
        if(response.status){
          console.log("Signup successfully.");
          enqueueSnackbar('Signup successful', {variant: 'success'});

          setTimeout(() => {
            navigate('/SignIn',{
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
      <div className="w-3/4 bg-cover bg-center relative" style={{ backgroundImage: "url('/Signup.jpg')" }}>
      <div className="absolute inset-0 top-[200px] flex flex-col justify-start items-center text-white">
  <h1 className="text-xl " style={{ fontFamily: 'Italianno' , fontSize:'100px'}}>
    Don't Shop, <span className="text-pink-600">Adopt.</span>
  </h1>
  <div className=" mt-6 flex items-center p-5">
      <div className="relative flex rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-pink-600 w-full h-full"></div>
        <button
          className="relative z-10 bg-white text-black text-3xl px-10 py-3 rounded-full  transition duration-300"
          style={{ fontFamily: 'Instrument Serif, serif' }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
        <button
          className="relative z-10 text-white text-3xl px-10 py-3 rounded-full  ml-[-10px] transition duration-300 "
          style={{ fontFamily: 'Instrument Serif, serif' }}
          onClick={() => navigate("/SignIn")}
        >
          Login
        </button>
      </div>
    </div>
</div>
      </div>
      
     {/* Right Side - Signup Form */}
<div className="w-1/2 flex flex-col justify-start items-center p-12">
  <h2 className="text-4xl  text-pink-600 mb-6 p-4" style={{ fontFamily: 'Instrument Serif, serif' }}>
    Please Sign Up to continue..
  </h2>

    <form onSubmit={handleSubmit} className="flex flex-col justify-start items-center">
      <div className="space-y-4 w-90">
        <div className="flex items-center bg-blue-200 rounded-full px-4 py-3">
          <FaEnvelope className="text-gray-600" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your Email"
            className="w-full bg-transparent focus:outline-none ml-2"
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm ml-4 mt-0">{errors.email}.</p>}
        <div className="flex items-center bg-blue-200 rounded-full px-4 py-3">
          <FaUser className="text-gray-600" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your Name"
            className="w-full bg-transparent focus:outline-none ml-2"
          />
        </div>
        {errors.fullName && <p className="text-red-500 text-sm ml-4 mt-0">{errors.fullName}.</p>}
        <div className="flex items-center bg-blue-200 rounded-full px-4 py-3">
          <FaUser className="text-gray-600" />
          <input
            type="number"
            name="mobileNumber"
            value={formData.moduleNumber}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            className="w-full bg-transparent focus:outline-none ml-2"
          />
        </div>
        {errors.mobileNumber && <p className="text-red-500 text-sm ml-4 mt-0">{errors.mobileNumber}.</p>}
        <div className="flex items-center bg-blue-200 rounded-full px-4 py-3">
          <GiEgyptianProfile className="text-gray-600 mr-2 " />
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-transparent text-gray-600 focus:outline-none"
          >
            <option value="" disabled>
              Select Your Role
            </option>
            <option value="SELLER">Item seller</option>
            <option value="BUYER">Buyer</option>
            {/* <option value="OWNER">Pet Owner</option> */}
          </select>
        </div>
        {errors.role && <p className="text-red-500 text-sm ml-4 mt-0">{errors.role}.</p>}
        <div className="flex items-center bg-blue-200 rounded-full px-4 py-3">
          <FaLock className="text-gray-600" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            className="w-full bg-transparent focus:outline-none ml-2"
          />
        </div>
        {errors.password && <p className="text-red-500 text-sm ml-4 mt-0">{errors.password}.</p>}
        <div className="flex items-center bg-blue-200 rounded-full px-4 py-3">
          <FaLock className="text-gray-600" />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full bg-transparent focus:outline-none ml-2"
          />
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm ml-4 mt-0">{errors.confirmPassword}.</p>}
        <div className="flex items-center space-x-2">
          <input 
          type="checkbox" 
          name="termsAccepted" 
          checked={formData.termsAccepted}
          onChange={handleChange}
          className="w-4 h-4"
          />
          <label htmlFor="terms" className="text-l p-4" style={{ fontFamily: 'serif', color: errors.termsAccepted ? 'red': 'black' }}>
            I have read and agree to the terms and conditions and the privacy
            policy.
            {errors.termsAccepted && <p className="text-red-500 text-sm  mt-0">{errors.termsAccepted}.</p>}
          </label>
        </div>

      </div>
      

      <button type="submit" className="w-1/3 bg-pink-600 text-white text-3xl  py-2.5 rounded-full shadow-md hover:bg-pink-500" style={{ fontFamily: 'Instrument Serif, serif' }}>
        Sign Up
      </button>
    </form>

  <p className="text-center text-sm mt-4">
    Already a user?{" "}
    <span className="text-pink-500 cursor-pointer" onClick={() => navigate("/SignIn")}>Sign In</span>
  </p>

 

  
</div>

      </div>
    
  );
};

export default SignUp;
