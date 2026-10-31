import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useGetAdminComplaintsQuery,
  useUpdateComplaintStatusMutation,
} from "@/features/complaints/api/complaintApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

/** Polls the shared complaint queue and lets admins reopen or resolve reports. */
export default function AdminComplaintInbox() {
  const { lang } = useAppSelector((state) => state.ui);
  const complaintsQuery = useGetAdminComplaintsQuery(undefined, { pollingInterval: 30000 });
  const [updateStatus, { isLoading }] = useUpdateComplaintStatusMutation();
  const [error, setError] = useState("");
  const complaints = complaintsQuery.data?.complaints ?? [];

  async function toggleStatus(complaintId: string, status: "OPEN" | "RESOLVED") {
    setError("");
    try {
      await updateStatus({ complaintId, status }).unwrap();
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
        setError(translate(lang, "Could not update report status."));
      }
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b p-5">
        <h2 className="font-semibold">{translate(lang, "Owner and driver reports")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {translate(lang, "Review reports and mark issues resolved when handled.")}
        </p>
      </div>
      {complaintsQuery.isLoading ? (
        <p className="p-5 text-sm text-muted-foreground">{translate(lang, "Loading reports...")}</p>
      ) : complaintsQuery.isError ? (
        <p role="alert" className="p-5 text-sm text-destructive">{translate(lang, "Could not load reports.")}</p>
      ) : complaints.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">{translate(lang, "No reports have been submitted.")}</p>
      ) : (
        <div className="divide-y">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{complaint.subject}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${complaint.status === "OPEN" ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`}>
                    {translate(lang, complaint.status)}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm">{complaint.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {complaint.user.name} · {translate(lang, complaint.user.role.toLowerCase())}
                  {complaint.user.phone && ` · ${complaint.user.phone}`}
                  {" · "}
                  {new Date(complaint.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant={complaint.status === "OPEN" ? "default" : "outline"}
                disabled={isLoading}
                onClick={() => void toggleStatus(
                  complaint.id,
                  complaint.status === "OPEN" ? "RESOLVED" : "OPEN",
                )}
              >
                {translate(lang, complaint.status === "OPEN" ? "Mark resolved" : "Reopen")}
              </Button>
            </div>
          ))}
        </div>
      )}
      {error && <p role="alert" className="border-t p-4 text-sm text-destructive">{error}</p>}
    </Card>
  );
}
