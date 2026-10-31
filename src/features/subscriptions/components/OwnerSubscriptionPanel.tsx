import { useState } from "react";
import {
    BadgeCheck,
    CalendarClock,
    CarFront,
    Check,
    CreditCard,
    MapPinned,
    ShieldCheck,
    UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/app/hooks";
import type { OwnerSubscription } from "@/features/subscriptions/api/subscriptionApi";
import { useStartSubscriptionCheckoutMutation } from "@/features/subscriptions/api/subscriptionApi";
import { translate } from "@/shared/i18n";

type Props = {
    subscription?: OwnerSubscription;
    rickshawCount: number;
    isLoading: boolean;
    isError: boolean;
    checkoutResult: string | null;
    onRetry: () => void;
};

function getErrorMessage(error: unknown) {
    if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
    ) {
        return error.data.message;
    }
    return "Could not start payment. Please try again.";
}

/** Summarizes an owner's plan and starts hosted checkout when the API reports it is available. */
export default function OwnerSubscriptionPanel({
    subscription,
    rickshawCount,
    isLoading,
    isError,
    checkoutResult,
    onRetry,
}: Props) {
    const { lang } = useAppSelector((state) => state.ui);
    const [startCheckout, checkoutState] = useStartSubscriptionCheckoutMutation();
    const [checkoutError, setCheckoutError] = useState("");
    const pricePerRickshaw = subscription?.pricePerRickshaw ?? 100;
    const managedRickshawCount = subscription?.rickshawCount ?? rickshawCount;
    const monthlyAmount = subscription?.monthlyAmount ??
        managedRickshawCount * pricePerRickshaw;

    async function payMonthly() {
        setCheckoutError("");
        try {
            const result = await startCheckout().unwrap();
            window.location.assign(result.checkoutUrl);
        } catch (error) {
            setCheckoutError(translate(lang, getErrorMessage(error)));
        }
    }

    const benefits = [
        { icon: MapPinned, label: "Live GPS tracking for your assigned drivers" },
        { icon: CarFront, label: "Manage every rickshaw from one fleet dashboard" },
        { icon: UsersRound, label: "Assign approved drivers and see their status" },
        { icon: ShieldCheck, label: "Get fleet alerts and request admin support" },
    ];

    return (
        <Card className="overflow-hidden border-emerald-100 shadow-sm">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-5 bg-gradient-to-br from-emerald-50 via-white to-white p-5 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2">
                        <BadgeCheck className="size-5 text-emerald-700" aria-hidden="true" />
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                            {translate(lang, "Grow your fleet with less guesswork")}
                        </h2>
                        {subscription?.isTrial && subscription.active && (
                            <Badge className="border-0 bg-emerald-700 text-white">
                                {translate(lang, "7-day free trial")}
                            </Badge>
                        )}
                        {subscription?.active && !subscription.isTrial && (
                            <Badge className="border-0 bg-emerald-700 text-white">
                                {translate(lang, "Service active")}
                            </Badge>
                        )}
                        {subscription && !subscription.active && (
                            <Badge className="border-0 bg-amber-100 text-amber-900">
                                {translate(lang, "Trial ended · service continues")}
                            </Badge>
                        )}
                    </div>
                    <p className="max-w-2xl text-sm leading-6 text-slate-600">
                        {translate(lang, "Keep your vehicles and drivers organized, see the latest GPS reports, and make better day-to-day decisions from one simple dashboard.")}
                    </p>
                    {subscription?.isTrial && subscription.active && (
                        <div
                            role="status"
                            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
                        >
                            <p className="font-semibold">
                                {translate(lang, "Your free trial ends in")}{" "}
                                {subscription.daysRemaining} {translate(lang, "days")}.
                            </p>
                            <p className="mt-1 text-xs leading-5 text-amber-900">
                                {translate(
                                    lang,
                                    subscription.isDemo
                                        ? "This demo account's 7-day trial restarts after expiry. All features remain available; subscribe to support continued service."
                                        : "Subscribe before the trial ends to support continued service. All fleet features remain available after the trial.",
                                )}
                            </p>
                        </div>
                    )}
                    {subscription && !subscription.active && (
                        <div
                            role="status"
                            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
                        >
                            <p className="font-semibold">
                                {translate(lang, "Your 7-day free trial has ended.")}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-amber-900">
                                {subscription.isDemo
                                    ? translate(lang, "This seeded demo account will receive a fresh 7-day trial the next time it is opened. All demo features remain available.")
                                    : translate(lang, "All dashboard features remain available. Subscribe to support continued service.")}
                            </p>
                        </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                        {benefits.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-start gap-2.5 rounded-xl border border-emerald-100/80 bg-white/80 p-3">
                                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                                    <Icon className="size-4" aria-hidden="true" />
                                </span>
                                <span className="text-sm font-medium leading-5 text-slate-700">
                                    {translate(lang, label)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p className="flex items-center gap-2 text-xs text-slate-500">
                        <Check className="size-3.5 text-emerald-700" aria-hidden="true" />
                        {translate(lang, "Simple monthly pricing. Pay only for vehicles in your fleet.")}
                    </p>
                </div>

                <div className="flex flex-col justify-center border-t bg-white p-5 sm:p-7 lg:border-l lg:border-t-0">
                    {subscription ? (
                        <>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                <CalendarClock className="size-4 text-emerald-700" aria-hidden="true" />
                                {subscription.isTrial && subscription.active
                                    ? translate(lang, "Free trial ends")
                                    : subscription.active
                                        ? translate(lang, "Access through")
                                        : translate(lang, "Trial ended")}
                            </div>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {subscription.active
                                    ? new Date(subscription.accessEndsAt).toLocaleDateString(
                                        lang === "bn" ? "bn-BD" : "en-BD",
                                        { dateStyle: "long" },
                                    )
                                    : translate(lang, "All features remain available")}
                                {subscription.isTrial && subscription.active && (
                                    <span className="ml-2 font-normal text-slate-500">
                                        · {subscription.daysRemaining} {translate(lang, "days left")}
                                    </span>
                                )}
                            </p>

                            <div className="my-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    {translate(lang, "Monthly fleet plan")}
                                </p>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                    ৳{monthlyAmount.toLocaleString(lang === "bn" ? "bn-BD" : "en-BD")}
                                    <span className="ml-1 text-sm font-medium text-slate-500">
                                        / {translate(lang, "month")}
                                    </span>
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                                    <span>{managedRickshawCount} {translate(lang, "managed rickshaws")}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>৳{pricePerRickshaw} / {translate(lang, "rickshaw / month")}</span>
                                </div>
                            </div>

                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                <CalendarClock className="size-4 text-emerald-700" aria-hidden="true" />
                                {translate(lang, "7-day free trial")}
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                                {translate(
                                    lang,
                                    isLoading
                                        ? "Trial dates will appear when subscription details are available."
                                        : "Subscription details are currently unavailable. Your fleet and plan information remain visible.",
                                )}
                            </p>
                            <div className="my-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    {translate(lang, "Monthly fleet plan")}
                                </p>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                    ৳{monthlyAmount.toLocaleString(lang === "bn" ? "bn-BD" : "en-BD")}
                                    <span className="ml-1 text-sm font-medium text-slate-500">
                                        / {translate(lang, "month")}
                                    </span>
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                                    <span>{managedRickshawCount} {translate(lang, "managed rickshaws")}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>৳{pricePerRickshaw} / {translate(lang, "rickshaw / month")}</span>
                                </div>
                            </div>
                            {isError && (
                                <div className="flex items-center justify-between gap-3">
                                    <p role="alert" className="text-xs text-amber-800">
                                        {translate(lang, "Could not load subscription dates or checkout status.")}
                                    </p>
                                    <Button variant="outline" size="sm" onClick={onRetry}>
                                        {translate(lang, "Retry")}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                    <Button
                        className="mt-4 h-11 w-full bg-emerald-700 text-white hover:bg-emerald-800"
                        disabled={
                            checkoutState.isLoading ||
                            !subscription?.checkoutAvailable ||
                            managedRickshawCount === 0
                        }
                        onClick={() => void payMonthly()}
                    >
                        <CreditCard className="size-4" aria-hidden="true" />
                        {translate(
                            lang,
                            checkoutState.isLoading
                                ? "Connecting to secure checkout..."
                                : subscription?.checkoutAvailable
                                    ? "Subscribe to support the service"
                                    : "Checkout unavailable until payment API is configured",
                        )}
                    </Button>
                    {managedRickshawCount === 0 && (
                        <p className="mt-2 text-center text-xs text-amber-800">
                            {translate(lang, "Register a rickshaw to see your monthly price and subscribe.")}
                        </p>
                    )}
                    {!subscription?.checkoutAvailable && (
                        <p role="status" className="mt-2 text-center text-xs text-amber-800">
                            {translate(lang, "Payment checkout is optional. Plan details and fleet features remain available without payment API setup.")}
                        </p>
                    )}
                    <p className="mt-3 text-center text-xs text-slate-500">
                        {subscription?.paymentMode === "SANDBOX"
                            ? translate(lang, "SSLCommerz sandbox · Test payment only")
                            : subscription?.paymentMode === "LIVE"
                                ? translate(lang, "Secure checkout powered by SSLCommerz")
                                : translate(lang, "Payment checkout is not configured. Plan details and fleet features are still available.")}
                    </p>
                    <details className="mt-4 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                        <summary className="cursor-pointer font-medium text-slate-700">
                            {translate(lang, "Payment gateway setup (optional)")}
                        </summary>
                        <p className="mt-2 text-xs leading-5 text-slate-600">
                            {translate(lang, "You can use the dashboard, GPS map, and plan details without payment gateway credentials. Configure SSLCOMMERZ_IS_LIVE, SSLCOMMERZ_STORE_ID, and SSLCOMMERZ_STORE_PASSWORD in the backend environment when you are ready to accept payments. Keep gateway secrets on the backend only.")}
                        </p>
                    </details>
                    {checkoutError && (
                        <p role="alert" className="mt-3 text-sm text-destructive">
                            {checkoutError}
                        </p>
                    )}
                    {checkoutResult && (
                        <p
                            role={checkoutResult === "paid" ? "status" : "alert"}
                            className={`mt-3 rounded-lg p-3 text-sm ${
                                checkoutResult === "paid"
                                    ? "bg-emerald-50 text-emerald-800"
                                    : checkoutResult === "cancelled"
                                        ? "bg-amber-50 text-amber-900"
                                        : "bg-red-50 text-red-800"
                            }`}
                        >
                            {translate(
                                lang,
                                checkoutResult === "paid"
                                    ? "Payment confirmed. Your monthly service is active."
                                    : checkoutResult === "cancelled"
                                        ? "Payment was cancelled. Your trial or subscription is unchanged."
                                        : "Payment could not be confirmed. Please try checkout again.",
                            )}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
