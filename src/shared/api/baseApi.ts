import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",

    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",

        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    tagTypes: [
        "Admin",
        "User",
        "Driver",
        "Trip",
        "Payment",
        "Complaint",
        "Approval",
        "DriverLocation",
        "Rickshaw",
    ],

    endpoints: () => ({}),
});
