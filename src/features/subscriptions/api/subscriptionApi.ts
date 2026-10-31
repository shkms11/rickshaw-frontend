import { api } from "@/shared/api/baseApi";

export type OwnerSubscription = {
    active: boolean;
    isTrial: boolean;
    trialEndsAt: string;
    paidUntil: string | null;
    accessEndsAt: string;
    daysRemaining: number;
    rickshawCount: number;
    pricePerRickshaw: number;
    monthlyAmount: number;
    isDemo: boolean;
    checkoutAvailable: boolean;
    currency: "BDT";
    paymentMode: "LIVE" | "SANDBOX" | "UNAVAILABLE";
};

/** Retrieves owner plan status and starts hosted checkout when payment is configured. */
export const subscriptionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getOwnerSubscription: builder.query<OwnerSubscription, void>({
            query: () => "/subscriptions",
            providesTags: ["Subscription"],
        }),
        startSubscriptionCheckout: builder.mutation<
            { checkoutUrl: string },
            void
        >({
            query: () => ({
                url: "/subscriptions/checkout",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetOwnerSubscriptionQuery,
    useStartSubscriptionCheckoutMutation,
} = subscriptionApi;
