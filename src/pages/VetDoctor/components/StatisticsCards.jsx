import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Users, 
  Home, 
  Building,
  TrendingUp,
  BarChart3,
  Activity
} from 'lucide-react';
import { getDoctorAppointmentsStats } from '../../../apis/doctorAPI.js';

// Simple Chart Component
const SimpleBarChart = ({ data, colors }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-20 text-sm text-gray-600 font-medium">{item.label}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div 
                className="h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: colors[index % colors.length]
                }}
              ></div>
              <span className="text-sm font-semibold text-gray-700 min-w-8">
                {item.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Donut Chart Component
const DonutChart = ({ data, colors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="-4 0 38 34" className="w-32 h-32 transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = -accumulated;
          accumulated += percentage;

          return (
            <circle
              key={index}
              cx="16"
              cy="16"
              r="15.9155"
              fill="transparent"
              stroke={colors[index % colors.length]}
              strokeWidth="2"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};

const StatisticsCards = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    inClinic: { total: 0, remaining: 0, completed: 0, pending: 0, confirmed: 0, cancelled: 0 },
    homeVisit: { total: 0, remaining: 0, completed: 0, pending: 0, confirmed: 0, cancelled: 0 },
    overall: { total: 0, confirmed: 0, pending: 0, cancelled: 0, completed: 0 }
  });

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
          const appointments = response.data;
          
          const inClinicApps = appointments.filter(app => 
            app.appointmentType === 'IN_CLINIC'
          );
          
          const homeVisitApps = appointments.filter(app => 
            app.appointmentType === 'HOME_VISIT'
          );

          const today = new Date().toISOString().split('T')[0];
          
          const calculateStats = (appointments) => ({
            total: appointments.length,
            completed: appointments.filter(app => app.status === 'COMPLETED').length,
            pending: appointments.filter(app => app.status === 'PENDING').length,
            remaining: appointments.filter(app => 
              app.status === 'CONFIRMED' && app.date >= today
            ).length,
            confirmed: appointments.filter(app => app.status === 'CONFIRMED').length,
            cancelled: appointments.filter(app => app.status === 'CANCELLED').length
          });

          const inClinicStats = calculateStats(inClinicApps);
          const homeVisitStats = calculateStats(homeVisitApps);

          setStats({
            inClinic: inClinicStats,
            homeVisit: homeVisitStats,
            overall: {
              total: appointments.length,
              confirmed: inClinicStats.confirmed + homeVisitStats.confirmed,
              pending: inClinicStats.pending + homeVisitStats.pending,
              cancelled: inClinicStats.cancelled + homeVisitStats.cancelled,
              completed: inClinicStats.completed + homeVisitStats.completed
            }
          });
        } else {
          setError('Failed to load appointment data');
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        if (mounted) {
          setError('Failed to load statistics');
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

  // Chart data
  const statusChartData = [
    { label: 'Confirmed', value: stats.overall.confirmed },
    { label: 'Pending', value: stats.overall.pending },
    { label: 'Completed', value: stats.overall.completed },
    { label: 'Cancelled', value: stats.overall.cancelled },
  ];

  const typeChartData = [
    { label: 'In-Clinic', value: stats.inClinic.total },
    { label: 'Home Visit', value: stats.homeVisit.total },
  ];

  const colors = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

  // Enhanced loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((line) => (
                    <div key={line} className="flex items-center gap-3">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-2 bg-gray-200 rounded flex-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="text-red-700 hover:text-red-800 font-medium underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, description, trend }) => {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-600 font-medium">{trend}</span>
            <span className="text-gray-500">from last week</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Analytics</h1>
          <p className="text-gray-600 mt-1">Overview of your practice performance</p>
        </div>
        <div className="text-sm text-gray-500">
          Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Appointments"
          value={stats.overall.total}
          icon={Users}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          description="All time appointments"
        />
        <StatCard
          title="Completed"
          value={stats.overall.completed}
          icon={CheckCircle}
          color="bg-gradient-to-br from-green-500 to-green-600"
          description="Successfully handled"
        />
        <StatCard
          title="Upcoming"
          value={stats.inClinic.remaining + stats.homeVisit.remaining}
          icon={Clock}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          description="Scheduled visits"
        />
        <StatCard
          title="Pending Approval"
          value={stats.overall.pending}
          icon={Activity}
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          description="Awaiting confirmation"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Appointment Status Distribution</h3>
          </div>
          <SimpleBarChart 
            data={statusChartData} 
            colors={colors}
          />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {statusChartData.map((item, index) => (
              <div key={item.label} className="text-center">
                <div className="text-2xl font-bold" style={{ color: colors[index] }}>
                  {item.value}
                </div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Types */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Appointment Types</h3>
          </div>
          <div className="flex flex-col items-center ">
            <DonutChart 
              data={typeChartData} 
              colors={[colors[0], colors[4]]}
            />
            <div className="mt-6 space-y-3 w-full">
              {typeChartData.map((item, index) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index * 2] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-500">
                      {stats.overall.total > 0 ? Math.round((item.value / stats.overall.total) * 100) : 0}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* In-Clinic Details */}
        <Link to="/vetdoctor/in-clinic" className="block group">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Building className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">In-Clinic Details</h3>
                <p className="text-sm text-gray-600">Clinic facility appointments</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-700">{stats.inClinic.confirmed}</div>
                <div className="text-xs text-purple-600">Confirmed</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-700">{stats.inClinic.pending}</div>
                <div className="text-xs text-yellow-600">Pending</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-700">{stats.inClinic.completed}</div>
                <div className="text-xs text-green-600">Completed</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-700">{stats.inClinic.cancelled}</div>
                <div className="text-xs text-red-600">Cancelled</div>
              </div>
            </div>
          </div>
        </Link>

        {/* Home Visit Details */}
        <Link to="/vetdoctor/home-visit" className="block group">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Home className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Home Visit Details</h3>
                <p className="text-sm text-gray-600">Patient location visits</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="text-xl font-bold text-indigo-700">{stats.homeVisit.confirmed}</div>
                <div className="text-xs text-indigo-600">Confirmed</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-700">{stats.homeVisit.pending}</div>
                <div className="text-xs text-yellow-600">Pending</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-700">{stats.homeVisit.completed}</div>
                <div className="text-xs text-green-600">Completed</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-700">{stats.homeVisit.cancelled}</div>
                <div className="text-xs text-red-600">Cancelled</div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/vetdoctor/in-clinic" 
            className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-200"
          >
            <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">View In-Clinic</div>
            <div className="text-sm text-gray-600">{stats.inClinic.pending} pending</div>
          </Link>
          <Link 
            to="/vetdoctor/home-visit" 
            className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-200"
          >
            <Home className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">View Home Visits</div>
            <div className="text-sm text-gray-600">{stats.homeVisit.pending} pending</div>
          </Link>
          <Link 
            to="/vetdoctor/schedule" 
            className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-200"
          >
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-900">View Schedule</div>
            <div className="text-sm text-gray-600">Calendar view</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;