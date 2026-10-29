import { api } from "@/shared/api/baseApi";

export type FleetAction = {
  id: string;
  type: "LOST_RICKSHAW" | "REMOVE_RICKSHAW";
  status: "OPEN" | "APPROVED" | "REJECTED" | "RESOLVED";
  message: string | null;
  createdAt: string;
  rickshaw: {
    id: string;
    plateNo: string;
    owner: { user: { name: string; phone: string | null } };
  };
  createdBy: { name: string; role: string; phone: string | null };
};

export const fleetActionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFleetActions: builder.query<{ actions: FleetAction[] }, void>({
      query: () => "/fleet-actions",
      providesTags: ["FleetAction"],
    }),
    reportLostRickshaw: builder.mutation<
      { action: { id: string; status: "OPEN"; createdAt: string } },
      { rickshawId: string; message?: string }
    >({
      query: (body) => ({
        url: "/fleet-actions/lost",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FleetAction"],
    }),
    requestRickshawRemoval: builder.mutation<
      { action: { id: string; status: "OPEN"; createdAt: string } },
      { rickshawId: string; message?: string }
    >({
      query: (body) => ({
        url: "/fleet-actions/removal-request",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FleetAction"],
    }),
    reviewFleetAction: builder.mutation<
      { message: string },
      { actionId: string; status: "APPROVED" | "REJECTED" | "RESOLVED" }
    >({
      query: ({ actionId, status }) => ({
        url: `/fleet-actions/${encodeURIComponent(actionId)}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["FleetAction", "Rickshaw", "Driver", "DriverLocation"],
    }),
  }),
});

export const {
  useGetFleetActionsQuery,
  useReportLostRickshawMutation,
  useRequestRickshawRemovalMutation,
  useReviewFleetActionMutation,
} = fleetActionApi;
