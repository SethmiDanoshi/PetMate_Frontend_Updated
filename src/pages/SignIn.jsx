import React, { useEffect, useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { LoginSchema } from "../schemas/LoginSchema";
import { AuthApi } from "../apis/authApi";
import { useSnackbar } from "notistack";
import { useAuth } from "../contexts/AuthContext";

const SignIn = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [errors, setErrors] =useState({});
    const [formData, setFormData] = useState({
      email:"",
      password:""
    });

    const { enqueueSnackbar } = useSnackbar();

    useEffect(()=>{
      if (location.state?.email) {
        setFormData(prev => ({
          ...prev,
          email: location.state.email
        }))
      }
    },[location.state]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name] : value
      }));
    };

    const handleSubmit = async ()=> {
      console.log("submitted formDta :", formData);
      try {
        const result = LoginSchema.safeParse(formData);
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

        //! Submit formData
        const response = await AuthApi.login(formData);
        console.log("response --------->",JSON.stringify(response, null,2));
        if(response.status){
          console.log("Login successfully.");
          enqueueSnackbar('Login successful', {variant: 'success'});
          if(response.data.role === "SELLER"){
            login(response.data,"/seller/dashboard" );
            navigate("/seller/dashboard");
          }else if(response.data.role === "BUYER"){
            login(response.data,"/buyerdashboard" );
            navigate("/buyerdashboard");
          }
          
        }else{ 
          console.error("Login failed.", response.error);
          enqueueSnackbar('Login failed', {variant: 'error'});
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        console.error("Login error:", message);
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
        <div className="absolute inset-0 bg-white w-full h-full"></div>
        <button
          className="relative z-10  bg-pink-600  text-white text-3xl px-10 py-3 rounded-full  transition duration-300"
          style={{ fontFamily: 'Instrument Serif, serif' }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
        <button
          className="relative z-10 text-black text-3xl px-10 py-3 rounded-full  ml-[-10px] transition duration-300 "
          style={{ fontFamily: 'Instrument Serif, serif' }}
          onClick={() => navigate("/SignIn")}
        >
          Login
        </button>
      </div>
    </div>
</div>
      </div>
      
     {/* Right Side - SignIn Form */}
<div className="w-1/2 flex flex-col justify-start items-center p-10">
  <h2 className="text-4xl  text-pink-600 mb-6 p-4" style={{ fontFamily: 'Instrument Serif, serif' }}>
    Please Sign In to continue..
  </h2>

  <div className="space-y-4 w-90 p-5 w-3/4">
    <div className="flex items-center bg-blue-200 rounded-full px-4 py-3">
      <FaEnvelope className="text-gray-600" />
      <input
        type="email"
        name="email"
        placeholder="Enter your Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full bg-transparent focus:outline-none ml-2"
      />
    </div>
    {errors.email && <p className="text-red-500 text-sm ml-4 mt-0">{errors.email}.</p>}
    <div className="flex items-center bg-blue-200 rounded-full px-4 py-3">
      <FaLock className="text-gray-600" />
      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full bg-transparent focus:outline-none ml-2"
      />
    </div>
    {errors.password && <p className="text-red-500 text-sm ml-4 mt-0">{errors.password}.</p>}
  </div>

  <button onClick={handleSubmit} className="w-1/3 bg-pink-600 text-white text-3xl  py-2.5 rounded-full shadow-md hover:bg-pink-500" style={{ fontFamily: 'Instrument Serif, serif' }}>
    Sign In
  </button>

  <p className="text-center text-sm mt-4" >
    Forgot Password?
  </p>

  <p className="text-center text-sm mt-4">
    New to Hoomans? <span className="text-pink-500 cursor-pointer" onClick={() => navigate("/signup")}>Sign Up</span>
  </p>
</div>
    </div>
  );
};

export default SignIn;

