import { useState } from "react";
import DashboardLayout from "@/shared/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import AdminApprovals from "@/features/admin/components/AdminApprovals";
import AdminSearchBar, {
    type SearchType,
} from "@/features/admin/components/AdminSearchBar";
import SearchResults from "@/features/admin/components/SearchResults";
import FleetLocationMap from "@/features/tracking/components/FleetLocationMap";
import {
    useGetAdminDashboardSummaryQuery,
    useLazySearchAdminQuery,
} from "@/api/adminApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";
import NoticeBoard from "@/shared/components/dashboard/NoticeBoard";
import AdminFleetActions from "@/features/admin/components/AdminFleetActions";
import AdminFleetControls from "@/features/admin/components/AdminFleetControls";
import AdminComplaintInbox from "@/features/admin/components/AdminComplaintInbox";

export default function AdminDashboardPage() {
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const [searchAdmin, { data, isFetching, error }] = useLazySearchAdminQuery();
    const {
        data: summary,
        isLoading: isSummaryLoading,
        isError: isSummaryError,
    } = useGetAdminDashboardSummaryQuery();
    const { lang } = useAppSelector((state) => state.ui);

    function handleSearch(query: string, type: SearchType) {
        void searchAdmin({ query, type });
    }

    return (
        <DashboardLayout
            title={
                localStorage.getItem("role") === "super_admin"
                    ? "Super Admin Control Center"
                    : "Admin Control Center"
            }
        >
            <div className="space-y-5">
                <NoticeBoard audience="admin" />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {(
                        [
                            ["Total Rickshaws", summary?.totalRickshaws],
                            ["Online Drivers", summary?.onlineDrivers],
                            ["Active Trips", summary?.activeTrips],
                            ["Open Complaints", summary?.openComplaints],
                        ] as const
                    ).map(([label, value]) => (
                        <Card key={label} className="p-5">
                            <p className="text-sm text-muted-foreground">{translate(lang, label)}</p>
                            {isSummaryError ? (
                                <p className="mt-2 text-sm text-destructive">{translate(lang, "Unavailable")}</p>
                            ) : (
                                <p className="mt-2 text-3xl font-semibold">
                                    {isSummaryLoading ? "…" : value ?? 0}
                                </p>
                            )}
                        </Card>
                    ))}
                </div>

                <AdminApprovals />
                <AdminFleetActions />
                <AdminFleetControls />
                <AdminComplaintInbox />
                <Card className="space-y-4 p-5 sm:p-6">
                    <AdminSearchBar onSearch={handleSearch} />
                    <SearchResults
                        results={data?.results ?? []}
                        hasSearched={isFetching || !!data || !!error}
                        isLoading={isFetching}
                        error={Boolean(error)}
                        onViewDriverLocation={setSelectedDriverId}
                    />
                </Card>
                <FleetLocationMap selectedDriverId={selectedDriverId} />
            </div>
        </DashboardLayout>
    );
}
