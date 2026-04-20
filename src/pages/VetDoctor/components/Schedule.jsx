import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  User, 
  MoreVertical,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  Clock4
} from 'lucide-react';
import { getDoctorAppointments } from '../../../apis/doctorAPI.js';

const Schedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month'); // 'month' or 'day'
  const [statusFilter, setStatusFilter] = useState('ALL');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const doctorId = sessionStorage.getItem("doctorId");
    if (!doctorId) return;

    (async () => {
      try {
        const data = await getDoctorAppointments(doctorId);
        setAppointments(data || []);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getStatusConfig = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "CONFIRMED": 
        return { 
          color: "bg-blue-500", 
          lightColor: "bg-blue-50 text-blue-700 border-blue-200",
          icon: CheckCircle,
          label: "Confirmed"
        };
      case "PENDING": 
        return { 
          color: "bg-yellow-500", 
          lightColor: "bg-yellow-50 text-yellow-700 border-yellow-200",
          icon: Clock4,
          label: "Pending"
        };
      case "REJECTED": 
        return { 
          color: "bg-red-500", 
          lightColor: "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
          label: "Rejected"
        };
      case "COMPLETED":
        return {
          color: "bg-green-500",
          lightColor: "bg-green-50 text-green-700 border-green-200",
          icon: CheckCircle,
          label: "Completed"
        };
      default: 
        return { 
          color: "bg-gray-400", 
          lightColor: "bg-gray-50 text-gray-700 border-gray-200",
          icon: Clock,
          label: "Unknown"
        };
    }
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    let filteredAppointments = appointments.filter(app => app.date === dateStr);
    
    if (statusFilter !== 'ALL') {
      filteredAppointments = filteredAppointments.filter(app => 
        app.status?.toUpperCase() === statusFilter
      );
    }
    
    return filteredAppointments.map(app => {
      const config = getStatusConfig(app.status);
      const IconComponent = config.icon;
      return {
        ...app,
        title: `${app.userName} - ${app.petType}`,
        color: config.color,
        lightColor: config.lightColor,
        icon: IconComponent,
        time: app.time || 'No time specified'
      };
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const getAppointmentsForSelectedDate = () => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate);
  };

  const days = getDaysInMonth(currentMonth);

  // Stats for the current month
  const currentMonthAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate.getMonth() === currentMonth.getMonth() && 
           appDate.getFullYear() === currentMonth.getFullYear();
  });

  const stats = {
    total: currentMonthAppointments.length,
    confirmed: currentMonthAppointments.filter(app => app.status?.toUpperCase() === 'CONFIRMED').length,
    pending: currentMonthAppointments.filter(app => app.status?.toUpperCase() === 'PENDING').length,
    rejected: currentMonthAppointments.filter(app => app.status?.toUpperCase() === 'REJECTED').length,
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Schedule</h1>
          <p className="text-gray-600 mt-1">Manage and view your appointment calendar</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'month' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'day' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day View
            </button>
          </div>

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
              <option value="REJECTED">Rejected</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Appointments", value: stats.total, color: "bg-gray-100 text-gray-700" },
          { label: "Confirmed", value: stats.confirmed, color: "bg-blue-50 text-blue-700" },
          { label: "Pending", value: stats.pending, color: "bg-yellow-50 text-yellow-700" },
          { label: "Rejected", value: stats.rejected, color: "bg-red-50 text-red-700" },
        ].map((stat, index) => (
          <div key={index} className={`p-4 rounded-xl ${stat.color}`}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-75">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToToday}
            className="bg-[#640D56] text-white px-4 py-2 rounded-lg hover:bg-[#4A0A41] transition-colors font-medium flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Today
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
        </div>
        
        <div className="text-sm text-gray-600">
          {selectedDate && (
            <span>
              Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Days Header */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {daysOfWeek.map((day) => (
                <div 
                  key={day} 
                  className="p-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#640D56] mx-auto mb-2"></div>
                Loading calendar...
              </div>
            ) : (
              <div className="grid grid-cols-7">
                {days.map((dayData, index) => {
                  const events = getEventsForDate(dayData.date);
                  const isToday = dayData.date.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate && dayData.date.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(dayData.date)}
                      className={`min-h-[140px] p-3 border-r border-b border-gray-200 last:border-r-0 cursor-pointer transition-all
                        ${dayData.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                        ${isToday ? 'bg-blue-50 ring-2 ring-blue-200' : ''}
                        ${isSelected ? 'bg-purple-50 ring-2 ring-[#640D56]' : ''}
                        hover:bg-gray-50`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`text-sm font-medium ${
                            dayData.isCurrentMonth 
                              ? isToday ? 'text-blue-600' : 'text-gray-900'
                              : 'text-gray-400'
                          } ${
                            isSelected ? 'text-[#640D56] font-bold' : ''
                          }`}
                        >
                          {dayData.date.getDate()}
                        </span>
                        {events.length > 0 && (
                          <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-1">
                            {events.length}
                          </span>
                        )}
                      </div>

                      {/* Events */}
                      <div className="space-y-2">
                        {events.slice(0, 3).map((event, eventIndex) => {
                          const IconComponent = event.icon;
                          return (
                            <div
                              key={eventIndex}
                              className={`text-xs p-2 rounded-lg border-l-4 ${event.lightColor} truncate cursor-pointer hover:shadow-sm transition-shadow`}
                              title={`${event.title} - ${event.time}`}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                <IconComponent className="h-3 w-3" />
                                <span className="font-medium">{event.time}</span>
                              </div>
                              <div className="truncate">{event.title}</div>
                            </div>
                          );
                        })}
                        {events.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{events.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Selected Date Details */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#640D56]" />
              {selectedDate 
                ? `Appointments for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
                : 'Select a date to view appointments'
              }
            </h3>

            {selectedDate && (
              <div className="space-y-4">
                {getAppointmentsForSelectedDate().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No appointments scheduled</p>
                  </div>
                ) : (
                  getAppointmentsForSelectedDate().map((appointment, index) => {
                    const config = getStatusConfig(appointment.status);
                    const IconComponent = config.icon;
                    
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <IconComponent className={`h-4 w-4 ${config.lightColor.split(' ')[2]}`} />
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.lightColor}`}>
                              {config.label}
                            </span>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{appointment.userName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{appointment.time}</span>
                          </div>
                          
                          {appointment.petType && (
                            <div className="text-sm text-gray-600">
                              <strong>Pet:</strong> {appointment.petType}
                            </div>
                          )}
                          
                          {appointment.appointmentType && (
                            <div className="text-sm text-gray-600">
                              <strong>Type:</strong> {appointment.appointmentType}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Status Legend</h4>
            <div className="space-y-2">
              {['CONFIRMED', 'PENDING', 'REJECTED', 'COMPLETED'].map((status) => {
                const config = getStatusConfig(status);
                const IconComponent = config.icon;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                    <IconComponent className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{config.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;