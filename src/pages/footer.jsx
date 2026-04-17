const Footer = () => {
    return (
        <div>
        <h2 className="text-center text-8xl font-serif text-[#640D56] mt-10 mb-20" style={{ fontFamily: 'Italianno' }}>
            Every Paw Deserves a Perfect Home.
          </h2>
          
      <footer className="bg-[#66D1EE] text-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-6">
          
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 " style={{ fontFamily: 'Jacques Francois' }}>
            <div>
              <h3 className="font-semibold">Need help?</h3>
              <ul className="mt-2 space-y-1">
                {[
                  "Policy documents",
                  "Make a claim",
                  "Contact us",
                  "Affiliates",
                  "FAQs",
                  "Press office",
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-blue-600 hover:underline">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-2 space-y-1">
                {[
                  "Terms & conditions",
                  "Terms of business",
                  "Privacy policy",
                  "Complaints data",
                  "Modern slavery",
                  "Cookie policy",
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-blue-600 hover:underline">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-bold">PetMate</h3>
              <p className="text-sm italic">Every Paw Deserves a Perfect Home.</p>
              <div className="flex space-x-4 mt-4">
                {[
                  "facebook",
                  "instagram",
                  "tiktok",
                  "linkedin",
                ].map((icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-600 hover:text-gray-800 text-2xl"
                  >
                    <i className={`fab fa-${icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
  
          <p className="text-xs text-gray-600 mt-8 text-center" style={{ fontFamily: 'Jacques Francois' }}>
            PetMate is a trading name of PetMate Limited. PetMate pet insurance is
            arranged by TICORP Limited which is registered in Gibraltar. Company
            number 111526. Registered office: First Floor, Grand Ocean Plaza,
            Ocean Village, Gibraltar. TICORP Limited is authorised and regulated
            by the Gibraltar Financial Services Commission and trades into the UK
            on a freedom of services basis, Financial Conduct Authority FRN
            663617.<br />
            PetMate is administered by Howserv Limited which is registered in
            England and Wales. Company number 03882026. Registered office:
            Britannia House, 3-5 Rushmills Business Park, Bedford Road,
            Northampton, NN4 7YB. Howserv Limited is authorised and regulated by
            the Financial Conduct Authority FRN 599282.<br />
            We are remunerated by commission for the arrangement, service and
            renewal of your insurance policy. Also, for some of our insurers we
            may receive a profit share payment if they achieve performance targets
            across their product portfolio.
          </p>
        </div>
        
      </footer>
      </div>
    );
  };
  
  export default Footer;
  