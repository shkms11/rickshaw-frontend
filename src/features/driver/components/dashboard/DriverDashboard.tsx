import { Card } from "@/components/ui/card";
import DriverGpsPanel from "@/features/tracking/components/DriverGpsPanel";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

export type DriverAccount = {
    name: string;
    email: string;
    driver?: { licenseNo?: string } | null;
};

export default function DriverDashboard({ driver }: { driver: DriverAccount }) {
    const { lang } = useAppSelector((state) => state.ui);

    return (
        <div className="space-y-5">
            <Card className="p-5 sm:p-6">
                <p className="text-sm text-muted-foreground">
                    {translate(lang, "Signed in as driver")}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{driver.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{driver.email}</p>
                {driver.driver?.licenseNo && (
                    <p className="mt-3 text-sm">
                        {translate(lang, "Driving license")}: {driver.driver.licenseNo}
                    </p>
                )}
            </Card>
            <DriverGpsPanel />
        </div>
    );
}
