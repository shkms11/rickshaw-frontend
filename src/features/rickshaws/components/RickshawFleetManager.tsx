import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/app/hooks";
import {
  useGetFleetActionsQuery,
  useRequestRickshawRemovalMutation,
  type FleetAction,
} from "@/features/rickshaws/api/fleetActionApi";
import { useGetRickshawsQuery, type Rickshaw } from "@/features/rickshaws/api/rickshawApi";
import { useGetDriverLocationsQuery } from "@/features/tracking/api/locationApi";
import RickshawDriverAssignment from "@/features/rickshaws/components/RickshawDriverAssignment";
import LostRickshawAlert from "@/features/rickshaws/components/LostRickshawAlert";
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
  return "Could not send request. Check your connection and try again.";
}

type RickshawFleetRowProps = {
  vehicle: Rickshaw;
  actions: FleetAction[];
  locations: { rickshawPlate: string | null; isLive: boolean; updatedAt: string }[];
  trackingError: boolean;
};

function RickshawFleetRow({ vehicle, actions, locations, trackingError }: RickshawFleetRowProps) {
  const { lang } = useAppSelector((state) => state.ui);
  const [requestRemoval, { isLoading }] = useRequestRickshawRemovalMutation();
  const [message, setMessage] = useState("");
  const vehicleActions = actions.filter((action) => action.rickshaw.id === vehicle.id);
  const openRemoval = vehicleActions.find(
    (action) => action.type === "REMOVE_RICKSHAW" && action.status === "OPEN",
  );
  const latestRemoval = vehicleActions.find((action) => action.type === "REMOVE_RICKSHAW");
  const lostAlert = vehicleActions.find(
    (action) => action.type === "LOST_RICKSHAW" && action.status === "OPEN",
  );
  const location = locations.find((item) => item.rickshawPlate === vehicle.plateNo);

  async function sendRemovalRequest() {
    if (!window.confirm(`${translate(lang, "Ask admin to remove")} ${vehicle.plateNo}${translate(lang, "?")}`)) {
      return;
    }
    setMessage("");
    try {
      await requestRemoval({ rickshawId: vehicle.id }).unwrap();
      setMessage(translate(lang, "Removal request sent. Admin approval is required."));
    } catch (error) {
      setMessage(translate(lang, getErrorMessage(error)));
    }
  }

  return (
    <div className="space-y-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium">{vehicle.plateNo}</p>
          <p className="text-sm text-muted-foreground">
            {vehicle.model ?? translate(lang, "Model not provided")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {trackingError
              ? translate(lang, "Could not load vehicle tracking status.")
              : location?.isLive
                ? `${translate(lang, "Live location")} · ${new Date(location.updatedAt).toLocaleTimeString()}`
                : location
                  ? `${translate(lang, "Last known location")} · ${new Date(location.updatedAt).toLocaleTimeString()}`
                  : translate(lang, "No driver location reported")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={vehicle.status === "ACTIVE" ? "default" : "outline"}>
            {translate(lang, vehicle.status)}
          </Badge>
          {vehicle.status !== "INACTIVE" && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isLoading || Boolean(openRemoval)}
              onClick={() => void sendRemovalRequest()}
            >
              {translate(lang, openRemoval ? "Awaiting admin approval" : isLoading ? "Sending request..." : "Request removal")}
            </Button>
          )}
        </div>
      </div>

      {lostAlert && (
        <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {translate(lang, "Lost-rickshaw alert sent by")} {lostAlert.createdBy.name} · {new Date(lostAlert.createdAt).toLocaleString()}
        </p>
      )}
      {openRemoval && (
        <p role="status" className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
          {translate(lang, "Removal request is waiting for admin approval.")}
        </p>
      )}
      {!openRemoval && latestRemoval?.status === "REJECTED" && (
        <p role="status" className="rounded-md bg-muted p-3 text-sm">
          {translate(lang, "Admin rejected the vehicle removal request.")}
        </p>
      )}
      {!openRemoval && latestRemoval?.status === "APPROVED" && (
        <p role="status" className="rounded-md bg-muted p-3 text-sm">
          {translate(lang, "Admin approved the vehicle removal request.")}
        </p>
      )}
      {lostAlert && (
        <LostRickshawAlert
          rickshawId={vehicle.id}
          plateNo={vehicle.plateNo}
          isAlertOpen
        />
      )}
      {!lostAlert && vehicle.status !== "INACTIVE" && (
        <LostRickshawAlert
          rickshawId={vehicle.id}
          plateNo={vehicle.plateNo}
          isAlertOpen={false}
        />
      )}
      <RickshawDriverAssignment rickshaw={vehicle} />
      {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

export default function RickshawFleetManager() {
  const { lang } = useAppSelector((state) => state.ui);
  const fleetQuery = useGetRickshawsQuery(undefined, { pollingInterval: 20000 });
  const actionsQuery = useGetFleetActionsQuery(undefined, { pollingInterval: 20000 });
  const locationsQuery = useGetDriverLocationsQuery(undefined, { pollingInterval: 15000 });
  const fleet = fleetQuery.data?.rickshaws ?? [];
  const actions = actionsQuery.data?.actions ?? [];
  const locations = locationsQuery.data?.locations ?? [];

  return (
    <Card className="overflow-hidden">
      <div className="border-b p-5">
        <h2 className="font-semibold">{translate(lang, "Your fleet")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {translate(lang, "Search approved drivers by phone, check GPS, and request admin help for fleet changes.")}
        </p>
      </div>
      {fleetQuery.isError ? (
        <p role="alert" className="p-5 text-sm text-destructive">
          {translate(lang, "Could not load fleet. Please check your connection and sign-in.")}
        </p>
      ) : fleetQuery.isLoading ? (
        <p className="p-5 text-sm text-muted-foreground">{translate(lang, "Loading fleet...")}</p>
      ) : fleet.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">
          {translate(lang, "No vehicles yet. Add your first rickshaw above.")}
        </p>
      ) : (
        <div className="divide-y">
          {fleet.map((vehicle) => (
            <RickshawFleetRow
              key={vehicle.id}
              vehicle={vehicle}
              actions={actions}
              locations={locations}
              trackingError={locationsQuery.isError}
            />
          ))}
        </div>
      )}
      {actionsQuery.isError && (
        <p role="alert" className="border-t p-4 text-sm text-destructive">
          {translate(lang, "Could not load fleet alerts and requests.")}
        </p>
      )}
    </Card>
  );
}
