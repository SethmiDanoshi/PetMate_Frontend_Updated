import React, { useEffect, useState } from "react";
import BuyerSidebar from "../../components/Buyer/BuyerSidebar";
import { updateAppointmentStatus } from "../../apis/doctorAPI";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaPaw, 
  FaStethoscope, 
  FaPhone, 
  FaEdit, 
  FaTimes, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaHistory,
  FaMapMarkerAlt
} from "react-icons/fa";
import { enqueueSnackbar } from "notistack";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancellingAppointment, setCancellingAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch appointments for the logged-in user
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = sessionStorage.getItem("uid");
        const response = await fetch(
          `http://localhost:8080/api/appointments/user/${userId}`
        );
        const data = await response.json();

        if (data.status && Array.isArray(data.data)) {
          setAppointments(data.data);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Check if appointment can be cancelled (before 24 hours)
  const canCancelAppointment = (appointmentDate, appointmentTime) => {
    try {
      const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
      const currentDateTime = new Date();
      const timeDifference = appointmentDateTime - currentDateTime;
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      
      return hoursDifference > 24;
    } catch (error) {
      console.error("Error calculating cancellation time:", error);
      return false;
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId, doctorId) => {
    try {
      setCancellingAppointment(appointmentId);
      
      // Call the API to cancel the appointment
      await updateAppointmentStatus(
        appointmentId,
        "CANCELLED",
        doctorId, // This should be the doctor's ID
        "Cancelled by user"
      );

      // Update local state
      setAppointments(prev => 
        prev.map(appt => 
          appt.id === appointmentId 
            ? { ...appt, status: "CANCELLED" }
            : appt
        )
      );

      enqueueSnackbar("Appointment cancelled successfully!", { variant: "success" });
      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      enqueueSnackbar(
        error?.message || "Failed to cancel appointment. Please try again.", 
        { variant: "error" }
      );
    } finally {
      setCancellingAppointment(null);
    }
  };

  // Open cancel modal
  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  // Close cancel modal
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedAppointment(null);
    setCancellingAppointment(null);
  };

  // Get status badge configuration
  const getStatusConfig = (status) => {
    const config = {
      PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: FaClock },
      CONFIRMED: { color: "bg-green-100 text-green-800 border-green-300", icon: FaCheckCircle },
      DECLINED: { color: "bg-red-100 text-red-800 border-red-300", icon: FaTimesCircle },
      CANCELLED: { color: "bg-gray-100 text-gray-800 border-gray-300", icon: FaTimes },
      COMPLETED: { color: "bg-blue-100 text-blue-800 border-blue-300", icon: FaCheckCircle }
    };
    return config[status] || config.PENDING;
  };

  // Cancel Confirmation Modal
  const CancelConfirmationModal = ({ appointment, onConfirm, onClose, loading }) => {
    if (!appointment) return null;

    const canCancel = canCancelAppointment(appointment.date, appointment.time);
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const formattedDate = appointmentDateTime.toLocaleString();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <FaExclamationTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cancel Appointment</h3>
                <p className="text-gray-600">Are you sure you want to cancel this appointment?</p>
              </div>
            </div>

            {!canCancel && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <FaExclamationTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">Cancellation Policy</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Appointments can only be cancelled at least 24 hours in advance. 
                  This appointment is scheduled for {formattedDate}.
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <FaCalendarAlt className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-900">{appointment.date}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaClock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{appointment.time}</span>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <FaStethoscope className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Dr. {appointment.doctorName}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => onConfirm(appointment.id, appointment.doctorId)}
                disabled={!canCancel || loading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cancelling...
                  </div>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Sidebar */}
      <BuyerSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Inika" }}>
                My Appointments
              </h1>
              <p className="text-gray-600">
                Manage and track your veterinary appointments
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {appointments.length} Total
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {appointments.filter(a => a.status === "CONFIRMED").length} Confirmed
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#640D56]"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
            <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
            <p className="text-gray-600 mb-6">You don't have any appointments scheduled yet.</p>
            <button className="bg-[#640D56] text-white px-6 py-3 rounded-xl hover:bg-[#8A2BE2] transition-colors">
              Book New Appointment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {appointments.map((appt) => {
              const statusConfig = getStatusConfig(appt.status);
              const StatusIcon = statusConfig.icon;
              const canCancel = canCancelAppointment(appt.date, appt.time);

              return (
                <div
                  key={appt.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Header with Status */}
                  <div className={`border-b ${statusConfig.color} px-6 py-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-4 h-4" />
                        <span className="font-semibold text-sm uppercase tracking-wide">
                          {appt.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        ID: #{appt.id?.slice(-6) || appt.id}
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="p-6">
                    {/* Date & Time */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span className="font-medium">{appt.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaClock className="w-4 h-4" />
                        <span>{appt.time}</span>
                      </div>
                    </div>

                    {/* Doctor Information */}
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FaStethoscope className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Dr. {appt.doctorName}</div>
                        <div className="text-sm text-gray-600">{appt.appointmentType}</div>
                      </div>
                    </div>

                    {/* Pet Information */}
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FaPaw className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{appt.petType}</div>
                        <div className="text-sm text-gray-600">Symptoms: {appt.symptoms}</div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-3">
                        <FaUser className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{appt.userName}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaPhone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{appt.userContactNumber}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-4 border-t border-gray-200">
                      {(appt.status === "PENDING" || appt.status === "CONFIRMED") && (
                        <button
                          onClick={() => openCancelModal(appt)}
                          disabled={!canCancel || cancellingAppointment === appt.id}
                          className="flex-1 bg-red-100 text-red-700 py-2 rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          {cancellingAppointment === appt.id ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700 mr-2"></div>
                              Cancelling...
                            </div>
                          ) : (
                            "Cancel Booking"
                          )}
                        </button>
                      )}

                      {appt.status === "DECLINED" && (
                        <button className="flex-1 bg-[#640D56] text-white py-2 rounded-xl hover:bg-[#8A2BE2] transition-colors text-sm font-medium">
                          Book Again
                        </button>
                      )}

                      {(appt.status === "PENDING" || appt.status === "CONFIRMED") && (
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
                          Edit Details
                        </button>
                      )}
                    </div>

                    {/* Cancellation Notice */}
                    {!canCancel && (appt.status === "PENDING" || appt.status === "CONFIRMED") && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FaExclamationTriangle className="w-3 h-3 text-yellow-600" />
                          <span className="text-yellow-700 text-xs">
                            Cancellation must be made 24 hours in advance
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <CancelConfirmationModal
            appointment={selectedAppointment}
            onConfirm={handleCancelAppointment}
            onClose={closeCancelModal}
            loading={cancellingAppointment !== null}
          />
        )}
      </div>
    </div>
  );
};

export default MyAppointments;