import React from "react";

const SocialImpact = () => {
  const impactItems = [
    {
      title: "Promoting Responsible Pet Ownership",
      img: "homevisit.jpg",
    },
    {
      title: "Improving Access to Pet Care Services",
      img: "clinic.jpg",
    },
    {
      title: "Strengthening the Pet-Loving Community",
      img: "path-3.jpg",
    },
    {
      title: "Encouraging Ethical Breeding and Sales",
      img: "path-4.jpg",
    },
    {
      title: "Increasing Access to Pet Care Resources",
      img: "path-5.jpg",
    },
  ];

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url('background-image.jpeg')" }}
    >
      <h1 className="text-6xl md:text-6xl  mb-4 mt-5 text-white" style={{ fontFamily: 'Instrument Serif, serif' }}>
        Social Impact
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-10">
        {impactItems.map((item, index) => (
          <div
          key={index}
            className={`flex flex-col p-4 items-center text-center  ${item.title === 'Encouraging Ethical Breeding and Sales' || item.title === 'Increasing Access to Pet Care Resources' ? 'ml-8' : ''}`}
            style={item.title === 'Encouraging Ethical Breeding and Sales' || item.title === 'Increasing Access to Pet Care Resources' ? { marginLeft: '15rem' } : {}}

          >
            <div className="w-40 h-40 rounded-full border-4 border-pink-500 overflow-hidden " >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <p className="mt-4 text-2xl font-semibold" style={{ fontFamily: 'Inria Serif, serif' }}>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialImpact;

