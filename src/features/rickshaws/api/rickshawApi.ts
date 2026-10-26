import { api } from "@/shared/api/baseApi";

export type Rickshaw = {
    id: string;
    plateNo: string;
    model: string | null;
    status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
    createdAt?: string;
    driver?: { user: { name: string } } | null;
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
    }),
});

export const {
    useGetRickshawsQuery,
    useCreateRickshawMutation,
} = rickshawApi;
