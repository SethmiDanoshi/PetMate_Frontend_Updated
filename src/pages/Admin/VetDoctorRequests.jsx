// src/pages/Admin/VetDoctorRequests.jsx
import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { getPendingDoctors, setDoctorVerified, setDoctorReject, getDoctorRequstDetails } from "../../apis/adminApi";
import { Search, Eye, CheckCircle, XCircle, Download, User, Mail, Phone, MapPin, FileText, X } from "lucide-react";

const VetDoctorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showLicenseViewer, setShowLicenseViewer] = useState(false);
  const [currentLicenseUrl, setCurrentLicenseUrl] = useState("");

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      setLoading(true);
      const response = await getPendingDoctors();
      if (response?.status && response.data) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching pending doctors:", error);
      showToast("Failed to load vet doctor requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorDetails = async (doctorId) => {
    try {
      setLoadingDetails(true);
      const response = await getDoctorRequstDetails(doctorId);
      if (response?.status && response.data) {
        setDoctorDetails(response.data);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      showToast("Failed to load doctor details", "error");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = async (doctor) => {
    setSelectedDoctor(doctor);
    await fetchDoctorDetails(doctor.id);
  };

  const showConfirmation = (action, doctorId) => {
    setConfirmAction({ type: action, doctorId });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const { type, doctorId } = confirmAction;
    
    try {
      let response;
      if (type === 'accept') {
        response = await setDoctorVerified(doctorId);
      } else {
        response = await setDoctorReject(doctorId);
      }

      if (response?.status) {
        const actionText = type === 'accept' ? 'accepted' : 'declined';
        showToast(`Vet doctor ${actionText} successfully!`, "success");
        setRequests(prev => prev.filter(req => req.id !== doctorId));
        
        // Close modals
        setShowDetailsModal(false);
        setShowConfirmModal(false);
      }
    } catch (error) {
      console.error(`Error ${type}ing doctor:`, error);
      showToast(`Failed to ${type} vet doctor`, "error");
    } finally {
      setConfirmAction(null);
    }
  };

  const viewLicense = (licenseUrl) => {
    setCurrentLicenseUrl(licenseUrl);
    setShowLicenseViewer(true);
  };

  const downloadLicense = (licenseUrl, fileName) => {
    const link = document.createElement('a');
    link.href = licenseUrl;
    link.download = fileName || 'license.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("License download started", "success");
  };

  const showToast = (message, type = "info") => {
    // You can replace this with your preferred toast notification system
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const filteredRequests = requests.filter(req =>
    req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.contactNumber?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Irish Grover" }}>
              Vet Doctor Requests
            </h1>
            <p className="text-gray-600 mt-1">Review and manage veterinary doctor applications</p>
          </div>
          <div className="text-sm text-gray-500">
            {filteredRequests.length} pending request{filteredRequests.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
              <p className="text-gray-600">All vet doctor applications have been processed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Doctor Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact Information
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      License
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{doctor.contactNumber}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{doctor.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewLicense(doctor.licensePdfUrl)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button
                            onClick={() => downloadLicense(doctor.licensePdfUrl, `license_${doctor.name}.pdf`)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(doctor)}
                            className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            <User className="h-4 w-4" />
                            Details
                          </button>
                          <button
                            onClick={() => showConfirmation('accept', doctor.id)}
                            className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => showConfirmation('decline', doctor.id)}
                            className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            <XCircle className="h-4 w-4" />
                            Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Doctor Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Doctor Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {loadingDetails ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ) : doctorDetails ? (
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-semibold text-gray-900">{doctorDetails.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold text-gray-900">{doctorDetails.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Contact Number</p>
                            <p className="font-semibold text-gray-900">{doctorDetails.contactNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-semibold text-gray-900">{doctorDetails.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* License Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">License Information</h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                          <button
                            onClick={() => viewLicense(selectedDoctor.licensePdfUrl)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View License
                          </button>
                          <button
                            onClick={() => downloadLicense(selectedDoctor.licensePdfUrl, `license_${selectedDoctor.name}.pdf`)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            Download PDF
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 text-center mt-3">
                          File ID: {selectedDoctor.licensePdfPublicId}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => showConfirmation('accept', selectedDoctor.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        <CheckCircle className="h-5 w-5" />
                        Accept Application
                      </button>
                      <button
                        onClick={() => showConfirmation('decline', selectedDoctor.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        <XCircle className="h-5 w-5" />
                        Decline Application
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Failed to load doctor details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && confirmAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                  confirmAction.type === 'accept' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {confirmAction.type === 'accept' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">
                  {confirmAction.type === 'accept' ? 'Accept Vet Doctor?' : 'Decline Vet Doctor?'}
                </h3>
                <p className="text-gray-500 mt-2">
                  {confirmAction.type === 'accept' 
                    ? 'Are you sure you want to accept this vet doctor? They will be able to start receiving appointments.'
                    : 'Are you sure you want to decline this vet doctor? This action cannot be undone.'
                  }
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                    confirmAction.type === 'accept' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {confirmAction.type === 'accept' ? 'Yes, Accept' : 'Yes, Decline'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* License Viewer Modal */}
        {showLicenseViewer && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">License Document</h3>
                <button
                  onClick={() => setShowLicenseViewer(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                {currentLicenseUrl.endsWith('.pdf') ? (
                  <iframe
                    src={currentLicenseUrl}
                    className="w-full h-full min-h-[500px] rounded-lg"
                    title="License Document"
                  />
                ) : (
                  <img
                    src={currentLicenseUrl}
                    alt="License Document"
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                  />
                )}
              </div>
              <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => downloadLicense(currentLicenseUrl, 'license_document.pdf')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VetDoctorRequests;