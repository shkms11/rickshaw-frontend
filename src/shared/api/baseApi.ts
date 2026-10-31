import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiBaseUrl } from "./apiBaseUrl";

// Feature APIs inject endpoints into this shared cache and attach the stored bearer token.
export const api = createApi({
    reducerPath: "api",

    baseQuery: fetchBaseQuery({
        baseUrl: apiBaseUrl,

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
        "FleetAction",
        "Subscription",
    ],

    endpoints: () => ({}),
});
