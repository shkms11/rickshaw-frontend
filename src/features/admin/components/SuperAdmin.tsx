import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Check,
  Ban,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Section = "dashboard" | "users" | "approvals" | "settings";

type UserRole = "Driver" | "Owner" | "Admin";

type User = {
  id: number;
  name: string;
  phone: string;
  role: UserRole;
  status: "Active" | "Pending" | "Blocked";
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "Rahim Uddin",
    phone: "017XXXXXXXX",
    role: "Driver",
    status: "Pending",
  },
  {
    id: 2,
    name: "Karim Ahmed",
    phone: "018XXXXXXXX",
    role: "Owner",
    status: "Pending",
  },
  {
    id: 3,
    name: "System Admin",
    phone: "019XXXXXXXX",
    role: "Admin",
    status: "Active",
  },
];

const navigation: {
  id: Section;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Manage Users", icon: Users },
  { id: "approvals", label: "Approvals", icon: ClipboardCheck },
  { id: "settings", label: "Settings", icon: Settings },
];

/** Legacy local mock of super-admin navigation and user review; the live dashboard is AdminDashboardPage. */
export default function SuperAdmin() {
  const [section, setSection] = useState<Section>("dashboard");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function updateStatus(id: number, status: User["status"]) {
    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, status } : user)),
    );
  }

  const pendingUsers = users.filter((user) => user.status === "Pending");

  const activeUsers = users.filter((user) => user.status === "Active");

  const displayedUsers = section === "approvals" ? pendingUsers : users;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white p-5 transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-2 text-amber-800">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h1 className="font-bold">Rickshaw Admin</h1>
              <p className="text-xs text-muted-foreground">
                Super Administrator
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="ghost"
              onClick={() => {
                setSection(id);
                setSidebarOpen(false);
              }}
              className={`w-full justify-start gap-3 ${
                section === id
                  ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                  : "text-slate-600"
              }`}
            >
              <Icon className="size-5" />
              {label}
            </Button>
          ))}
        </nav>

        <Button
          variant="outline"
          className="justify-start gap-3"
          onClick={() => {
            // Connect your logout handler here.
          }}
        >
          <LogOut className="size-5" />
          Log out
        </Button>
      </aside>

      <main className="min-w-0 md:ml-64">
        <header className="flex items-center justify-between border-b bg-white px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </Button>

            <div>
              <h2 className="text-xl font-bold">
                {navigation.find((item) => item.id === section)?.label}
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your rickshaw platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2">
            <ShieldCheck className="size-4 text-amber-700" />
            <span className="text-sm font-medium">Super Admin</span>
          </div>
        </header>

        <div className="space-y-6 p-5 sm:p-8">
          {section === "dashboard" && (
            <>
              <div>
                <h3 className="text-lg font-semibold">Platform Overview</h3>
                <p className="text-sm text-muted-foreground">
                  A quick overview of registered platform users.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  {
                    label: "Total Users",
                    value: users.length,
                    icon: Users,
                  },
                  {
                    label: "Active Users",
                    value: activeUsers.length,
                    icon: UserCheck,
                  },
                  {
                    label: "Pending Approvals",
                    value: pendingUsers.length,
                    icon: ClipboardCheck,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl border bg-white p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <Icon className="size-5 text-amber-700" />
                    </div>
                    <p className="mt-3 text-3xl font-bold">{value}</p>
                  </div>
                ))}
              </div>

              <UserTable
                users={users.slice(0, 5)}
                onApprove={(id) => updateStatus(id, "Active")}
                onBlock={(id) => updateStatus(id, "Blocked")}
              />
            </>
          )}

          {section === "users" && (
            <UserTable
              users={users}
              onApprove={(id) => updateStatus(id, "Active")}
              onBlock={(id) => updateStatus(id, "Blocked")}
            />
          )}

          {section === "approvals" && (
            <UserTable
              users={displayedUsers}
              onApprove={(id) => updateStatus(id, "Active")}
              onBlock={(id) => updateStatus(id, "Blocked")}
            />
          )}

          {section === "settings" && (
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold">Platform Settings</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add platform configuration and administrative controls here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function UserTable({
  users,
  onApprove,
  onBlock,
}: {
  users: User[];
  onApprove: (id: number) => void;
  onBlock: (id: number) => void;
}) {
  return (
    <section className="overflow-hidden rounded-xl border bg-white">
      <div className="border-b p-5">
        <h3 className="font-semibold">User Management</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Review user details and registration status.
        </p>
      </div>

      {users.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted-foreground">
          No users to display.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-5 py-4 font-medium">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">{user.phone}</td>
                  <td className="px-5 py-4">{user.role}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : user.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {user.status === "Pending" && (
                        <Button
                          size="sm"
                          className="bg-emerald-700 hover:bg-emerald-800"
                          onClick={() => onApprove(user.id)}
                          aria-label={`Approve ${user.name}`}
                        >
                          <Check className="mr-1 size-4" />
                          Approve
                        </Button>
                      )}

                      {user.status !== "Blocked" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-700 hover:bg-red-50"
                          onClick={() => onBlock(user.id)}
                          aria-label={`Block ${user.name}`}
                        >
                          <Ban className="mr-1 size-4" />
                          Block
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
