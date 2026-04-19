import axiosInstance from "./axios";

export const fetchOrdersBySeller = async (sellerId) => {
    try {
        const response = await axiosInstance.get(`/orders/seller/${sellerId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
export const fetchOrdersByBuyer = async (buyerId) => {
    try {
        const response = await axiosInstance.get(`/orders/buyer/${buyerId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const response = await axiosInstance.patch(
            `/orders/${orderId}/status?status=${newStatus}`
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};


