import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/app/hooks";
import {
  useGetAdminFleetDriversQuery,
  useGetAdminFleetVehiclesQuery,
  useUpdateAdminDriverStatusMutation,
} from "@/api/adminApi";
import type { AdminFleetDriver, AdminFleetVehicle, AdminFleetListParams } from "@/api/adminApi";
import {
  useUpdateRickshawStatusMutation,
  type Rickshaw,
} from "@/features/rickshaws/api/rickshawApi";
import { translate } from "@/shared/i18n";

const pageSize = 20;
const vehicleStatuses: Rickshaw["status"][] = ["ACTIVE", "INACTIVE", "MAINTENANCE"];
const driverStatuses = ["ONLINE", "OFFLINE", "ON_TRIP"] as const;
type FleetTab = "vehicles" | "drivers";

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
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status] ?? styles.OFFLINE}`}>
      {translate(useAppSelector((state) => state.ui).lang, status)}
    </span>
  );
}

/** Searchable, server-paginated fleet controls; loads only the active tab and page. */
export default function AdminFleetControls() {
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
  const [updateVehicle] = useUpdateRickshawStatusMutation();
  const [updateDriver] = useUpdateAdminDriverStatusMutation();
  const isVehicleTab = tab === "vehicles";
  const isLoading = isVehicleTab ? vehicleQuery.isLoading : driverQuery.isLoading;
  const isFetching = isVehicleTab ? vehicleQuery.isFetching : driverQuery.isFetching;
  const isError = isVehicleTab ? vehicleQuery.isError : driverQuery.isError;
  const total = isVehicleTab
    ? vehicleQuery.currentData?.total ?? 0
    : driverQuery.currentData?.total ?? 0;
  const vehicles = vehicleQuery.currentData?.items ?? [];
  const drivers = driverQuery.currentData?.items ?? [];
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
          {translate(lang, "Update vehicle service status and driver availability.")}
        </p>
        <div className="mt-4 flex gap-2" role="tablist" aria-label={translate(lang, "Fleet records")}>
          {(["vehicles", "drivers"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              variant={tab === value ? "default" : "outline"}
              className={tab === value ? "bg-emerald-700 text-white hover:bg-emerald-800" : ""}
              onClick={() => changeTab(value)}
            >
              {translate(lang, value === "vehicles" ? "Vehicles" : "Drivers")}
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
            placeholder={translate(lang, isVehicleTab ? "Search plate, owner, or driver" : "Search driver, phone, or plate")}
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
            {(isVehicleTab ? vehicleStatuses : driverStatuses).map((status) => (
              <option key={status} value={status}>{translate(lang, status)}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="min-h-48">
        {isLoading ? (
          <p className="p-5 text-sm text-muted-foreground">{translate(lang, "Loading fleet controls...")}</p>
        ) : isError ? (
          <p role="alert" className="p-5 text-sm text-destructive">{translate(lang, "Could not load fleet controls.")}</p>
        ) : isVehicleTab ? (
          <VehicleList
            vehicles={vehicles}
            lang={lang}
            updatingId={updatingId}
            onStatusChange={(vehicle, status) => void setVehicleStatus(vehicle, status)}
          />
        ) : (
          <DriverList
            drivers={drivers}
            lang={lang}
            updatingId={updatingId}
            onStatusChange={(driver, status) => void setDriverStatus(driver, status)}
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
  onStatusChange,
}: {
  drivers: AdminFleetDriver[];
  lang: "en" | "bn";
  updatingId: string | null;
  onStatusChange: (driver: AdminFleetDriver, status: AdminFleetDriver["status"]) => void;
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
        </li>
      ))}
    </ul>
  );
}
