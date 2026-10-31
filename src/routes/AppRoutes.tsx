import { Routes, Route, Navigate } from "react-router-dom";

import { AppLayout } from "@/layouts/AppLayout";
import HomePage from "@/pages/HomePage";

import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import OwnerDashboardPage from "@/pages/owner/OwnerDashboardPage";
import DriverDashboardPage from "@/pages/driver/DriverDashboardPage";

import RequireRole from "@/shared/components/RequireRole";

/** Maps public and role-specific URLs to pages, with role checks at dashboard boundaries. */
export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/admin"
                    element={
                        <RequireRole role={["admin", "super_admin"]}>
                            <AdminDashboardPage />
                        </RequireRole>
                    }
                />

                <Route
                    path="/owner"
                    element={
                        <RequireRole role="owner">
                            <OwnerDashboardPage />
                        </RequireRole>
                    }
                />

                <Route
                    path="/driver"
                    element={
                        <RequireRole role="driver">
                            <DriverDashboardPage />
                        </RequireRole>
                    }
                />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
