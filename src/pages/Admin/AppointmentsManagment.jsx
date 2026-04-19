// src/pages/Admin/AppointmentsManagement.jsx
import React, { useState, useEffect } from 'react';

import { Search, Filter, Calendar, Clock, User, Stethoscope, MapPin } from 'lucide-react';
import { getAllAppointmentsWithDetails } from '../../apis/adminApi';
import AdminSidebar from '../../components/Admin/AdminSidebar';

const AppointmentsManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterType, setFilterType] = useState('ALL');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await getAllAppointmentsWithDetails();
                if (response?.status && response.data) {
                    setAppointments(response.data);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch =
            appointment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || appointment.status === filterStatus;
        const matchesType = filterType === 'ALL' || appointment.appointmentType === filterType;
        return matchesSearch && matchesStatus && matchesType;
    });

    const statusConfig = {
        PENDING: { color: 'bg-yellow-100 text-yellow-800' },
        COMPLETED: { color: 'bg-green-100 text-green-800' },
        CANCELLED: { color: 'bg-red-100 text-red-800' }
    };

    const typeConfig = {
        IN_CLINIC: { color: 'bg-blue-100 text-blue-800', label: 'In-Clinic' },
        HOME_VISIT: { color: 'bg-purple-100 text-purple-800', label: 'Home Visit' }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
       <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
         <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Appointments Management</h1>
                    <p className="text-gray-600">Manage all veterinary appointments</p>
                </div>
                <div className="text-sm text-gray-500">
                    Total: {filteredAppointments.length} appointments
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{appointments.length}</div>
                    <div className="text-sm text-gray-600">Total Appointments</div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                        {appointments.filter(a => a.status === 'PENDING').length}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {appointments.filter(a => a.status === 'COMPLETED').length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {appointments.filter(a => a.appointmentType === 'IN_CLINIC').length}
                    </div>
                    <div className="text-sm text-gray-600">In-Clinic</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="ALL">All Types</option>
                            <option value="IN_CLINIC">In-Clinic</option>
                            <option value="HOME_VISIT">Home Visit</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">Appointment #{appointment.id.slice(-8)}</h3>
                                <p className="text-sm text-gray-600">{appointment.petType} • {appointment.appointmentType}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[appointment.status]?.color}`}>
                                    {appointment.status}
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeConfig[appointment.appointmentType]?.color}`}>
                                    {typeConfig[appointment.appointmentType]?.label}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="text-gray-500">Pet Owner</p>
                                    <p className="font-semibold text-gray-900">{appointment.userName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="text-gray-500">Vet Doctor</p>
                                    <p className="font-semibold text-gray-900">{appointment.doctorName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="text-gray-500">Date & Time</p>
                                    <p className="font-semibold text-gray-900">
                                        {appointment.date} at {appointment.time?.slice(0, 5)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <div>
                                    <p className="text-gray-500">Contact</p>
                                    <p className="font-semibold text-gray-900">{appointment.userContactNumber}</p>
                                </div>
                            </div>
                        </div>

                        {appointment.symptoms && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Symptoms</p>
                                <p className="text-gray-600 text-sm">{appointment.symptoms}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                            <span>Created: {new Date(appointment.createdAt).toLocaleDateString()}</span>
                            <span>Updated: {new Date(appointment.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAppointments.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
            )}
        </div>
      </div>
    </div>
    );
};

export default AppointmentsManagement;