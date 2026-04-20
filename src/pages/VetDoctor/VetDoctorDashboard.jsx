import React, { useState } from 'react';
import VetDoctorHeader from './components/VetDoctorHeader';
import VetDoctorSidebar from './components/VetDoctorSidebar';
import StatisticsCards from './components/StatisticsCards';
import AppointmentCalendar from './components/AppointmentCalendar';

import AppointmentRequests from './components/AppointmentRequests';
import AppointmentHistory from './components/AppointmentHistory';
import Schedule from './components/Schedule';

const VetDoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <StatisticsCards />
            <div className="grid grid-cols-1  gap-6">
              <AppointmentCalendar />
              
            </div>
          </div>
        );
      case 'appointments':
        return <AppointmentCalendar />;
      case 'appointment-requests':
        return <AppointmentRequests />;
      case 'schedule':
        return <Schedule />;
      case 'appointment-history':
        return <AppointmentHistory />;
      default:
        return <StatisticsCards />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VetDoctorHeader 
        onMenuClick={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex">
        <VetDoctorSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6 pt-18 mt-3">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Irish Grover' }}>
                Veterinary Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage your veterinary practice efficiently</p>
            </div>
            
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VetDoctorDashboard;
