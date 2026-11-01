import { api } from "@/shared/api/baseApi";

export type OwnerIncomePeriod = "today" | "week" | "month" | "year" | "all";
export type OwnerRentalIncome = {
    period: OwnerIncomePeriod;
    totalRentalIncome: string;
    rentalDays: number;
    byRickshaw: Array<{
        rickshawId: string;
        plateNo: string;
        total: string;
        rentalDays: number;
    }>;
    entries: Array<{
        id: string;
        workDate: string;
        amount: string;
        plateNo: string;
    }>;
};

export const ownerIncomeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getOwnerRentalIncome: builder.query<OwnerRentalIncome, OwnerIncomePeriod>({
            query: (period) => `/owners/rental-income?period=${period}`,
            providesTags: ["OwnerRentalIncome"],
        }),
        addOwnerRentalIncome: builder.mutation<
            { entry: OwnerRentalIncome["entries"][number] },
            { rickshawId: string; workDate: string; amount: number }
        >({
            query: (body) => ({
                url: "/owners/rental-income",
                method: "POST",
                body,
            }),
            invalidatesTags: ["OwnerRentalIncome"],
        }),
    }),
});

export const {
    useGetOwnerRentalIncomeQuery,
    useAddOwnerRentalIncomeMutation,
} = ownerIncomeApi;
