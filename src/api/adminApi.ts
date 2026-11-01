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

export type ManagedAccount = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: "DRIVER" | "OWNER";
    isRestricted: boolean;
    driver: {
        rickshaw: {
            id: string;
            plateNo: string;
            owner: { user: { name: string } };
        } | null;
    } | null;
};

export type AdminDashboardSummary = {
    totalRickshaws: number;
    onlineDrivers: number;
    activeTrips: number;
    openComplaints: number;
    isObserver: boolean;
};

export type AdminNoticeBoard = {
    audience: NoticeAudience;
    items: string[];
    updatedAt: string;
};

export type NoticeAudience = "admin" | "owner" | "driver" | "driver-health";

export type AdminCongestionReport = {
    area: string;
    period: string;
    matchingTripRecords: number;
    activeTripRecords: number;
    liveRickshawsWithinArea: number | null;
    lowAccuracyGpsReports: number;
    geocodedAreaAvailable: boolean;
    note: string;
    limitation: string;
    driverDirections: string;
};

export type UpdateApprovalParams = {
    userId: string;
    status: "APPROVED" | "REJECTED";
};

export type AdminDriver = {
    id: string;
    status: "ONLINE" | "OFFLINE" | "ON_TRIP";
    licenseNo: string | null;
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

export type AdminFleetListParams = {
    page: number;
    pageSize: number;
    search: string;
    status: string;
};

export type AdminFleetVehicle = {
    id: string;
    plateNo: string;
    model: string | null;
    status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
    driver: { user: { name: string; phone: string | null } } | null;
    owner: { user: { name: string } };
};

export type AdminFleetDriver = {
    id: string;
    status: "ONLINE" | "OFFLINE" | "ON_TRIP";
    user: {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
        isRestricted: boolean;
    };
    rickshaw: { plateNo: string } | null;
};

export type AdminFleetPage<T> = {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
};

export type AdminAssignableOwner = {
    id: string;
    user: { name: string; email: string | null; phone: string | null };
};

export type ManagedAdmin = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    adminAssignments: {
        ownerId: string | null;
        isObserver: boolean;
        owner: { user: { name: string } } | null;
    }[];
};

export type Announcement = {
    id: string;
    title: string;
    message: string;
    audience: "SUPER_ADMIN" | "ADMIN" | "OWNER" | "DRIVER";
    targetUserId: string | null;
    ownerId: string | null;
    createdById?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: { name: string; role: string };
};

export type NoticeRecipient = {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
};

export type CreateAnnouncementParams = {
    title: string;
    message: string;
    audience: "ADMIN" | "OWNER" | "DRIVER";
    targetUserId: string | null;
    ownerId: string | null;
};

export type CreateScopedAdminParams = {
    name: string;
    email: string;
    phone: string;
    password: string;
    ownerIds: string[];
    allOwnersObserver: boolean;
    allOwnersAdmin: boolean;
};

