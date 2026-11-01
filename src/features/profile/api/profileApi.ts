import { api } from "@/shared/api/baseApi";

export type UserProfile = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  profile: {
    nid: string | null;
    dateOfBirth: string | null;
    division: string | null;
    district: string | null;
    upazila: string | null;
    unionWard: string | null;
    villageRoad: string | null;
    postalCode: string | null;
    photoUrl: string | null;
  } | null;
  driver: { licenseNo: string | null } | null;
};

export type UpdateProfile = {
  name: string;
  phone: string;
  email: string;
  nid: string;
  dateOfBirth: string;
  division: string;
  district: string;
  upazila: string;
  unionWard: string;
  villageRoad: string;
  postalCode: string;
  photoUrl: string;
  licenseNo?: string;
};

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<{ profile: UserProfile }, void>({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),
    updateMyProfile: builder.mutation<{ message: string }, UpdateProfile>({
      query: (body) => ({
        url: "/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useGetMyProfileQuery, useUpdateMyProfileMutation } = profileApi;
