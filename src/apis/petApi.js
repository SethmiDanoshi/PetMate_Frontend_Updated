import axios from "axios";
import axiosInstance from "./axios";

const axiosInstanceUpload = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const createPet = async (data) => {
    try {
        const response = await axiosInstanceUpload.post('/pets/create', data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getAllPets = async () => {
    try {
        const response = await axiosInstance.get("/pets");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getPetsBySellerId = async (id) => {
    try {
        const response = await axiosInstance.get(`/pets/seller/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export const getPetsByPetId = async (id) => {
    try {
        const response = await axiosInstance.get(`/pets/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}
