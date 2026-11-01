import { useEffect, useState } from "react";
import { Ban, CheckCircle2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/app/hooks";
import {
  useGetManagedAccountsQuery,
  useGetAdminFleetDriversQuery,
  useGetAdminFleetVehiclesQuery,
  useUpdateAccountRestrictionMutation,
  useUpdateAdminDriverStatusMutation,
} from "@/api/adminApi";
import type { AdminFleetDriver, AdminFleetVehicle, AdminFleetListParams, ManagedAccount } from "@/api/adminApi";
import {
  useUpdateRickshawStatusMutation,
  type Rickshaw,
} from "@/features/rickshaws/api/rickshawApi";
import { translate } from "@/shared/i18n";

const pageSize = 20;
const vehicleStatuses: Rickshaw["status"][] = ["ACTIVE", "INACTIVE", "MAINTENANCE"];
const driverStatuses = ["ONLINE", "OFFLINE", "ON_TRIP"] as const;
type FleetTab = "vehicles" | "drivers" | "owners";

function getErrorMessage(error: unknown, fallback: string) {
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
  return fallback;
}

function isRickshawStatus(value: string): value is Rickshaw["status"] {
  return vehicleStatuses.some((status) => status === value);
}

function isDriverStatus(value: string): value is (typeof driverStatuses)[number] {
  return driverStatuses.some((status) => status === value);
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
    ONLINE: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
    OFFLINE: "bg-slate-100 text-slate-700 ring-slate-500/20",
    INACTIVE: "bg-slate-100 text-slate-700 ring-slate-500/20",
    ON_TRIP: "bg-sky-50 text-sky-800 ring-sky-600/20",
    MAINTENANCE: "bg-amber-50 text-amber-800 ring-amber-600/20",
    Restricted: "bg-red-100 text-red-800 ring-red-600/20",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status] ?? styles.OFFLINE}`}>
      {translate(useAppSelector((state) => state.ui).lang, status)}
    </span>
  );
}

/** Searchable, server-paginated fleet controls; loads only the active tab and page. */
export default function AdminFleetControls({ canRestrictAccounts = true }: { canRestrictAccounts?: boolean }) {
  const { lang } = useAppSelector((state) => state.ui);
  const [tab, setTab] = useState<FleetTab>("vehicles");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const queryParams: AdminFleetListParams = {
    page,
    pageSize,
    search: appliedSearch,
    status: statusFilter,
  };
  const vehicleQuery = useGetAdminFleetVehiclesQuery(queryParams, {
    skip: tab !== "vehicles",
    pollingInterval: tab === "vehicles" ? 30000 : 0,
  });
  const driverQuery = useGetAdminFleetDriversQuery(queryParams, {
    skip: tab !== "drivers",
    pollingInterval: tab === "drivers" ? 30000 : 0,
  });
  const accountsQuery = useGetManagedAccountsQuery(undefined, {
    skip: tab !== "owners",
    pollingInterval: tab === "owners" ? 30000 : 0,
  });
  const [updateVehicle] = useUpdateRickshawStatusMutation();
  const [updateDriver] = useUpdateAdminDriverStatusMutation();
  const [updateRestriction] = useUpdateAccountRestrictionMutation();
  const isVehicleTab = tab === "vehicles";
  const isDriverTab = tab === "drivers";
  const owners = (accountsQuery.currentData?.accounts ?? []).filter((account) => {
    if (account.role !== "OWNER") return false;
    const matchesSearch = !appliedSearch || [account.name, account.phone, account.email]
      .filter(Boolean)
      .some((value) => value!.toLocaleLowerCase().includes(appliedSearch.toLocaleLowerCase()));
    const matchesStatus = !statusFilter ||
      (statusFilter === "RESTRICTED" ? account.isRestricted : !account.isRestricted);
    return matchesSearch && matchesStatus;
  });
  const total = isVehicleTab
    ? vehicleQuery.currentData?.total ?? 0
    : isDriverTab ? driverQuery.currentData?.total ?? 0 : owners.length;
  const isLoading = isVehicleTab
    ? vehicleQuery.isLoading
    : isDriverTab ? driverQuery.isLoading : accountsQuery.isLoading;
  const isFetching = isVehicleTab
    ? vehicleQuery.isFetching
    : isDriverTab ? driverQuery.isFetching : accountsQuery.isFetching;
  const isError = isVehicleTab
    ? vehicleQuery.isError
    : isDriverTab ? driverQuery.isError : accountsQuery.isError;
  const vehicles = vehicleQuery.currentData?.items ?? [];
  const drivers = driverQuery.currentData?.items ?? [];
  const pageOwners = owners.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  useEffect(() => {
    const timer = window.setTimeout(() => setAppliedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  async function setVehicleStatus(vehicle: AdminFleetVehicle, status: Rickshaw["status"]) {
    setMessage("");
    setUpdatingId(vehicle.id);
    try {
      await updateVehicle({ rickshawId: vehicle.id, status }).unwrap();
      setMessage(translate(lang, "Vehicle status updated."));
    } catch (error) {
      setMessage(translate(lang, getErrorMessage(error, "Could not update vehicle status.")));
    } finally {
      setUpdatingId(null);
    }
  }

  async function setDriverStatus(driver: AdminFleetDriver, status: AdminFleetDriver["status"]) {
    setMessage("");
    setUpdatingId(driver.id);
    try {
      await updateDriver({ driverId: driver.id, status }).unwrap();
      setMessage(translate(lang, "Driver status updated."));
    } catch (error) {
      setMessage(translate(lang, getErrorMessage(error, "Could not update driver status.")));
    } finally {
      setUpdatingId(null);
    }
  }

  async function setAccountRestriction(account: Pick<ManagedAccount, "id" | "isRestricted"> | AdminFleetDriver["user"]) {
    setMessage("");
    setUpdatingId(account.id);
    try {
      await updateRestriction({
        userId: account.id,
        isRestricted: !account.isRestricted,
      }).unwrap();
      setMessage(translate(lang, account.isRestricted ? "Account access restored." : "Account restricted."));
    } catch (error) {
      setMessage(translate(lang, getErrorMessage(error, "Could not update account access. Please try again.")));
    } finally {
      setUpdatingId(null);
    }
  }

  function changeTab(nextTab: FleetTab) {
    setTab(nextTab);
    setSearch("");
    setAppliedSearch("");
    setStatusFilter("");
    setPage(1);
    setMessage("");
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b p-5 sm:p-6">
        <h2 className="font-semibold">{translate(lang, "Admin fleet controls")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {translate(lang, "Manage driver availability, account access, and vehicle service status.")}
        </p>
        <div className="mt-4 flex gap-2" role="tablist" aria-label={translate(lang, "Fleet records")}>
          {(["vehicles", "drivers", "owners"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              variant={tab === value ? "default" : "outline"}
              className={tab === value ? "bg-emerald-700 text-white hover:bg-emerald-800" : ""}
              onClick={() => changeTab(value)}
            >
              {translate(lang, value === "vehicles" ? "Rickshaws" : value === "drivers" ? "Drivers" : "Owners")}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid items-end gap-3 border-b bg-muted/20 p-4 sm:grid-cols-[minmax(0,1fr)_200px] sm:p-5">
        <label className="grid min-w-0 gap-1">
          <span className="text-xs font-medium text-muted-foreground">{translate(lang, "Search fleet records")}</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder={translate(lang, isVehicleTab ? "Search plate, owner, or driver" : isDriverTab ? "Search driver, phone, or plate" : "Search owner, phone, or email")}
            className="h-10 pl-9"
          />
          </span>
        </label>
        <label className="grid min-w-0 gap-1">
          <span className="text-xs font-medium text-muted-foreground">{translate(lang, "Filter by status")}</span>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">{translate(lang, "All statuses")}</option>
            {(isVehicleTab
              ? vehicleStatuses
              : isDriverTab
                ? driverStatuses
                : ["ACTIVE", "RESTRICTED"]).map((status) => (
              <option key={status} value={status}>{translate(lang, status)}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="min-h-48">
        {isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">{translate(lang, tab === "owners" ? "Loading accounts..." : "Loading fleet controls...")}</p>
        ) : isError ? (
          <p role="alert" className="p-5 text-sm text-destructive">
            {translate(lang, tab === "owners" ? "Could not load owner accounts." : "Could not load fleet controls.")}
          </p>
        ) : isVehicleTab ? (
          <VehicleList
            vehicles={vehicles}
            lang={lang}
            updatingId={updatingId}
            onStatusChange={(vehicle, status) => void setVehicleStatus(vehicle, status)}
          />
        ) : isDriverTab ? (
          <DriverList
            drivers={drivers}
            lang={lang}
            updatingId={updatingId}
            canRestrictAccounts={canRestrictAccounts}
            onStatusChange={(driver, status) => void setDriverStatus(driver, status)}
            onRestrictionChange={(driver) => void setAccountRestriction(driver.user)}
          />
        ) : (
          <OwnerList
            owners={pageOwners}
            lang={lang}
            updatingId={updatingId}
            canRestrictAccounts={canRestrictAccounts}
            onRestrictionChange={(owner) => void setAccountRestriction(owner)}
          />
        )}
      </div>

      {!isLoading && !isError && (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 sm:px-5">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {total ? `${translate(lang, "Showing")} ${firstItem}-${lastItem} ${translate(lang, "of")} ${total}` : translate(lang, "No records found.")}
            {isFetching && <span className="ml-2">{translate(lang, "Refreshing...")}</span>}
          </p>
          {total > 0 && (
            <div className="flex items-center gap-2">
              <Button type="button" size="sm" variant="outline" disabled={page <= 1 || isFetching} onClick={() => setPage((current) => current - 1)}>
                {translate(lang, "Previous")}
              </Button>
              <span className="min-w-16 text-center text-xs text-muted-foreground">
                {page} / {pageCount}
              </span>
              <Button type="button" size="sm" variant="outline" disabled={page >= pageCount || isFetching} onClick={() => setPage((current) => current + 1)}>
                {translate(lang, "Next")}
              </Button>
            </div>
          )}
        </footer>
      )}
      {message && <p role="status" className="border-t px-5 py-3 text-sm">{message}</p>}
    </Card>
  );
}

function VehicleList({
  vehicles,
  lang,
  updatingId,
  onStatusChange,
}: {
  vehicles: AdminFleetVehicle[];
  lang: "en" | "bn";
  updatingId: string | null;
  onStatusChange: (vehicle: AdminFleetVehicle, status: Rickshaw["status"]) => void;
}) {
  if (!vehicles.length) {
    return <p className="p-5 text-sm text-muted-foreground">{translate(lang, "No vehicles match this search.")}</p>;
  }
  return (
    <ul className="divide-y">
      {vehicles.map((vehicle) => (
        <li key={vehicle.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{vehicle.plateNo}</p>
              <StatusBadge status={vehicle.status} />
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {vehicle.model ?? translate(lang, "Rickshaw")}
              {" · "}{translate(lang, "Owner")}: {vehicle.owner.user.name}
              {" · "}{translate(lang, "Driver")}: {vehicle.driver?.user.name ?? translate(lang, "Unassigned")}
            </p>
          </div>
          <label className="flex shrink-0 items-center gap-2 text-sm">
            <span className="text-muted-foreground">{translate(lang, "Service status")}</span>
            <select
              aria-label={`${translate(lang, "Vehicle status")} ${vehicle.plateNo}`}
              value={vehicle.status}
              disabled={updatingId !== null}
              onChange={(event) => {
                if (isRickshawStatus(event.target.value)) onStatusChange(vehicle, event.target.value);
              }}
              className="h-9 min-w-36 rounded-lg border border-input bg-background px-3"
            >
              {vehicleStatuses.map((status) => (
                <option key={status} value={status}>{translate(lang, status)}</option>
              ))}
            </select>
          </label>
        </li>
      ))}
    </ul>
  );
}

function DriverList({
  drivers,
  lang,
  updatingId,
  canRestrictAccounts,
  onStatusChange,
  onRestrictionChange,
}: {
  drivers: AdminFleetDriver[];
  lang: "en" | "bn";
  updatingId: string | null;
  canRestrictAccounts: boolean;
  onStatusChange: (driver: AdminFleetDriver, status: AdminFleetDriver["status"]) => void;
  onRestrictionChange: (driver: AdminFleetDriver) => void;
}) {
  if (!drivers.length) {
    return <p className="p-5 text-sm text-muted-foreground">{translate(lang, "No drivers match this search.")}</p>;
  }
  return (
    <ul className="divide-y">
      {drivers.map((driver) => (
        <li key={driver.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{driver.user.name}</p>
              <StatusBadge status={driver.status} />
              {driver.user.isRestricted && <StatusBadge status="Restricted" />}
              {driver.user.approvalStatus !== "APPROVED" && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-800">
                  {translate(lang, driver.user.approvalStatus)}
                </span>
              )}
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {driver.user.phone ?? driver.user.email ?? translate(lang, "Contact unavailable")}
              {" · "}{translate(lang, "Vehicle")}: {driver.rickshaw?.plateNo ?? translate(lang, "Unassigned")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex shrink-0 items-center gap-2 text-sm">
              <span className="text-muted-foreground">{translate(lang, "Availability")}</span>
              <select
                aria-label={`${translate(lang, "Driver status")} ${driver.user.name}`}
                value={driver.status}
                disabled={updatingId !== null || driver.user.approvalStatus !== "APPROVED"}
                onChange={(event) => {
                  if (isDriverStatus(event.target.value)) onStatusChange(driver, event.target.value);
                }}
                className="h-9 min-w-36 rounded-lg border border-input bg-background px-3"
              >
                {driverStatuses.map((status) => (
                  <option key={status} value={status}>{translate(lang, status)}</option>
                ))}
              </select>
            </label>
            {canRestrictAccounts && driver.user.approvalStatus === "APPROVED" && (
              <Button
                type="button"
                size="sm"
                variant={driver.user.isRestricted ? "outline" : "destructive"}
                disabled={updatingId !== null}
                onClick={() => onRestrictionChange(driver)}
              >
                {driver.user.isRestricted
                  ? <CheckCircle2 aria-hidden="true" />
                  : <Ban aria-hidden="true" />}
                {translate(lang, driver.user.isRestricted ? "Restore access" : "Restrict account")}
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function OwnerList({
  owners,
  lang,
  updatingId,
  canRestrictAccounts,
  onRestrictionChange,
}: {
  owners: ManagedAccount[];
  lang: "en" | "bn";
  updatingId: string | null;
  canRestrictAccounts: boolean;
  onRestrictionChange: (owner: ManagedAccount) => void;
}) {
  if (!owners.length) {
    return <p className="p-5 text-sm text-muted-foreground">{translate(lang, "No owners match this search.")}</p>;
  }
  return (
    <ul className="divide-y">
      {owners.map((owner) => (
        <li key={owner.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-medium">{owner.name}</p>
              <StatusBadge status={owner.isRestricted ? "Restricted" : "ACTIVE"} />
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {[owner.phone, owner.email].filter(Boolean).join(" · ") || translate(lang, "Contact unavailable")}
            </p>
          </div>
          {canRestrictAccounts && (
            <Button
              type="button"
              size="sm"
              variant={owner.isRestricted ? "outline" : "destructive"}
              disabled={updatingId !== null}
              onClick={() => onRestrictionChange(owner)}
            >
              {owner.isRestricted
                ? <CheckCircle2 aria-hidden="true" />
                : <Ban aria-hidden="true" />}
              {translate(lang, owner.isRestricted ? "Restore access" : "Restrict account")}
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
