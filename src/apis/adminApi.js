import axiosInstance from "./axios"

export const AdminAuthApi = {
    signup : async(FormData) => {
        try {
            const response = await axiosInstance.post('/admin/auth/signup',
                FormData
            );
            console.log("response:", response);
            return response;
        } catch (error) {
            throw error;
        }
    },
    login: async(formData) => {
        try {
            const response = await axiosInstance.post('/admin/auth/login',
                formData
            )
            console.log("Login response", response);
            return response.data;
        } catch (error) {
            throw error
        }
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/users');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getPendingDoctors = async () => {
    try {
        const response = await axiosInstance.get('/admin/doctors/pending');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}


export const getVerifiesDoctors = async () => {
    try {
        const response = await axiosInstance.get('/admin/doctors/verified');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const setDoctorVerified = async (doctorId) => {
    try {
        const response = await axiosInstance.put(`/admin/doctors/${doctorId}/verify`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const setDoctorReject = async (doctorId) => {
    try {
        const response = await axiosInstance.put(`/admin/doctors/${doctorId}/reject?reason=Invalid documents.`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getDoctorRequstDetails = async (doctorId) => {
    try {
        const response = await axiosInstance.get(`doctors/profile/${doctorId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get('/products');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getAllPets = async () => {
    try {
        const response = await axiosInstance.get('/pets');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}


export const getAllOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getAllAppointments = async () => {
    try {
        const response = await axiosInstance.get('/appointments');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getAllAppointmentsWithDetails = async () => {
    try {
        const response = await axiosInstance.get('/appointments/all/details');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const blockUser = async (userId) => {
    try {
        const response = await axiosInstance.patch(`/users/${userId}/block`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const unBlockUser = async (userId) => {
    try {
        const response = await axiosInstance.patch(`/users/${userId}/unblock`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}


export const getSellerDetails = async (sellerId) => {
    try {
        const response = await axiosInstance.get(`/users/${sellerId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}