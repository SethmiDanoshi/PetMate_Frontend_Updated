import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import About from './About';
import Footer from './footer';
import Features from './Features';
import SocialImpact from './SocialImpact';
import Contact from './Contact';

function HomePage() {
  return (
    <div>
      <section id="home"><home /></section>
    {/*  Carousel */}
    <Carousel className="w-full h-screen">
      {/* First Slide */}
      <Carousel.Item interval={1000} className="w-full h-screen relative">
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 text-center">
          <h3 className="text-[80px] font-regular text-black" style={{ fontFamily: 'Italianno' }}>
            Where Every Breed Finds a New Friend!
          </h3>
        </div>
        <img
          src="/FirstSlide.jpg"
          alt="Dog and Cat"
          className="w-full h-full object-cover"
        />
        
        <Carousel.Caption className="text-white">
         
        
        <div className="bg-white p-4 rounded-full shadow-lg flex flex-col md:flex-row items-center gap-6 px-5 mb-[40px] mx-auto max-w-[800px] ">
        <div className="flex items-center">
            <div className="w-20 h-14 bg-white text-white text-6xl flex items-center justify-center rounded-full mr-3">
            🐾
            </div>
        <div>
        <span className="text-black font-bold text-4xl block" style={{ fontFamily: 'Irish Grover'}}>Meow Meow!</span>
        <span className="text-gray-700 text-lg" style={{ fontFamily: 'Irish Grover' }}>Let's Join Meow World</span>
        </div>
        </div>

        <div className="flex gap-4 ml-5 ">
            <button className="bg-pink-600 text-white px-8 py-2 rounded-full shadow-md text-lg font-semibold hover:bg-pink-500">
            Sign Up
            </button>
            <button className="bg-blue-500 text-white px-8 py-2 rounded-full shadow-md text-lg font-semibold hover:bg-blue-400">
            Login
            </button>
        </div>
    </div>
    </Carousel.Caption>
      </Carousel.Item>

      {/* Second Slide */}
      <Carousel.Item interval={500} className="w-full h-screen">
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 text-center">
          <h3 className="text-[80px] font-regular text-black " style={{ fontFamily: 'Italianno' }}>
            Find your Perfect Companion or a Loving Home!
          </h3>
        </div>
        <img
          src="/secondslide.jpg"
          alt="Dog and Cat"
          className="w-full h-full object-cover"
        />
        
      <div className="absolute bottom-0 left-0 right-0 w-screen h-[200px] bg-gradient-to-t from-pink-600 to-pink-400 text-white flex flex-col justify-center items-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mt-[-50px]">
          Buy, and Sell Pets with Ease!
        </h2>
        <button className="mt-3 px-8 py-2 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-gray-200 transition text-lg">
          Explore
        </button>
      </div>
      </Carousel.Item>

      {/* Third Slide */}
      <Carousel.Item className="w-full h-screen">
        <img
          src="/thirdslide.jpg"
          alt="Dog and Cat"
          className="w-full h-full object-cover"
        />
       <Carousel.Caption className="absolute top-9  left-1/2 transform -translate-x-1/2 w-[70%]  flex-col items-center justify-center">
  {/* In-Clinic Section */}
  <div className="bg-white bg-opacity-50 text-black p-6 rounded-lg h-[280px] shadow-lg mb-10">
    <h2 className="text-2xl md:text-6xl font-regular italic mb-4 " style={{ fontFamily: 'Italianno' }}>
      Secure Your Spot - Book Vet Appointments Hassle
    </h2>
    <h3 className="text-xl md:text-4xl font-bold" style={{ fontFamily: 'Jaini' }}>In-Clinic</h3>
    <button className="mt-6 px-4 py-2 md:text-3xl bg-white text-black  rounded-full hover:bg-gray-200" style={{ fontFamily: 'Irish Grover' }}>
      Free for Your Furry Friends!
    </button>
    <div className="relative mt-[-20] flex justify-end">
      <img
        src="/clinic.jpg"
        alt="In-Clinic Service"
        className="w-28 h-28 rounded-full border-2 border-white"
      />
    </div>
  </div>

  {/* Home Visits Section */}
  <div className="bg-white bg-opacity-50 text-black p-6 rounded-lg h-[280px] shadow-lg">
    <h2 className="text-2xl md:text-6xl font-regular italic mb-4 " style={{ fontFamily: 'Italianno' }}>
      Schedule Appointments and Services at Your Fingertips!
    </h2>
    <h3 className="text-xl md:text-4xl font-bold" style={{ fontFamily: 'Jaini' }}>Home-Visits</h3>
    <button className="mt-6 px-4 py-2 md:text-3xl bg-white text-black  rounded-full hover:bg-gray-200" style={{ fontFamily: 'Irish Grover' }}>
      Plan Your Pet Care with Ease
    </button>
    <div className="relative mt-[-20] flex justify-left">
      <img
        src="/homevisit.jpg"
        alt="Home Visit Service"
        className="w-28 h-28 rounded-full border-2 border-white"
      />
    </div>
  </div>
</Carousel.Caption>

      </Carousel.Item>

    </Carousel>
    

      <section id="about"><About /></section>
      <section id="features"><Features /></section>
      <section id="social-impact"><SocialImpact /></section>
      <section id="contact"><Contact /></section>
      <Footer/>
    </div>
    
    
  );
}

export default HomePage;