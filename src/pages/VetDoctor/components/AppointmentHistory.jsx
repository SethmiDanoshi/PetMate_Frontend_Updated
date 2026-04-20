import React, { useEffect, useState } from "react";
import { Search, CheckCircle, Loader2, CalendarCheck2 } from "lucide-react";
import { getDoctorAppointments } from "../../../apis/doctorAPI.js";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const doctorId = sessionStorage.getItem("doctorId");
        const data = await getDoctorAppointments(doctorId);

        console.log("Fetched appointments:", data);

        // ✅ Filter only completed appointments
        const completedAppointments = data.filter(
          (a) => a.status?.toUpperCase() === "COMPLETED"
        );

        setAppointments(completedAppointments);
        setFilteredHistory(completedAppointments);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter(
      (appointment) =>
        appointment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.petType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.id?.toString().includes(searchTerm)
    );
    setFilteredHistory(filtered);
  }, [searchTerm, appointments]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <CalendarCheck2 className="h-6 w-6 text-[#640D56]" />
          <h2 className="text-2xl font-bold text-gray-800">Appointment History</h2>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by owner name or pet type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#640D56] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading appointment history...
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">
            No completed appointments found
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Try adjusting your search or check back later.
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                    App. ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                    Pet Owner
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                    Pet Type
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                    Booking Type
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase text-xs">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHistory.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-700 font-medium">
                      {appointment.id}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {appointment.userName}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {appointment.petType}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {appointment.appointmentType.replace("_", " ")}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {appointment.date}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 flex justify-between text-sm text-gray-600 border-t border-gray-100 pt-4">
            <span>Total Completed Appointments: {filteredHistory.length}</span>
            <span className="text-green-600 font-medium">
              All appointments completed successfully
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentHistory;
