import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useGetFleetActionsQuery,
  useReviewFleetActionMutation,
  type FleetAction,
} from "@/features/rickshaws/api/fleetActionApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

function ActionRow({ action }: { action: FleetAction }) {
  const { lang } = useAppSelector((state) => state.ui);
  const [review, { isLoading }] = useReviewFleetActionMutation();
  const [error, setError] = useState("");

  async function update(status: "APPROVED" | "REJECTED" | "RESOLVED") {
    setError("");
    try {
      await review({ actionId: action.id, status }).unwrap();
    } catch (requestError) {
      if (
        typeof requestError === "object" &&
        requestError !== null &&
        "data" in requestError &&
        typeof requestError.data === "object" &&
        requestError.data !== null &&
        "message" in requestError.data &&
        typeof requestError.data.message === "string"
      ) {
        setError(translate(lang, requestError.data.message));
      } else {
        setError(translate(lang, "Could not update fleet action."));
      }
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium">
          {translate(lang, action.type === "LOST_RICKSHAW" ? "Lost vehicle alert" : "Vehicle removal request")}
          {" · "}
          {action.rickshaw.plateNo}
        </p>
        <p className="text-sm text-muted-foreground">
          {translate(lang, "Owner")}: {action.rickshaw.owner.user.name}
          {" · "}
          {translate(lang, "Reported by")}: {action.createdBy.name} ({translate(lang, action.createdBy.role.toLowerCase())})
          {" · "}
          {new Date(action.createdAt).toLocaleString()}
        </p>
        {action.message && <p className="mt-1 text-sm">{action.message}</p>}
        {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        {action.type === "LOST_RICKSHAW" ? (
          <Button type="button" disabled={isLoading} onClick={() => void update("RESOLVED")}>
            {translate(lang, isLoading ? "Saving..." : "Mark resolved")}
          </Button>
        ) : (
          <>
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => void update("APPROVED")}
              className="bg-emerald-700 text-white hover:bg-emerald-800"
            >
              {translate(lang, "Approve removal")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => void update("REJECTED")}
            >
              {translate(lang, "Reject")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminFleetActions() {
  const { lang } = useAppSelector((state) => state.ui);
  const { data, isLoading, isError } = useGetFleetActionsQuery(undefined, {
    pollingInterval: 20000,
  });
  const openActions = data?.actions.filter((action) => action.status === "OPEN") ?? [];

  return (
    <Card className="overflow-hidden">
      <div className="border-b p-5">
        <h2 className="font-semibold">{translate(lang, "Fleet alerts and requests")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {translate(lang, "Review lost-vehicle alerts and owner removal requests.")}
        </p>
      </div>
      {isLoading ? (
        <p className="p-5 text-sm text-muted-foreground">{translate(lang, "Loading fleet alerts...")}</p>
      ) : isError ? (
        <p role="alert" className="p-5 text-sm text-destructive">
          {translate(lang, "Could not load fleet alerts and requests.")}
        </p>
      ) : openActions.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">{translate(lang, "No fleet alerts or requests need review.")}</p>
      ) : (
        <div className="divide-y">
          {openActions.map((action) => <ActionRow key={action.id} action={action} />)}
        </div>
      )}
    </Card>
  );
}
