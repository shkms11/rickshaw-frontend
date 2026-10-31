import { useState } from "react";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useReportLostRickshawMutation } from "@/features/rickshaws/api/fleetActionApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

type LostRickshawAlertProps = {
  rickshawId: string;
  plateNo: string;
  isAlertOpen: boolean;
};

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
  return "Could not send alert. Please contact the admin team.";
}

/** Confirms and submits a lost-vehicle alert, disabling duplicate reports while one is open. */
export default function LostRickshawAlert({
  rickshawId,
  plateNo,
  isAlertOpen,
}: LostRickshawAlertProps) {
  const { lang } = useAppSelector((state) => state.ui);
  const [reportLost, { isLoading }] = useReportLostRickshawMutation();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function report() {
    if (!window.confirm(`${translate(lang, "Warn the owner and admin that")} ${plateNo} ${translate(lang, "is lost?")}`)) {
      return;
    }
    setMessage("");
    setError("");
    try {
      await reportLost({ rickshawId }).unwrap();
      setMessage(translate(lang, "Lost-rickshaw alert sent to the owner and admin."));
    } catch (requestError) {
      setError(translate(lang, getErrorMessage(requestError)));
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="destructive"
        disabled={isLoading || isAlertOpen}
        onClick={() => void report()}
      >
        <TriangleAlert aria-hidden="true" />
        {translate(lang, isAlertOpen ? "Lost-rickshaw alert is open" : isLoading ? "Sending alert..." : "Report rickshaw lost")}
      </Button>
      {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
