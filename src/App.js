// import React from 'react';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import Navbar from './components/Navbar';
// import PageFooter from './components/PageFooter';
// import SignUp from './pages/SignUp';
// import SignIn from './pages/SignIn';




// function App() {
//   return (
//     <div>
//       <Navbar/>
    
//     <div className="pt-[80px]">
//     <BrowserRouter> 
//     <Routes>
//       <Route path= "/" element={<HomePage/>}></Route>
//       <Route path= "/signup" element={<SignUp/>}></Route>
//       <Route path= "/SignIn" element={<SignIn/>}></Route>
//     </Routes>
//     </BrowserRouter>
//     </div>
//     <PageFooter/>
//   </div>
  
//   );
// }

// export default App;




import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import PageFooter from './components/PageFooter';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import About from './pages/About';
import Features from './pages/Features';
import SocialImpact from './pages/SocialImpact';
import Contact from './pages/Contact';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './contexts/AuthContext';

// Buyer pages
import BuyerDashboard from './pages/Buyer/BuyerDashboard';
import BuyPets from './pages/Buyer/BuyPets';
import Accessories from './pages/Buyer/Accessories';
import Foods from './pages/Buyer/Foods';
import Cart from './pages/Buyer/Cart';

// Details pages
import PetDetails from './pages/Buyer/PetDetails';
import AccessoriesDetails from './pages/Buyer/AccessoriesDetails';
import FoodDetails from './pages/Buyer/FoodDetails';  

// Appointment booking pages
import AppointmentBooking from './pages/Buyer/AppointmentBooking';
import MyAppointment from './pages/Buyer/MyAppointment';
import InClinic from './pages/Buyer/InClinic';
import HomeVisit from './pages/Buyer/HomeVisit';
import AddNewAppointment from './pages/Buyer/AddNewAppointment';
import WishList from './pages/Buyer/wishList';
import FindVetClinic from './pages/Buyer/FindVetClinicGoogleMaps';


import VetDoctor from './pages/VetDoctor/VetDoctor';
import VetDoctorDashboard from './pages/VetDoctor/VetDoctorDashboard';
import VetDoctorSignUp from './pages/VetDoctor/VetDoctorSignUp';
import VetDoctorSignIn from './pages/VetDoctor/VetDoctorSignIn';
import InClinicAppointments from './pages/VetDoctor/InClinicAppointments';
import HomeVisitAppointments from './pages/VetDoctor/HomeVisitAppointments';


