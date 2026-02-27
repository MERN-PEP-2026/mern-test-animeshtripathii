import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

export const registerUser = (formData) => apiClient.post("/auth/register", formData);
export const loginUser = (formData) => apiClient.post("/auth/login", formData);
export const updateProfile = (profileData) => apiClient.put("/auth/profile", profileData);

export const getTasks = (queryParams) => apiClient.get("/tasks", { params: queryParams });
export const createTask = (taskData) => apiClient.post("/tasks", taskData);
export const updateTask = (taskId, taskData) => apiClient.put(`/tasks/${taskId}`, taskData);
export const deleteTask = (taskId) => apiClient.delete(`/tasks/${taskId}`);
