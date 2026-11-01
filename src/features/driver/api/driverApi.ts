import { api } from "@/shared/api/baseApi";

export type DriverProfile = {
  id: string;
  licenseNo: string | null;
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

export type DriverActivityPeriod = "today" | "week" | "month" | "year" | "all";
export type DriverActivity = {
  period: DriverActivityPeriod;
  totalTrips: number;
  totalFare: string;
  totalDistanceKm: number;
  entries: Array<{
    id: string;
    workDate: string;
    fare: string;
    distanceKm: number;
  }>;
};

/** Loads the signed-in driver's server-owned profile for dashboard identity and assignment details. */
export const driverApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyDriverProfile: builder.query<{ driver: DriverProfile }, void>({
      query: () => "/drivers/me",
      providesTags: ["Driver", "Rickshaw"],
    }),
    getMyDriverStats: builder.query<DriverActivity, DriverActivityPeriod>({
      query: (period) => `/drivers/me/stats?period=${period}`,
      providesTags: ["Driver"],
    }),
    addMyDriverActivityEntry: builder.mutation<
      { entry: DriverActivity["entries"][number] },
      { workDate: string; fare: number; distanceKm: number }
    >({
      query: (body) => ({
        url: "/drivers/me/activity",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Driver"],
    }),
  }),
});

export const {
  useGetMyDriverProfileQuery,
  useGetMyDriverStatsQuery,
  useAddMyDriverActivityEntryMutation,
} = driverApi;
