import axios from "axios";

// Create instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
});

// 🔐 Request Interceptor (Attach Token)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 🚨 Response Interceptor (handle unauthorized) 
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            // Token expired / invalid
            localStorage.removeItem("token");

            // redirect to login
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;