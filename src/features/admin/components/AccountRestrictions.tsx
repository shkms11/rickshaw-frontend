import { useState } from "react";
import { Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    useGetManagedAccountsQuery,
    useUpdateAccountRestrictionMutation,
    type ManagedAccount,
} from "@/api/adminApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

function accountLabel(account: ManagedAccount) {
    return account.role === "OWNER" ? "Owner" : "Driver";
}

export default function AccountRestrictions() {
    const { lang } = useAppSelector((state) => state.ui);
    const { data, isLoading, isError } = useGetManagedAccountsQuery();
    const [updateRestriction, mutation] = useUpdateAccountRestrictionMutation();
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    async function toggleRestriction(account: ManagedAccount) {
        setUpdatingId(account.id);
        setErrorMessage("");
        try {
            await updateRestriction({
                userId: account.id,
                isRestricted: !account.isRestricted,
            }).unwrap();
        } catch {
            setErrorMessage(translate(lang, "Could not update account access. Please try again."));
        } finally {
            setUpdatingId(null);
        }
    }

    const accounts = data?.accounts ?? [];

    return (
        <Card className="overflow-hidden">
            <div className="border-b p-5">
                <h2 className="font-semibold">{translate(lang, "Driver and owner access")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {translate(lang, "Restrict an account to block sign-in, or restore access later.")}
                </p>
            </div>
            {isLoading ? (
                <p className="p-5 text-sm text-muted-foreground">{translate(lang, "Loading accounts...")}</p>
            ) : isError ? (
                <p role="alert" className="p-5 text-sm text-destructive">
                    {translate(lang, "Could not load manageable accounts.")}
                </p>
            ) : accounts.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">
                    {translate(lang, "No approved drivers or owners are available to manage.")}
                </p>
            ) : (
                <div className="divide-y">
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="truncate font-medium">{account.name}</p>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                        account.isRestricted
                                            ? "bg-red-100 text-red-800"
                                            : "bg-emerald-100 text-emerald-800"
                                    }`}>
                                        {translate(lang, account.isRestricted ? "Restricted" : "Active")}
                                    </span>
                                </div>
                                <p className="truncate text-sm text-muted-foreground">
                                    {[accountLabel(account), account.phone, account.email]
                                        .filter(Boolean)
                                        .map((item) => translate(lang, item!))
                                        .join(" · ")}
                                </p>
                                {account.role === "DRIVER" && account.driver?.rickshaw && (
                                    <p className="text-xs text-muted-foreground">
                                        {account.driver.rickshaw.plateNo} · {account.driver.rickshaw.owner.user.name}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                variant={account.isRestricted ? "outline" : "destructive"}
                                disabled={mutation.isLoading || updatingId !== null}
                                onClick={() => void toggleRestriction(account)}
                            >
                                {account.isRestricted
                                    ? <CheckCircle2 aria-hidden="true" />
                                    : <Ban aria-hidden="true" />}
                                {translate(lang, account.isRestricted ? "Restore access" : "Restrict account")}
                            </Button>
                        </div>
                    ))}
                </div>
            )}
            {errorMessage && (
                <p role="alert" className="border-t p-4 text-sm text-destructive">{errorMessage}</p>
            )}
        </Card>
    );
}
