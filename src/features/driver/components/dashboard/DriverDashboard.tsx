import { Card } from "@/components/ui/card";
import DriverGpsPanel from "@/features/tracking/components/DriverGpsPanel";
import NoticeBoard from "@/shared/components/dashboard/NoticeBoard";
import DriverIssueReport from "@/features/driver/components/dashboard/DriverIssueReport";
import LostRickshawAlert from "@/features/rickshaws/components/LostRickshawAlert";
import { useGetFleetActionsQuery } from "@/features/rickshaws/api/fleetActionApi";
import { useGetMyDriverProfileQuery } from "@/features/driver/api/driverApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

export type DriverAccount = {
    name: string;
    email: string;
    phone?: string;
    driver?: { licenseNo?: string } | null;
};

export default function DriverDashboard({ driver }: { driver: DriverAccount }) {
    const { lang } = useAppSelector((state) => state.ui);
    const profileQuery = useGetMyDriverProfileQuery(undefined, { pollingInterval: 15000 });
    const actionsQuery = useGetFleetActionsQuery(undefined, { pollingInterval: 20000 });
    const profile = profileQuery.data?.driver;
    const lostAlertOpen = actionsQuery.data?.actions.some(
        (action) =>
            action.rickshaw.id === profile?.rickshaw?.id &&
            action.type === "LOST_RICKSHAW" &&
            action.status === "OPEN",
    ) ?? false;

    return (
        <div className="space-y-5">
            <NoticeBoard audience="driver" />
            <Card className="p-5 sm:p-6">
                <p className="text-sm text-muted-foreground">
                    {translate(lang, "Signed in as driver")}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{profile?.user.name ?? driver.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {profile?.user.phone ?? driver.phone ?? driver.email}
                </p>
                {(profile?.licenseNo ?? driver.driver?.licenseNo) && (
                    <p className="mt-3 text-sm">
                        {translate(lang, "Driving license")}: {profile?.licenseNo ?? driver.driver?.licenseNo}
                    </p>
                )}
                {profileQuery.isError && (
                    <p role="alert" className="mt-3 text-sm text-destructive">
                        {translate(lang, "Could not load assigned vehicle details.")}
                    </p>
                )}
                {profile && (
                    <p className="mt-2 text-sm">
                        <span className={profile.location?.isLive ? "text-emerald-700" : "text-amber-700"}>
                            {translate(lang, profile.location?.isLive ? "GPS is live" : "GPS is not sharing")}
                        </span>
                        {profile.location && (
                            <span className="text-muted-foreground">
                                {" · "}
                                {new Date(profile.location.updatedAt).toLocaleTimeString()}
                            </span>
                        )}
                    </p>
                )}
            </Card>
            <Card className="space-y-4 p-5 sm:p-6">
                <div>
                    <h2 className="font-semibold">{translate(lang, "Assigned rickshaw")}</h2>
                    {profileQuery.isLoading ? (
                        <p className="mt-2 text-sm text-muted-foreground">{translate(lang, "Loading assigned vehicle...")}</p>
                    ) : profile?.rickshaw ? (
                        <div className="mt-2 space-y-1">
                            <p className="text-lg font-semibold">{profile.rickshaw.plateNo}</p>
                            <p className="text-sm text-muted-foreground">
                                {profile.rickshaw.model ?? translate(lang, "Model not provided")}
                                {" · "}
                                {translate(lang, profile.rickshaw.status)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {translate(lang, "Owner")}: {profile.rickshaw.owner.user.name}
                                {profile.rickshaw.owner.user.phone && ` · ${profile.rickshaw.owner.user.phone}`}
                            </p>
                        </div>
                    ) : (
                        <p className="mt-2 text-sm text-muted-foreground">
                            {translate(lang, "No rickshaw is assigned to your account. Contact your fleet owner.")}
                        </p>
                    )}
                </div>
                {profile?.rickshaw && (
                    <LostRickshawAlert
                        rickshawId={profile.rickshaw.id}
                        plateNo={profile.rickshaw.plateNo}
                        isAlertOpen={lostAlertOpen}
                    />
                )}
                {actionsQuery.isError && (
                    <p role="alert" className="text-sm text-destructive">
                        {translate(lang, "Could not load alert status.")}
                    </p>
                )}
                {lostAlertOpen && (
                    <p role="status" className="text-sm text-amber-800">
                        {translate(lang, "The owner and admin have been alerted.")}
                    </p>
                )}
            </Card>
            <DriverGpsPanel />
            <DriverIssueReport />
        </div>
    );
}
