import { api } from "@/shared/api/baseApi";

export type Rickshaw = {
    id: string;
    plateNo: string;
    model: string | null;
    status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
    createdAt?: string;
    driver?: {
        id: string;
        status: "ONLINE" | "OFFLINE" | "ON_TRIP";
        user: { name: string; phone: string | null };
    } | null;
    owner?: { user: { name: string; phone: string | null } };
};

export type OwnerDriver = {
    id: string;
    status: "ONLINE" | "OFFLINE" | "ON_TRIP";
    user: { name: string; phone: string | null };
    rickshaw: { id: string; plateNo: string } | null;
};

export const rickshawApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRickshaws: builder.query<{ rickshaws: Rickshaw[] }, void>({
            query: () => "/rickshaws",
            providesTags: ["Rickshaw"],
        }),
        createRickshaw: builder.mutation<
            { rickshaw: Rickshaw },
            { plateNo: string; model?: string }
        >({
            query: (body) => ({
                url: "/rickshaws",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Rickshaw"],
        }),
        searchOwnerDriver: builder.query<{ drivers: OwnerDriver[] }, string>({
            query: (phone) => ({
                url: "/rickshaws/drivers",
                params: { phone },
            }),
            providesTags: ["Driver"],
        }),
        assignRickshawDriver: builder.mutation<
            { message: string },
            { rickshawId: string; driverId: string | null }
        >({
            query: ({ rickshawId, driverId }) => ({
                url: `/rickshaws/${encodeURIComponent(rickshawId)}/driver`,
                method: "PATCH",
                body: { driverId },
            }),
            invalidatesTags: ["Rickshaw", "Driver", "DriverLocation"],
        }),
        updateRickshawStatus: builder.mutation<
            { message: string },
            { rickshawId: string; status: Rickshaw["status"] }
        >({
            query: ({ rickshawId, status }) => ({
                url: `/rickshaws/${encodeURIComponent(rickshawId)}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Rickshaw", "DriverLocation"],
        }),
    }),
});

export const {
    useGetRickshawsQuery,
    useCreateRickshawMutation,
    useLazySearchOwnerDriverQuery,
    useAssignRickshawDriverMutation,
    useUpdateRickshawStatusMutation,
} = rickshawApi;
