import { Check, LoaderCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    useGetAdminApprovalsQuery,
    useUpdateAdminApprovalMutation,
    type AdminApproval,
} from "@/api/adminApi";

function displayName(approval: AdminApproval) {
    return approval.name ?? approval.user?.name ?? "Unnamed account";
}

function displayEmail(approval: AdminApproval) {
    return approval.email ?? approval.user?.email ?? "Email unavailable";
}

function displayRole(approval: AdminApproval) {
    return approval.role ?? approval.user?.role ?? "User";
}

export default function AdminApprovals() {
    const { data, isLoading, isError, refetch } = useGetAdminApprovalsQuery();
    const [updateApproval, { isLoading: isUpdating, error: updateError }] =
        useUpdateAdminApprovalMutation();
    const approvals = data?.approvals ?? [];

    async function decide(userId: string, status: "APPROVED" | "REJECTED") {
        try {
            await updateApproval({ userId, status }).unwrap();
        } catch {
            // The mutation error is rendered below.
        }
    }

    return (
        <Card className="overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b p-5">
                <div>
                    <h2 className="font-semibold">Registration approvals</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Approve or reject pending driver and owner accounts.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => void refetch()}
                    disabled={isLoading}
                >
                    Refresh
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
                    <LoaderCircle className="size-4 animate-spin" />
                    Loading pending registrations...
                </div>
            ) : isError ? (
                <p role="alert" className="p-6 text-sm text-destructive">
                    Could not load registrations. Confirm you are signed in as
                    an admin and try again.
                </p>
            ) : approvals.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">
                    There are no registrations waiting for approval.
                </p>
            ) : (
                <div className="divide-y">
                    {approvals.map((approval) => {
                        const name = displayName(approval);
                        return (
                            <div
                                key={approval.userId}
                                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {name}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {displayEmail(approval)}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {displayRole(approval)}
                                        {approval.createdAt &&
                                            ` · Submitted ${new Date(approval.createdAt).toLocaleDateString()}`}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="bg-emerald-700 text-white hover:bg-emerald-800"
                                        disabled={isUpdating}
                                        onClick={() =>
                                            void decide(
                                                approval.userId,
                                                "APPROVED",
                                            )
                                        }
                                        aria-label={`Approve ${name}`}
                                    >
                                        <Check />
                                        Approve
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        disabled={isUpdating}
                                        onClick={() =>
                                            void decide(
                                                approval.userId,
                                                "REJECTED",
                                            )
                                        }
                                        aria-label={`Reject ${name}`}
                                    >
                                        <X />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {updateError && (
                <p
                    role="alert"
                    className="border-t p-4 text-sm text-destructive"
                >
                    The approval decision could not be saved. Please try again.
                </p>
            )}
        </Card>
    );
}
