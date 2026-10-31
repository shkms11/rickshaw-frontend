import DashboardLayout from "@/shared/components/layout/DashboardLayout";
import DriverDashboard, {
    type DriverAccount,
} from "@/features/driver/components/dashboard/DriverDashboard";

/** Reads the cached identity as a fallback; the dashboard separately loads the live driver profile. */
export default function DriverDashboardPage() {
    let driver: DriverAccount = {
        name: "Driver",
        email: "",
    };
    try {
        const user: unknown = JSON.parse(localStorage.getItem("user") ?? "null");
        if (
            typeof user === "object" &&
            user !== null &&
            "name" in user &&
            typeof user.name === "string" &&
            "email" in user &&
            typeof user.email === "string"
        ) {
            driver = {
                name: user.name,
                email: user.email,
                ...("driver" in user &&
                typeof user.driver === "object" &&
                user.driver !== null &&
                "licenseNo" in user.driver &&
                typeof user.driver.licenseNo === "string"
                    ? { driver: { licenseNo: user.driver.licenseNo } }
                    : {}),
            };
        }
    } catch {
        localStorage.removeItem("user");
    }

    return (
        <DashboardLayout title="Driver Dashboard">
            <DriverDashboard driver={driver} />
        </DashboardLayout>
    );
}
