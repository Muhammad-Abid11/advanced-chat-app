import api from "../../config/axios";

export const getAllUsers = async () => {
    return await api.get("/api/users");
};

export const getUserById = async (id) => {
    return await api.get(`/api/users/${id}`);
};
