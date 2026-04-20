import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  PawPrint, 
  Stethoscope, 
  MapPin,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock4
} from 'lucide-react';
import { getDoctorAppointments, getDoctorAppointmentsStats } from '../../apis/doctorAPI.js';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    CONFIRMED: { 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: CheckCircle,
      label: 'Confirmed'
    },
    PENDING: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock4,
      label: 'Pending'
    },
    COMPLETED: { 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      label: 'Completed'
    },
    CANCELLED: { 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      label: 'Cancelled'
    }
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      <IconComponent className="h-3 w-3" />
      {config.label}
    </span>
  );
};

const AppointmentCard = ({ appointment }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Appointment #{appointment.id.slice(-8)}</h3>
              <p className="text-sm text-gray-500">{appointment.date} at {appointment.time?.slice(0, 5)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={appointment.status} />
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Pet Owner Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pet Owner</p>
                <p className="font-semibold text-gray-900">{appointment.userName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <PawPrint className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pet Type</p>
                <p className="font-semibold text-gray-900">{appointment.petType}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Phone className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-semibold text-gray-900">{appointment.userContactNumber}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Appointment Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Stethoscope className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Appointment Type</p>
                <p className="font-semibold text-gray-900">In-Clinic Visit</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <MapPin className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold text-gray-900">Clinic Facility</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-cyan-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold text-gray-900">30-45 minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Symptoms - Always Visible */}
        {appointment.symptoms && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Symptoms / Description</p>
            <p className="text-gray-600 text-sm">{appointment.symptoms}</p>
          </div>
        )}

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Appointment ID</p>
                <p className="font-mono text-gray-900">{appointment.id}</p>
              </div>
              <div>
                <p className="text-gray-500">Doctor</p>
                <p className="text-gray-900">{appointment.doctorName}</p>
              </div>
              <div>
                <p className="text-gray-500">Created</p>
                <p className="text-gray-900">{appointment.createdAt}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="text-gray-900">{appointment.updatedAt}</p>
              </div>
            </div>
            
            {appointment.notes && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-700 mb-1">Doctor's Notes</p>
                <p className="text-blue-600 text-sm">{appointment.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {showDetails ? 'Show Less' : 'View Details'}
          </button>
          
          <div className="flex gap-2">
            {appointment.status === 'PENDING' && (
              <>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                  Accept
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  Decline
                </button>
              </>
            )}
            {appointment.status === 'CONFIRMED' && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Mark Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InClinicAppointments = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    let mounted = true;
    
    const fetchAppointments = async () => {
      try {
        const doctorId = sessionStorage.getItem("doctorId");
        if (!doctorId) {
          setError('Doctor ID not found');
          setLoading(false);
          return;
        }

        const response = await getDoctorAppointmentsStats(doctorId);
        
        if (!mounted) return;

        if (response && response.status && response.data) {
          // Filter only IN_CLINIC appointments
          const inClinicApps = response.data.filter(app => 
            app.appointmentType === 'IN_CLINIC'
          );
          setAppointments(inClinicApps);
        } else {
          setError('Failed to load appointment data');
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        if (mounted) {
          setError('Failed to load appointments');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAppointments();
    
    return () => { mounted = false; };
  }, []);

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.petType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(app => app.status === 'CONFIRMED').length,
    pending: appointments.filter(app => app.status === 'PENDING').length,
    completed: appointments.filter(app => app.status === 'COMPLETED').length,
    cancelled: appointments.filter(app => app.status === 'CANCELLED').length,
  };

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((key) => (
        <div key={key} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="animate-pulse">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">In-Clinic Appointments</h1>
          <p className="text-gray-600">Manage and view all your in-clinic appointment requests</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, color: "bg-gray-100 text-gray-700" },
            { label: "Confirmed", value: stats.confirmed, color: "bg-blue-50 text-blue-700" },
            { label: "Pending", value: stats.pending, color: "bg-yellow-50 text-yellow-700" },
            { label: "Completed", value: stats.completed, color: "bg-green-50 text-green-700" },
          ].map((stat, index) => (
            <div key={index} className={`p-4 rounded-xl ${stat.color}`}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-75">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value="ALL">All Status</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Showing {filteredAppointments.length} of {appointments.length} appointments
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && <SkeletonLoader />}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="text-red-700 hover:text-red-800 font-medium underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAppointments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'ALL' 
                ? "Try adjusting your search or filter criteria"
                : "When you receive new in-clinic appointments, they'll appear here"
              }
            </p>
          </div>
        )}

        {/* Appointments List */}
        {!loading && !error && filteredAppointments.length > 0 && (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600 bg-white rounded-2xl shadow-lg py-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
            <span>PetMate © 2024</span>
            <span className="hidden sm:block">•</span>
            <span>Terms of Service</span>
            <span className="hidden sm:block">•</span>
            <span>Data Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InClinicAppointments;