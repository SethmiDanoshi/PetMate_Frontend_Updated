import axiosInstance from "./axios";

export const createPaymentIntent = async (data) => {
    try {
        const response = await axiosInstance.post('/payments/create-payment-intent', data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const createOrder = async (data) => {
    try {
        const response = await axiosInstance.post('/payments/orders', data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}