import api from "../../config/axios";

export const loginApi = async (data) => {
    return await api.post("/api/auth/login", data);
};

export const registerApi = async (data) => {
    return await api.post("/api/auth/register", data);
};

export const getMeApi = async () => {
    return await api.get("/api/auth/me");
};


export const logoutApi = async () => {
    return await api.post("/api/auth/logout");
};
