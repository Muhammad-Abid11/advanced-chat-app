import axios from "axios";

// Create instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    withCredentials: true, // Required for cookies, attach cookie to the request, if you are not mention this line, then you will need to attach cookie with every requests manually by using `withCredentials: true` in every request
});

// Request interceptor not needed for cookies as they are sent automatically "withCredentials: true,"
/*
// 🔐 Request Interceptor (Attach Token)
api.interceptors.request.use(
    (config) => {

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);
*/

// 🚨 Response Interceptor (handle unauthorized & refresh token) 
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;

        // If error is 401 and not already retried
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh endpoint
                await api.post("/api/auth/refresh");
                
                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login
                if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;