import { useState } from "react";

import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/app/hooks";
import { useGetAdminDriversQuery, useUpdateAdminDriverStatusMutation } from "@/api/adminApi";
import {
  useGetRickshawsQuery,
  useUpdateRickshawStatusMutation,
  type Rickshaw,
} from "@/features/rickshaws/api/rickshawApi";
import { translate } from "@/shared/i18n";

const vehicleStatuses: Rickshaw["status"][] = ["ACTIVE", "INACTIVE", "MAINTENANCE"];
const driverStatuses = ["ONLINE", "OFFLINE", "ON_TRIP"] as const;

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

/** Loads fleet and driver records, then submits permitted status changes through feature APIs. */
export default function AdminFleetControls() {
  const { lang } = useAppSelector((state) => state.ui);
  const fleetQuery = useGetRickshawsQuery(undefined, { pollingInterval: 20000 });
  const driversQuery = useGetAdminDriversQuery(undefined, { pollingInterval: 20000 });
  const [updateVehicle, vehicleUpdate] = useUpdateRickshawStatusMutation();
  const [updateDriver, driverUpdate] = useUpdateAdminDriverStatusMutation();
  const [message, setMessage] = useState("");

  async function setVehicleStatus(rickshawId: string, status: Rickshaw["status"]) {
    setMessage("");
    try {
      await updateVehicle({ rickshawId, status }).unwrap();
      setMessage(translate(lang, "Vehicle status updated."));
    } catch (error) {
      setMessage(translate(lang, getErrorMessage(error, "Could not update vehicle status.")));
    }
  }

  async function setDriverStatus(driverId: string, status: (typeof driverStatuses)[number]) {
    setMessage("");
    try {
      await updateDriver({ driverId, status }).unwrap();
      setMessage(translate(lang, "Driver status updated."));
    } catch (error) {
      setMessage(translate(lang, getErrorMessage(error, "Could not update driver status.")));
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b p-5">
        <h2 className="font-semibold">{translate(lang, "Admin fleet controls")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {translate(lang, "Update vehicle service status and driver availability.")}
        </p>
      </div>
      {fleetQuery.isLoading || driversQuery.isLoading ? (
        <p className="p-5 text-sm text-muted-foreground">{translate(lang, "Loading fleet controls...")}</p>
      ) : fleetQuery.isError || driversQuery.isError ? (
        <p role="alert" className="p-5 text-sm text-destructive">{translate(lang, "Could not load fleet controls.")}</p>
      ) : (
        <div className="divide-y">
          <div className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">{translate(lang, "Vehicles")}</h3>
            {(fleetQuery.data?.rickshaws ?? []).map((vehicle) => (
              <label key={vehicle.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm">
                <span>
                  <span className="font-medium">{vehicle.plateNo}</span>
                  {vehicle.owner && (
                    <span className="block text-xs text-muted-foreground">
                      {translate(lang, "Owner")}: {vehicle.owner.user.name}
                    </span>
                  )}
                </span>
                <select
                  aria-label={`${translate(lang, "Vehicle status")} ${vehicle.plateNo}`}
                  value={vehicle.status}
                  disabled={vehicleUpdate.isLoading}
                  onChange={(event) => {
                    if (isRickshawStatus(event.target.value)) {
                      void setVehicleStatus(vehicle.id, event.target.value);
                    }
                  }}
                  className="h-9 rounded-lg border border-input bg-background px-3"
                >
                  {vehicleStatuses.map((status) => (
                    <option key={status} value={status}>{translate(lang, status)}</option>
                  ))}
                </select>
              </label>
            ))}
            {!fleetQuery.data?.rickshaws.length && (
              <p className="text-sm text-muted-foreground">{translate(lang, "No vehicles registered.")}</p>
            )}
          </div>
          <div className="space-y-2 p-4">
            <h3 className="text-sm font-semibold">{translate(lang, "Drivers")}</h3>
            {(driversQuery.data ?? []).map((driver) => (
              <label key={driver.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm">
                <span>
                  <span className="font-medium">{driver.user.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {driver.user.phone ?? driver.user.email ?? translate(lang, "Contact unavailable")}
                    {driver.rickshaw && ` · ${driver.rickshaw.plateNo}`}
                  </span>
                </span>
                <select
                  aria-label={`${translate(lang, "Driver status")} ${driver.user.name}`}
                  value={driver.status}
                  disabled={driverUpdate.isLoading || driver.user.approvalStatus !== "APPROVED"}
                  onChange={(event) => {
                    if (isDriverStatus(event.target.value)) {
                      void setDriverStatus(driver.id, event.target.value);
                    }
                  }}
                  className="h-9 rounded-lg border border-input bg-background px-3"
                >
                  {driverStatuses.map((status) => (
                    <option key={status} value={status}>{translate(lang, status)}</option>
                  ))}
                </select>
              </label>
            ))}
            {!driversQuery.data?.length && (
              <p className="text-sm text-muted-foreground">{translate(lang, "No drivers registered.")}</p>
            )}
          </div>
        </div>
      )}
      {message && <p role="status" className="border-t p-4 text-sm">{message}</p>}
    </Card>
  );
}
