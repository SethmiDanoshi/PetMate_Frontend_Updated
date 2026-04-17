import React from "react";

const About = () => {
  return (
    <div id="About">

    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-6xl font-bold text-pink-600" style={{ fontFamily: 'Irish Grover' }}>PetMate</h1>
      <h2 className="text-2xl font-semibold text-purple-800 mt-2" style={{ fontFamily: 'Jacques Francois' }}>
        The innovative Pet Tech solution for pet lovers.
      </h2>
      <p className="text-black text-lg text-center max-w-2xl mt-4" style={{ fontFamily: 'Jacques Francois' }}>
        PetMate is a unified platform designed to address the challenges faced by
        pet lovers in Sri Lanka. It streamlines the process of buying and selling
        pets, and accessing pet care items and services. This web-based platform
        simplifies pet ownership, saving time and money while enhancing the overall
        experience for pet owners, making pet care more enjoyable and efficient.
      </p>
      <p className="text-4xl  mt-6" style={{ color: "#66D1EE" , fontFamily: 'Irish Grover'}}>
        " Embrace the future of pet care with PetPaw Commerce "
      </p>
      <img src="Pet.png" alt="PetMate Banner" className="w-full max-w-4xl mt-6" />
    </div>
  </div>
  );
};

export default About;

