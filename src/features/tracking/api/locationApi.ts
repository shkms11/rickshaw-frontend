import { api } from "@/shared/api/baseApi";

export type DriverLocation = {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    updatedAt: string;
    source: "LIVE" | "LAST_KNOWN" | "DEMO";
    isLive: boolean;
    driverName: string;
    rickshawPlate: string | null;
};

export const locationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDriverLocations: builder.query<{ locations: DriverLocation[] }, void>({
            query: () => "/drivers/locations",
            providesTags: ["DriverLocation"],
        }),
        saveMyLocation: builder.mutation<
            {
                location: Pick<
                    DriverLocation,
                    "latitude" | "longitude" | "accuracy" | "updatedAt"
                >;
            },
            Pick<DriverLocation, "latitude" | "longitude" | "accuracy">
        >({
            query: (body) => ({
                url: "/drivers/me/location",
                method: "POST",
                body,
            }),
            invalidatesTags: ["DriverLocation"],
        }),
        stopMyLocation: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/drivers/me/location",
                method: "DELETE",
            }),
            invalidatesTags: ["DriverLocation"],
        }),
    }),
});

export const {
    useGetDriverLocationsQuery,
    useSaveMyLocationMutation,
    useStopMyLocationMutation,
} = locationApi;
