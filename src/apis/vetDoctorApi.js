import api from './axios';

// Toggle mock via env or by failing requests and falling back
const useMock = process.env.REACT_APP_USE_MOCK === 'true';

// ---- MOCK DATA ----
const mock = {
  dashboard: {
    inClinic: { total: 12, remaining: 8, completed: 12 },
    homeVisit: { total: 12, remaining: 8, completed: 12 },
  },
  inClinicAppointments: [
    { id: '001', owner: 'Sethmi', petType: 'Dog', symptoms: 'peeing more and vomiting', contact: '+9476 456 3387', bookingType: 'In-Clinic', date: '2024.12.30', time: '10.30', status: 'Completed' },
    { id: '004', owner: 'Danoshi', petType: 'Cat', symptoms: 'Frequent coughing', contact: '+9476 456 3387', bookingType: 'In-Clinic', date: '2024.12.27', time: '4.30', status: 'Pending' },
    { id: '005', owner: 'Hansi', petType: 'Cat', symptoms: 'Frequent coughing', contact: '+9476 456 3387', bookingType: 'In-Clinic', date: '2024.12.27', time: '2.30', status: 'Pending' },
  ],
  homeVisitAppointments: [
    { id: '001', owner: 'Sethmi', petType: 'Dog', symptoms: 'peeing more and vomiting', contact: '+9476 456 3387', bookingType: 'Home-Visit', date: '2024.12.30', time: '10.30', status: 'Pending' },
    { id: '004', owner: 'Danoshi', petType: 'Cat', symptoms: 'Frequent coughing', contact: '+9476 456 3387', bookingType: 'Home-Visit', date: '2024.12.27', time: '4.30', status: 'Completed' },
    { id: '005', owner: 'Hansi', petType: 'Cat', symptoms: 'Frequent coughing', contact: '+9476 456 3387', bookingType: 'Home-Visit', date: '2024.12.27', time: '2.30', status: 'Pending' },
  ],
  appointmentRequests: [
    { id: '001', petOwnerName: 'Sethmi', typeOfPet: 'Dog', symptoms: 'peeing more and vomiting', contactNumber: '+9476 456 3387', typeOfBooking: 'In-Clinic', date: '2004.12.30', timeSlot: '10:30' },
    { id: '004', petOwnerName: 'Danoshi', typeOfPet: 'Cat', symptoms: 'Frequent coughing', contactNumber: '+9476 456 3387', typeOfBooking: 'In-Clinic', date: '2004.12.27', timeSlot: '4:30' },
    { id: '005', petOwnerName: 'Hansi', typeOfPet: 'Dog', symptoms: 'peeing more and vomiting', contactNumber: '+9476 456 3387', typeOfBooking: 'In-Clinic', date: '2004.12.27', timeSlot: '2:30' },
  ],
};

async function tryRequest(requestFn, fallback) {
  if (useMock) return new Promise((res) => setTimeout(() => res(fallback), 300));
  try {
    const res = await requestFn();
    return res.data;
  } catch (e) {
    // fallback to mock for now
    return new Promise((res) => setTimeout(() => res(fallback), 300));
  }
}

export const vetDoctorApi = {
  async getDashboardStats() {
    return tryRequest(() => api.get('/vet/dashboard'), mock.dashboard);
  },
  async getInClinicAppointments() {
    return tryRequest(() => api.get('/vet/appointments/in-clinic'), mock.inClinicAppointments);
  },
  async getHomeVisitAppointments() {
    return tryRequest(() => api.get('/vet/appointments/home-visit'), mock.homeVisitAppointments);
  },
  async getAppointmentRequests() {
    return tryRequest(() => api.get('/vet/appointments/requests'), mock.appointmentRequests);
  },
};

export default vetDoctorApi;
