import axiosInstance from "./axios";

export const doctorSignUp = async (formData) => {
    try {
        const data = new FormData();
        data.append("name", formData.fullName);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("confirmPassword", formData.confirmPassword);
        data.append("contactNumber", formData.contactNumber || "");
        data.append("address", formData.address || "");
        data.append("licensePdf", formData.license);

        const response = await axiosInstance.post(`/doctors/signup`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const loginDoctor = async (email, password) => {
    try {
        const response = await axiosInstance.post(`/doctors/login`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const getDoctorAppointments = async (doctorId) => {
    try {
        const response = await axiosInstance.get(
            `/appointments/doctor/${doctorId}`
        );
        return response.data?.data || [];
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch appointments" };
    }
};

export const getDoctorAppointmentsStats = async (doctorId) => {
    try {
        const response = await axiosInstance.get(
            `/appointments/doctor/${doctorId}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch appointments" };
    }
};

export const updateAppointmentStatus = async (
    appointmentId,
    status,
    doctorId,
    note
) => {
    try {
        const response = await axiosInstance.put(
            `/appointments/${appointmentId}/status`,
            { status, note },
            {
                headers: {
                    "User-Id": doctorId,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update status" };
    }
};
