const defaultApiBaseUrl = "http://localhost:5000/api";

export const apiBaseUrl = (
    import.meta.env.VITE_API_URL || defaultApiBaseUrl
).replace(/\/+$/, "");
