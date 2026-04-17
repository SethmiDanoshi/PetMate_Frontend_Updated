export default function Contact() {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center h-screen w-screen bg-white ">
        {/* Left Side - Image */}
        <div className="md:w-60% flex justify-center h-full">
          <img
            src="Contact.jpg" 
            alt="Dog with Glasses"
            className="w-full h-full object-cover rounded-lg "
          />
        </div>
  
        {/* Right Side - Contact Info */}
        <div className="md:w-1/2 bg-white p-8 rounded-lg  h-full flex flex-col justify-center">
          <h2 className="text-6xl  text-pink-600 text-center mt-4 mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>Contact Us</h2>
          
          <div className="space-y-6">
            {/* Address */}
            <div className="flex items-center space-x-3 bg-[#EE66A6] p-4 rounded-xl">
                <h3 className="text-xl text-white font-semibold" style={{ fontFamily: 'Jacques Francois' }}>Address</h3>
              <span className="text-3xl">📍</span>
              <p className="text-lg text-white">367/18, PetMate, Katubedda, Moratuwa, Sri Lanka</p>
            </div>
            
            {/* Phone */}
            <div className="flex items-center space-x-4 bg-[#EE66A6] p-4 rounded-lg">
                <h3 className="text-xl text-white font-semibold" style={{ fontFamily: 'Jacques Francois' }}>Phone </h3>
              <span className="text-3xl">📞</span>
              <p className="text-lg text-white">+94 76 345 6798</p>
            </div>
            
            {/* Email */}
            <div className="flex items-center space-x-4 bg-[#EE66A6] p-4 rounded-lg">
            <h3 className="text-xl text-white font-semibold" style={{ fontFamily: 'Jacques Francois' }}>E-Mail</h3>
              <span className="text-3xl">📧</span>
              <p className="text-lg text-white">petmate@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