import Seller from './pages/Seller/Seller';
import SellerSignUp from './pages/Seller/SellerSignUp';
import SellerSignIn from './pages/Seller/SellerSignIn';
import SellerDashboard from './pages/Seller/SellerDasboard';
import SellerOrders from './pages/Seller/SellerOrders';
import SellerProducts from './pages/Seller/SellerProducts';
import SellerPetFoodItems from './pages/Seller/SellerPetFoodItems';
import SellerPetAccessories from './pages/Seller/SellerPetAccessories';
import AddNewFoodItem from './pages/Seller/AddNewFoodItem';
import AddNewAccessories from './pages/Seller/AddNewAccessories';
import SellerAllPets from './pages/Seller/SellerAllPets';
import AddNewPet from './pages/Seller/AddNewPet';
import AdminSignup from './pages/Admin/AdminSignup';
import AdminSignIn from './pages/Admin/AdminSignIn';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminSellerList from './pages/Admin/AdminSellerList';
import VetDoctorRequests from './pages/Admin/VetDoctorRequests';
import AdminVetDoctorList from './pages/Admin/AdminVetDoctorList';
import ProductsManagement from './pages/Admin/ProductsManagmnet';
import PetsManagement from './pages/Admin/PetsManagment';
import OrdersManagement from './pages/Admin/OrdersManagment';
import AppointmentsManagement from './pages/Admin/AppointmentsManagment';
import BuyerOrders from './pages/Buyer/BuyerOrders';

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={4000}
    >
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <div className="pt-[80px]">
            <Routes>
              {/* Default route */}
              <Route path="/" element={<HomePage />} />

              {/* Info pages */}
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/socialimpact" element={<SocialImpact />} />
              <Route path="/contact" element={<Contact />} />

              {/* Auth */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />

              {/* Buyer dashboard & shop pages */}
              <Route
                path="/buyerdashboard"
                element={
                  <BuyerDashboard
                    name="Sethmi Danoshi"
                    email="sethmidanoshi@gmail.com"
                  />
                }
              />
              <Route path="/buypets" element={<BuyPets />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/foods" element={<Foods />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wish-list" element={<WishList />} />
              <Route path="/buyer/orders" element = { <BuyerOrders/> } />

              {/* Appointment booking pages */}
              <Route path="/appointments" element={<AppointmentBooking />} />
              <Route path="/my-appointments" element={<MyAppointment />} />
              <Route path="/in-clinic" element={<InClinic />} />
              <Route path="/home-visit" element={<HomeVisit />} />
              <Route path="/vet-clinic" element={<FindVetClinic />} />

              {/* Details pages */}
              <Route path="/pets/:petId" element={<PetDetails />} />
              <Route path="/accessories/:accessoryId" element={<AccessoriesDetails />} />
              <Route path="/foods/:foodId" element={<FoodDetails />} />   

              {/* Add new appointment */}
              <Route path="/Add-appointment" element={<AddNewAppointment/>} />  

              {/* Vet Doctor */}
                <Route path="/vetdoctor" element={<VetDoctor/>} />
                <Route path="/vetdoctor/signup" element={<VetDoctorSignUp />} />
                <Route path="/vetdoctor/signin" element={<VetDoctorSignIn />} />
                <Route path="/vetdoctor/dashboard" element={<VetDoctorDashboard />} />
                <Route path="/vetdoctor/in-clinic" element={<InClinicAppointments />} />
                <Route path="/vetdoctor/home-visit" element={<HomeVisitAppointments />} />
                <Route path="/vetdoctor/VetDoctorSignUp" element={<VetDoctorSignUp />} />
                <Route path="/vetdoctor/VetDoctorSignIn" element={<VetDoctorSignIn />} /> 

                {/* Seller */}
                <Route path="/seller" element={<Seller/>} />
                <Route path="/seller/signup" element={<SellerSignUp/>} />
                <Route path="/seller/signin" element={<SellerSignIn/>} />
                <Route path="/seller/dashboard" element={<SellerDashboard/>} />
                <Route path="/seller/orders" element={<SellerOrders/>} />
                <Route path="/seller/products" element={<SellerProducts/>} />
                <Route path="/seller-products/food" element={<SellerPetFoodItems/>} />
                <Route path="/seller-products/accessories" element={<SellerPetAccessories/>} />
                <Route path="/seller-AddNewFoodItem"  element={<AddNewFoodItem/>} />
                <Route path="/seller-AddPetAccessories" element={<AddNewAccessories/>} />
                <Route path="/seller/All-pets" element={<SellerAllPets/>} />
                <Route path="/seller-AddNewPet" element={<AddNewPet/>} />

                {/* Admin */}
                <Route path="/admin/signup" element={<AdminSignup/>} />
                <Route path="/admin/signin" element={<AdminSignIn/>} />
                <Route path="/admin/dashboard" element={<AdminDashboard/>} />
                <Route path="/Admin/SellerList"  element={<AdminSellerList/>} />
                <Route path="/Admin/VetDoctorRequests"  element={<VetDoctorRequests/>} />
                <Route path="/Admin/VetDoctorList" element={<AdminVetDoctorList/>} />
                <Route path="/admin/products" element={<ProductsManagement />} />
                <Route path="/admin/pets" element={<PetsManagement />} />
                <Route path="/admin/orders" element={<OrdersManagement />} />
                <Route path="/admin/appointments" element={<AppointmentsManagement />} />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          <PageFooter />
        </AuthProvider>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
