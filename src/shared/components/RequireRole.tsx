import { Navigate } from "react-router-dom";
import { getAuthenticatedRole } from "@/shared/authSession";

type Role = "driver" | "owner" | "admin" | "super_admin";

type Props = {
    role: Role | Role[];
    children: React.ReactNode;
};

export default function RequireRole({ role, children }: Props) {
    const savedRole = getAuthenticatedRole();
    const allowedRoles = Array.isArray(role) ? role : [role];

    if (!savedRole) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(savedRole)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
