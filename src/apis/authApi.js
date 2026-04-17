import axiosInstance from "./axios"

export const AuthApi = {
    signup : async(FormData) => {
        try {
            const response = await axiosInstance.post('/auth/signup',
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
            const response = await axiosInstance.post('/auth/login',
                formData
            )
            console.log("Login response", response);
            return response.data;
        } catch (error) {
            throw error
        }
    }
}