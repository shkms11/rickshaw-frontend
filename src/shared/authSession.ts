export type AuthRole = "driver" | "owner" | "admin" | "super_admin";

/** Reads the browser session and rejects expired/malformed tokens before choosing a route. */
export function getAuthenticatedRole(): AuthRole | null {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || !role) return null;

    try {
        const payload = token.split(".")[1];
        if (!payload) throw new Error("Invalid token");
        const claims: unknown = JSON.parse(
            atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
        );
        if (
            typeof claims !== "object" ||
            claims === null ||
            !("exp" in claims) ||
            typeof claims.exp !== "number" ||
            claims.exp * 1000 <= Date.now() ||
            !["driver", "owner", "admin", "super_admin"].includes(role)
        ) {
            throw new Error("Invalid or expired session");
        }
        return role as AuthRole;
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        return null;
    }
}
