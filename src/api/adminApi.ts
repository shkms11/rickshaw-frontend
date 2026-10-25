import { api } from "@/shared/api/baseApi";

export type AdminSearchType =
    | "All"
    | "Users"
    | "Drivers"
    | "Trips"
    | "Payments"
    | "Complaints";

export type AdminSearchResult = {
    id: string;
    name: string;
    type: "user" | "driver" | "trip" | "payment" | "complaint";
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
    userId: string;
    name?: string;
    email?: string;
    role?: string;
    createdAt?: string;
    user?: {
        id?: string;
        name?: string;
        email?: string;
        role?: string;
    };
};

export type AdminApprovalsResponse = {
    approvals: AdminApproval[];
};

export type UpdateApprovalParams = {
    userId: string;
    status: "APPROVED" | "REJECTED";
};

export const adminApi = api.injectEndpoints({
    endpoints: (builder) => ({
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
    }),
});

export const {
    useGetAdminApprovalsQuery,
    useUpdateAdminApprovalMutation,
    useLazySearchAdminQuery,
} = adminApi;