/** Admin queries/mutations shared by the admin dashboard and its review/control widgets. */
export const adminApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboardSummary: builder.query<AdminDashboardSummary, void>({
            query: () => "/admin/dashboard-summary",
        }),
        getAdminCongestionReport: builder.query<AdminCongestionReport, string>({
            query: (area) => ({
                url: "/admin/congestion-report",
                params: { area },
            }),
        }),
        getAdminNoticeBoard: builder.query<AdminNoticeBoard, NoticeAudience>({
            query: (audience) => `/notice-board?audience=${audience}`,
            providesTags: (_result, _error, audience) => [{ type: "NoticeBoard", id: audience }],
        }),
        updateAdminNoticeBoard: builder.mutation<AdminNoticeBoard, { audience: NoticeAudience; items: string[] }>({
            query: ({ audience, ...body }) => ({
                url: `/notice-board?audience=${audience}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { audience }) => [{ type: "NoticeBoard", id: audience }],
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
        getManagedAccounts: builder.query<{ accounts: ManagedAccount[] }, void>({
            query: () => "/admin/managed-accounts",
            providesTags: ["ManagedAccounts"],
        }),
        updateAccountRestriction: builder.mutation<
            { message: string },
            { userId: string; isRestricted: boolean }
        >({
            query: ({ userId, ...body }) => ({
                url: `/admin/managed-accounts/${encodeURIComponent(userId)}/restriction`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["ManagedAccounts", "Approval", "Driver"],
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
        getAdminFleetVehicles: builder.query<AdminFleetPage<AdminFleetVehicle>, AdminFleetListParams>({
            query: (params) => ({ url: "/admin/fleet/vehicles", params }),
            providesTags: ["Rickshaw"],
        }),
        getAdminFleetDrivers: builder.query<AdminFleetPage<AdminFleetDriver>, AdminFleetListParams>({
            query: (params) => ({ url: "/admin/fleet/drivers", params }),
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
        getAdminAssignableOwners: builder.query<{
            owners: AdminAssignableOwner[];
            administrators: ManagedAdmin[];
        }, void>({
            query: () => "/admin/owners",
            providesTags: ["Admin"],
        }),
        createScopedAdmin: builder.mutation<
            { admin: { id: string; name: string; email: string; phone: string } },
            CreateScopedAdminParams
        >({
            query: (body) => ({
                url: "/admin/administrators",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),
        updateAdminAssignments: builder.mutation<
            { message: string },
            { adminId: string; ownerIds: string[]; allOwnersObserver: boolean; allOwnersAdmin: boolean }
        >({
            query: ({ adminId, ...body }) => ({
                url: `/admin/administrators/${encodeURIComponent(adminId)}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),
        getAnnouncements: builder.query<{ announcements: Announcement[] }, void>({
            query: () => "/announcements",
            providesTags: ["Announcement"],
        }),
        getManagedAnnouncements: builder.query<{
            announcements: (Announcement & { createdById: string })[];
        }, void>({
            query: () => "/admin/announcements",
            providesTags: ["Announcement"],
        }),
        getNoticeRecipients: builder.query<
            { recipients: NoticeRecipient[] },
            { role: "ADMIN" | "OWNER" | "DRIVER"; ownerId?: string }
        >({
            query: ({ role, ownerId }) => ({
                url: "/admin/notice-recipients",
                params: { role, ...(ownerId ? { ownerId } : {}) },
            }),
        }),
        getNoticeOwners: builder.query<{ owners: AdminAssignableOwner[] }, void>({
            query: () => "/admin/notice-owners",
        }),
        publishAnnouncement: builder.mutation<
            { message: string },
            CreateAnnouncementParams
        >({
            query: (body) => ({ url: "/admin/announcements", method: "POST", body }),
            invalidatesTags: ["Announcement"],
        }),
        updateAnnouncement: builder.mutation<
            { message: string },
            CreateAnnouncementParams & { announcementId: string }
        >({
            query: ({ announcementId, ...body }) => ({
                url: `/admin/announcements/${encodeURIComponent(announcementId)}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Announcement"],
        }),
        removeAnnouncement: builder.mutation<
            { message: string },
            string
        >({
            query: (announcementId) => ({
                url: `/admin/announcements/${encodeURIComponent(announcementId)}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Announcement"],
        }),
    }),
});

export const {
    useGetAdminDashboardSummaryQuery,
    useLazyGetAdminCongestionReportQuery,
    useGetAdminNoticeBoardQuery,
    useUpdateAdminNoticeBoardMutation,
    useGetAdminApprovalsQuery,
    useUpdateAdminApprovalMutation,
    useGetManagedAccountsQuery,
    useUpdateAccountRestrictionMutation,
    useLazySearchAdminQuery,
    useGetAdminFleetVehiclesQuery,
    useGetAdminFleetDriversQuery,
    useUpdateAdminDriverStatusMutation,
    useGetAdminAssignableOwnersQuery,
    useCreateScopedAdminMutation,
    useUpdateAdminAssignmentsMutation,
    useGetAnnouncementsQuery,
    useGetManagedAnnouncementsQuery,
    useGetNoticeRecipientsQuery,
    useGetNoticeOwnersQuery,
    usePublishAnnouncementMutation,
    useUpdateAnnouncementMutation,
    useRemoveAnnouncementMutation,
} = adminApi;
