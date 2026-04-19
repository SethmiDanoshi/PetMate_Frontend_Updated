import axios from "axios";

const axiosInstanceUpload = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const createProduct = async (data) => {
    try {
        const response = await axiosInstanceUpload.post('/products', data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const fetchProductsBySeller = async (sellerId) => {
    try {
        const response = await axiosInstanceUpload.get(`/products/seller/${sellerId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }   
}