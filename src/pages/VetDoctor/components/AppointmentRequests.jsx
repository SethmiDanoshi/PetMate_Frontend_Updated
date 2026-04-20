import React, { useState, useEffect } from "react";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  ClipboardCheck, 
  Clock,
  Calendar,
  User,
  Phone,
  PawPrint,
  Stethoscope,
  MessageCircle,
  Filter,
  MoreVertical
} from "lucide-react";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../../../apis/doctorAPI.js";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
    CONFIRMED: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
    CANCELLED: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    COMPLETED: { color: "bg-green-100 text-green-800 border-green-200", icon: ClipboardCheck }
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      <IconComponent className="h-3 w-3" />
      {status}
    </span>
  );
};

// Note Modal Component
const NoteModal = ({ isOpen, onClose, onSubmit, currentNote, status }) => {
  const [note, setNote] = useState(currentNote || "");

  useEffect(() => {
    setNote(currentNote || "");
  }, [currentNote, isOpen]);

  if (!isOpen) return null;

  const statusMessages = {
    CONFIRMED: "Add instructions or confirmation details",
    CANCELLED: "Please provide a reason for cancellation",
    COMPLETED: "Add treatment notes or follow-up instructions"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Update Appointment Status
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {statusMessages[status] || "Add a note for this status change"}
        </p>
        
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your note here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(note)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Action Button Component
const ActionButton = ({ onClick, icon: Icon, label, variant = "primary" }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${variants[variant]}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
};

const AppointmentRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [noteModal, setNoteModal] = useState({ isOpen: false, appointmentId: null, status: null, currentNote: "" });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const doctorId = sessionStorage.getItem("doctorId");

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Fetch doctor appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getDoctorAppointments(doctorId);
        const filtered = data.filter((a) => a.status !== "COMPLETED");
        setAppointments(filtered);
      } catch (err) {
        setError("Failed to load appointments");
        showToast("Failed to load appointments", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorId]);

  // Update appointment status
  const handleStatusChange = async (id, newStatus) => {
    setNoteModal({ 
      isOpen: true, 
      appointmentId: id, 
      status: newStatus, 
      currentNote: appointments.find(a => a.id === id)?.note || "" 
    });
  };

  const confirmStatusChange = async (note) => {
    try {
      await updateAppointmentStatus(noteModal.appointmentId, noteModal.status, doctorId, note);
      
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === noteModal.appointmentId 
            ? { ...a, status: noteModal.status, note } 
            : a
        )
      );
      
      setNoteModal({ isOpen: false, appointmentId: null, status: null, currentNote: "" });
      showToast(`Appointment ${noteModal.status.toLowerCase()} successfully!`);
    } catch (err) {
      showToast("Failed to update appointment status", "error");
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch = 
      a.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.petType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id?.includes(searchTerm);

    const matchesFilter = filterStatus === "ALL" || a.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((key) => (
        <div key={key} className="border border-gray-200 rounded-xl p-6">
          <div className="animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item}>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal({ isOpen: false, appointmentId: null, status: null, currentNote: "" })}
        onSubmit={confirmStatusChange}
        currentNote={noteModal.currentNote}
        status={noteModal.status}
      />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Requests</h1>
          <p className="text-gray-600 mt-1">Manage and review incoming appointment requests</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: appointments.length, color: "bg-gray-100 text-gray-700" },
          { label: "Pending", value: appointments.filter(a => a.status === "PENDING").length, color: "bg-yellow-100 text-yellow-700" },
          { label: "Confirmed", value: appointments.filter(a => a.status === "CONFIRMED").length, color: "bg-blue-100 text-blue-700" },
          { label: "Cancelled", value: appointments.filter(a => a.status === "CANCELLED").length, color: "bg-red-100 text-red-700" }
        ].map((stat, index) => (
          <div key={index} className={`p-4 rounded-xl ${stat.color}`}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-75">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && <SkeletonLoader />}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">Unable to load appointments</div>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAppointments.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            {searchTerm || filterStatus !== "ALL" 
              ? "Try adjusting your search or filter criteria"
              : "When you receive new appointment requests, they'll appear here"
            }
          </p>
        </div>
      )}

      {/* Appointment List */}
      {!loading && !error && filteredAppointments.length > 0 && (
        <div className="space-y-6">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-200 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Header with ID and Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Appointment #{appointment.id}</h3>
                    <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                  </div>
                </div>
                <StatusBadge status={appointment.status} />
              </div>

              {/* Appointment Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Stethoscope className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold text-gray-900">{appointment.appointmentType}</p>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              {appointment.symptoms && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Symptoms / Description</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{appointment.symptoms}</p>
                </div>
              )}

              {/* Actions and Notes Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {appointment.status === "PENDING" && (
                    <>
                      <ActionButton
                        onClick={() => handleStatusChange(appointment.id, "CONFIRMED")}
                        icon={CheckCircle}
                        label="Accept"
                        variant="success"
                      />
                      <ActionButton
                        onClick={() => handleStatusChange(appointment.id, "CANCELLED")}
                        icon={XCircle}
                        label="Decline"
                        variant="danger"
                      />
                    </>
                  )}

                  {appointment.status === "CONFIRMED" && (
                    <ActionButton
                      onClick={() => handleStatusChange(appointment.id, "COMPLETED")}
                      icon={ClipboardCheck}
                      label="Mark Completed"
                      variant="primary"
                    />
                  )}
                </div>

                {/* Note Display */}
                {appointment.note && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 max-w-md">
                    <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Note:</strong> {appointment.note}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentRequests;