import { api } from "@/shared/api/baseApi";

export type DriverProfile = {
  id: string;
  licenseNo: string;
  status: "ONLINE" | "OFFLINE" | "ON_TRIP";
  user: { name: string; phone: string | null };
  location: {
    source: "LIVE" | "LAST_KNOWN" | "DEMO";
    updatedAt: string;
    isLive: boolean;
  } | null;
  rickshaw: {
    id: string;
    plateNo: string;
    model: string | null;
    status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
    owner: { user: { name: string; phone: string | null } };
  } | null;
};

/** Loads the signed-in driver's server-owned profile for dashboard identity and assignment details. */
export const driverApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyDriverProfile: builder.query<{ driver: DriverProfile }, void>({
      query: () => "/drivers/me",
      providesTags: ["Driver", "Rickshaw"],
    }),
  }),
});

export const { useGetMyDriverProfileQuery } = driverApi;
