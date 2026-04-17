import React from 'react';

export default function Features() {
  const features = [
    {
      title: "Community",
      description:
        "Connect with pet lovers, share advice, and support each other in a friendly pet-loving community.",
      image: "community.png"
    },
    {
      title: "Mart",
      description:
        "Shop a wide range of pet products, from food to accessories, with convenient delivery options.",
      image: "mart.png"
    },
    {
      title: "Pet",
      description:
        "Buy or sell pets easily on the platform with detailed listings for trusted transactions.",
      image: "petcare.png"
    },
    {
      title: "Med Service",
      description:
        "Book vet appointments for clinic visits or home care, ensuring your pet gets quality medical attention.",
      image: "med-service.png"
    },
    {
      title: "Locator",
      description:
        "Quickly find nearby pet services like vets and groomers using our interactive map.",
      image: "locator.png"
    },
  ];

  return (
    <div className="max-w-5xl mx-auto text-center py-12">
      <h2 className="text-6xl text-pink-600 mt-5 mb-8" style={{ fontFamily: 'Instrument Serif, serif' }}>
        Product Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col items-center text-center ${feature.title === 'Med Service' || feature.title === 'Locator' ? 'ml-8' : ''}`}
            style={feature.title === 'Med Service' || feature.title === 'Locator' ? { marginLeft: '15rem' } : {}}
          >
            <div className="w-40 h-40 mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#66D1EE' }}>
              <img src={feature.image} alt={feature.title} className="w-28 h-28 object-cover rounded-full" />
            </div>
            <h3 className="text-xl font-semibold text-pink-500" style={{ fontFamily: 'Inria Serif, serif' }}>
              {feature.title}
            </h3>
            <p className="text-black mt-2" style={{ fontFamily: 'Inria Serif, serif' }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
