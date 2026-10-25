import { Navigate } from "react-router-dom";

type Role = "driver" | "owner" | "admin" | "super_admin";

type Props = {
    role: Role | Role[];
    children: React.ReactNode;
};

export default function RequireRole({ role, children }: Props) {
    const savedRole = localStorage.getItem("role") as Role | null;
    const token = localStorage.getItem("token");
    const allowedRoles = Array.isArray(role) ? role : [role];

    if (!savedRole || !token) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(savedRole)) {
        return <Navigate to="/" replace />;
    }

    // ✅ Allowed
    return <>{children}</>;
}
