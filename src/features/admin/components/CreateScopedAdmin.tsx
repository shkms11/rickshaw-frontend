import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateScopedAdminMutation,
  useGetAdminAssignableOwnersQuery,
  useUpdateAdminAssignmentsMutation,
  type AdminAssignableOwner,
  type ManagedAdmin,
} from "@/api/adminApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }
  return "Could not create the administrator.";
}

export default function CreateScopedAdmin() {
  const { lang } = useAppSelector((state) => state.ui);
  const { data, isLoading, isError } = useGetAdminAssignableOwnersQuery();
  const [createAdmin, { isLoading: isSaving }] = useCreateScopedAdminMutation();
  const [updateAssignments, { isLoading: isUpdating }] = useUpdateAdminAssignmentsMutation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    ownerIds: [] as string[],
    allOwnersObserver: false,
    allOwnersAdmin: false,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const owners = data?.owners ?? [];
  const administrators = data?.administrators ?? [];

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleOwner(ownerId: string) {
    setForm((current) => ({
      ...current,
      allOwnersObserver: false,
      allOwnersAdmin: false,
      ownerIds: current.ownerIds.includes(ownerId)
        ? current.ownerIds.filter((id) => id !== ownerId)
        : [...current.ownerIds, ownerId],
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await createAdmin(form).unwrap();
      setForm({ name: "", email: "", phone: "", password: "", ownerIds: [], allOwnersObserver: false, allOwnersAdmin: false });
      setMessage(translate(lang, "Admin account created."));
    } catch (requestError) {
      setError(translate(lang, getErrorMessage(requestError)));
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="font-semibold">{translate(lang, "Admin access")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {translate(lang, "Create an admin, review access, and send updates to the right people.")}
        </p>
      </div>
      {isError ? (
        <p role="alert" className="text-sm text-destructive">{translate(lang, "Could not load approved owners.")}</p>
      ) : (
        <form onSubmit={(event) => void submit(event)} className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="scoped-admin-name">{translate(lang, "Full name")}</Label>
            <Input id="scoped-admin-name" required value={form.name} onChange={(event) => update("name", event.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="scoped-admin-email">{translate(lang, "Email")}</Label>
            <Input id="scoped-admin-email" type="email" required value={form.email} onChange={(event) => update("email", event.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="scoped-admin-phone">{translate(lang, "Bangladesh phone")}</Label>
            <Input id="scoped-admin-phone" type="tel" required placeholder="+8801712345678" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="scoped-admin-password">{translate(lang, import.meta.env.PROD ? "Temporary password (12+ characters)" : "Temporary password (4+ characters)")}</Label>
            <Input id="scoped-admin-password" type="password" autoComplete="new-password" minLength={import.meta.env.PROD ? 12 : 4} required value={form.password} onChange={(event) => update("password", event.target.value)} />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label>{translate(lang, "Owner access")}</Label>
            <label className="flex items-start gap-2 rounded-lg border p-3 text-sm">
              <input
                type="checkbox"
                checked={form.allOwnersAdmin}
                onChange={(event) => setForm((current) => ({
                  ...current,
                  allOwnersAdmin: event.target.checked,
                  allOwnersObserver: false,
                  ownerIds: [],
                }))}
                className="mt-1"
              />
              <span>
                <span className="font-medium">{translate(lang, "Admin for all owners")}</span>
                <span className="block text-xs text-muted-foreground">
                  {translate(lang, "Can manage all owners, vehicles, drivers, and notices.")}
                </span>
              </span>
            </label>
            <label className="flex items-start gap-2 rounded-lg border p-3 text-sm">
              <input
                type="checkbox"
                checked={form.allOwnersObserver}
                onChange={(event) => setForm((current) => ({
                  ...current,
                  allOwnersObserver: event.target.checked,
                  allOwnersAdmin: false,
                  ownerIds: [],
                }))}
                className="mt-1"
              />
              <span>
                <span className="font-medium">{translate(lang, "All owners — observer only")}</span>
                <span className="block text-xs text-muted-foreground">
                  {translate(lang, "Can view platform data, but cannot make changes.")}
                </span>
              </span>
            </label>
            {!form.allOwnersObserver && !form.allOwnersAdmin && (
              <div className="grid max-h-40 gap-2 overflow-auto rounded-lg border p-3 sm:grid-cols-2">
                {owners.map((owner) => (
                  <label key={owner.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.ownerIds.includes(owner.id)}
                      onChange={() => toggleOwner(owner.id)}
                    />
                    <span>{owner.user.name}{owner.user.phone ? ` · ${owner.user.phone}` : ""}</span>
                  </label>
                ))}
                {!owners.length && !isLoading && (
                  <p className="text-sm text-muted-foreground">{translate(lang, "No approved owners found.")}</p>
                )}
              </div>
            )}
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={isSaving || isLoading || (!form.allOwnersObserver && !form.allOwnersAdmin && !form.ownerIds.length)}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              {translate(lang, isSaving ? "Creating..." : "Create admin")}
            </Button>
            {message && <p role="status" className="mt-3 text-sm text-emerald-700">{message}</p>}
            {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
          </div>
        </form>
      )}
      {!isError && (
        <div className="mt-6 border-t pt-5">
          <h3 className="mb-3 text-sm font-semibold">{translate(lang, "Current admins")}</h3>
          <div className="space-y-3">
            {administrators.map((admin) => (
              <AdminAccessRow
                key={admin.id}
                admin={admin}
                owners={owners}
                updateAssignments={updateAssignments}
                isUpdating={isUpdating}
              />
            ))}
            {!administrators.length && !isLoading && (
              <p className="text-sm text-muted-foreground">{translate(lang, "No delegated admins yet.")}</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

function AdminAccessRow({
  admin,
  owners,
  updateAssignments,
  isUpdating,
}: {
  admin: ManagedAdmin;
  owners: AdminAssignableOwner[];
  updateAssignments: ReturnType<typeof useUpdateAdminAssignmentsMutation>[0];
  isUpdating: boolean;
}) {
  const { lang } = useAppSelector((state) => state.ui);
  const isObserver = admin.adminAssignments.some((assignment) => assignment.isObserver);
  const isAllOwnersAdmin = admin.adminAssignments.some(
    (assignment) => assignment.ownerId === null && !assignment.isObserver,
  );
  const [observer, setObserver] = useState(isObserver);
  const [allOwnersAdmin, setAllOwnersAdmin] = useState(isAllOwnersAdmin);
  const [ownerIds, setOwnerIds] = useState(() =>
    admin.adminAssignments.flatMap((assignment) =>
      assignment.ownerId ? [assignment.ownerId] : [],
    ),
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function toggle(ownerId: string) {
    setObserver(false);
    setAllOwnersAdmin(false);
    setOwnerIds((current) => current.includes(ownerId)
      ? current.filter((id) => id !== ownerId)
      : [...current, ownerId]);
  }

  async function save() {
    setError("");
    setMessage("");
    try {
      await updateAssignments({
        adminId: admin.id,
        ownerIds: observer || allOwnersAdmin ? [] : ownerIds,
        allOwnersObserver: observer,
        allOwnersAdmin,
      }).unwrap();
      setMessage(translate(lang, "Access updated."));
    } catch (requestError) {
      setError(translate(lang, getErrorMessage(requestError)));
    }
  }

  return (
    <div className="rounded-lg border p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium">{admin.name}</p>
          <p className="text-xs text-muted-foreground">{admin.email ?? admin.phone ?? ""}</p>
        </div>
        <Button type="button" size="sm" variant="outline" disabled={isUpdating} onClick={() => void save()}>
          {translate(lang, isUpdating ? "Saving..." : "Save access")}
        </Button>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={observer}
          onChange={(event) => {
            setObserver(event.target.checked);
            if (event.target.checked) setOwnerIds([]);
          }}
        />
        {translate(lang, "All owners — observer only")}
      </label>
      <label className="mt-2 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={allOwnersAdmin}
          onChange={(event) => {
            setAllOwnersAdmin(event.target.checked);
            if (event.target.checked) {
              setObserver(false);
              setOwnerIds([]);
            }
          }}
        />
        {translate(lang, "Admin for all owners")}
      </label>
      {!observer && !allOwnersAdmin && (
        <div className="mt-2 grid max-h-32 gap-2 overflow-auto rounded border p-2 sm:grid-cols-2">
          {owners.map((owner) => (
            <label key={owner.id} className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={ownerIds.includes(owner.id)} onChange={() => toggle(owner.id)} />
              {owner.user.name}
            </label>
          ))}
        </div>
      )}
      {message && <p role="status" className="mt-2 text-xs text-emerald-700">{message}</p>}
      {error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
