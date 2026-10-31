export type Role = "admin" | "owner" | "driver";

// Legacy role-only helper using a separate key; current routing uses authSession.ts and its token check.
const ROLE_KEY = "app_role";

export function setRole(role: Role) {
  localStorage.setItem(ROLE_KEY, role);
}

export function getRole(): Role | null {
  const role = localStorage.getItem(ROLE_KEY);

  if (role === "admin" || role === "owner" || role === "driver") {
    return role;
  }

  return null;
}

export function clearRole() {
  localStorage.removeItem(ROLE_KEY);
}
