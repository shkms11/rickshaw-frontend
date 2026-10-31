import { api } from "@/shared/api/baseApi";

export type CreateComplaint = {
  subject: string;
  description: string;
};

export type AdminComplaint = {
  id: string;
  subject: string;
  description: string;
  status: "OPEN" | "RESOLVED";
  createdAt: string;
  user: { name: string; phone: string | null; role: string };
};

/** Shared complaint endpoints connect user report forms to the administrator inbox. */
export const complaintApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createComplaint: builder.mutation<
      { complaint: { id: string; subject: string; status: "OPEN"; createdAt: string } },
      CreateComplaint
    >({
      query: (body) => ({
        url: "/complaints",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Complaint"],
    }),
    getAdminComplaints: builder.query<{ complaints: AdminComplaint[] }, void>({
      query: () => "/complaints",
      providesTags: ["Complaint"],
    }),
    updateComplaintStatus: builder.mutation<
      { message: string },
      { complaintId: string; status: AdminComplaint["status"] }
    >({
      query: ({ complaintId, status }) => ({
        url: `/complaints/${encodeURIComponent(complaintId)}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Complaint"],
    }),
  }),
});

export const {
  useCreateComplaintMutation,
  useGetAdminComplaintsQuery,
  useUpdateComplaintStatusMutation,
} = complaintApi;
