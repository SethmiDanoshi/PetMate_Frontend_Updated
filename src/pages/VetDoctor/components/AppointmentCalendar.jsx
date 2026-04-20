import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Stethoscope } from 'lucide-react';

const AppointmentCalendar = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* In-Clinic Appointments Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
        <div className="flex h-full">
          <div className="w-1/3 bg-gradient-to-r from-gray-200 to-gray-100 p-6 flex items-center justify-center">
            <div className="text-center">
              <Stethoscope className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">In-Clinic Appointments</h3>
            </div>
          </div>
          <div className="w-2/3 bg-gradient-to-r from-gray-100 to-white p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">In-Clinic Appointments</h3>
              <p className="text-gray-600">Manage your clinic-based appointments</p>
            </div>
            <Link
              to="/vetdoctor/in-clinic"
              className="bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow self-start mt-4"
            >
              View
            </Link>
          </div>
        </div>
      </div>

      {/* Home Visit Appointments Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-blue-200 h-full">
        <div className="flex h-full">
          <div className="w-1/3 bg-gradient-to-r from-blue-100 to-white p-6 flex items-center justify-center">
            <div className="text-center">
              <Home className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-800">Home-Visit Appointments</h3>
            </div>
          </div>
          <div className="w-2/3 bg-gradient-to-r from-white to-blue-50 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Home-Visit Appointments</h3>
              <p className="text-gray-600">Manage your home visit appointments</p>
            </div>
            <Link
              to="/vetdoctor/home-visit"
              className="bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow self-start mt-4"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
