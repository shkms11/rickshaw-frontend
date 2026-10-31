import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/shared/components/layout/DashboardLayout";
import FleetLocationMap from "@/features/tracking/components/FleetLocationMap";
import RickshawRegistrationForm from "@/features/rickshaws/components/RickshawRegistrationForm";
import RickshawFleetManager from "@/features/rickshaws/components/RickshawFleetManager";
import OwnerIssueReport from "@/features/owner/components/dashboard/OwnerIssueReport";
import { useGetRickshawsQuery } from "@/features/rickshaws/api/rickshawApi";
import { useGetDriverLocationsQuery } from "@/features/tracking/api/locationApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";
import NoticeBoard from "@/shared/components/dashboard/NoticeBoard";
import OwnerSubscriptionPanel from "@/features/subscriptions/components/OwnerSubscriptionPanel";
import { useGetOwnerSubscriptionQuery } from "@/features/subscriptions/api/subscriptionApi";

/** Presents an owner's subscription, fleet records, assignments, locations, and reports. */
export default function OwnerDashboardPage() {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const checkoutResult = searchParams.get("subscription");
  const { lang } = useAppSelector((state) => state.ui);
  const { data, isLoading } = useGetRickshawsQuery();
  const {
    data: subscription,
    isLoading: isSubscriptionLoading,
    isError: isSubscriptionError,
    refetch: refetchSubscription,
  } = useGetOwnerSubscriptionQuery();
  const { data: locations } = useGetDriverLocationsQuery(undefined, {
    pollingInterval: 15000,
  });
  const fleet = data?.rickshaws ?? [];

  useEffect(() => {
    // Payment providers return to this page with a result flag; refresh the server-owned plan.
    if (checkoutResult === "paid") void refetchSubscription();
  }, [checkoutResult, refetchSubscription]);

  return (
    <DashboardLayout title="Fleet Owner Dashboard">
      <div className="space-y-5">
        <NoticeBoard audience="owner" />
        <OwnerSubscriptionPanel
          subscription={subscription}
          rickshawCount={fleet.filter((item) => item.status !== "INACTIVE").length}
          isLoading={isSubscriptionLoading}
          isError={isSubscriptionError}
          checkoutResult={checkoutResult}
          onRetry={() => void refetchSubscription()}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">{translate(lang, "Registered rickshaws")}</p>
            <p className="mt-2 text-3xl font-semibold">{isLoading ? "…" : fleet.length}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">{translate(lang, "Active vehicles")}</p>
            <p className="mt-2 text-3xl font-semibold">
              {isLoading ? "…" : fleet.filter((item) => item.status === "ACTIVE").length}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">{translate(lang, "Drivers sharing GPS")}</p>
            <p className="mt-2 text-3xl font-semibold">
              {locations?.locations.filter((location) => location.isLive).length ?? "…"}
            </p>
            <p className="text-xs text-muted-foreground">
              {translate(lang, "See the live map below")}
            </p>
          </Card>
        </div>

        <RickshawRegistrationForm />
        <RickshawFleetManager onViewDriverLocation={setSelectedDriverId} />
        <FleetLocationMap selectedDriverId={selectedDriverId} />
        <OwnerIssueReport />
      </div>
    </DashboardLayout>
  );
}
