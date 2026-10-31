import { api } from "@/shared/api/baseApi";

export type AdminSearchType =
    | "All"
    | "Drivers"
    | "Owners"
    | "Rickshaws"
    | "Location"
    | "Complaints";

export type AdminSearchResult = {
    id: string;
    name: string;
    type: "driver"
    | "owner"
    | "user"
    | "rickshaw"
    | "location"
    | "payment"
    | "complaint";
    description?: string;
};

export type AdminSearchResponse = {
    results: AdminSearchResult[];
    total: number;
};

export type AdminSearchParams = {
    query: string;
    type: AdminSearchType;
};

export type AdminApproval = {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    createdAt?: string;
    user?: {
        id?: string;
        name?: string;
        email?: string;
        phone?: string;
        role?: string;
    };
};

export type AdminApprovalsResponse = {
    approvals: AdminApproval[];
};

export type AdminDashboardSummary = {
    totalRickshaws: number;
    onlineDrivers: number;
    activeTrips: number;
    openComplaints: number;
};

export type UpdateApprovalParams = {
    userId: string;
    status: "APPROVED" | "REJECTED";
};

export type AdminDriver = {
    id: string;
    status: "ONLINE" | "OFFLINE" | "ON_TRIP";
    licenseNo: string;
    user: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        role: string;
        approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
    };
    rickshaw: { id: string; plateNo: string } | null;
};

/** Admin queries/mutations shared by the admin dashboard and its review/control widgets. */
export const adminApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboardSummary: builder.query<AdminDashboardSummary, void>({
            query: () => "/admin/dashboard-summary",
        }),
        getAdminApprovals: builder.query<AdminApprovalsResponse, void>({
            query: () => ({
                url: "/admin/approvals",
                method: "GET",
            }),
            providesTags: ["Approval"],
        }),
        updateAdminApproval: builder.mutation<void, UpdateApprovalParams>({
            query: ({ userId, status }) => ({
                url: `/admin/approvals/${encodeURIComponent(userId)}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Approval"],
        }),
        searchAdmin: builder.query<AdminSearchResponse, AdminSearchParams>({
            query: ({ query, type }) => ({
                url: "/admin/search",
                method: "GET",
                params: {
                    q: query,
                    ...(type !== "All" && {
                        type: type.toLowerCase(),
                    }),
                },
            }),
        }),
        getAdminDrivers: builder.query<AdminDriver[], void>({
            query: () => "/drivers",
            providesTags: ["Driver"],
        }),
        updateAdminDriverStatus: builder.mutation<
            { message: string },
            { driverId: string; status: AdminDriver["status"] }
        >({
            query: ({ driverId, status }) => ({
                url: `/drivers/${encodeURIComponent(driverId)}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Driver", "Rickshaw", "DriverLocation"],
        }),
    }),
});

export const {
    useGetAdminDashboardSummaryQuery,
    useGetAdminApprovalsQuery,
    useUpdateAdminApprovalMutation,
    useLazySearchAdminQuery,
    useGetAdminDriversQuery,
    useUpdateAdminDriverStatusMutation,
} = adminApi;
