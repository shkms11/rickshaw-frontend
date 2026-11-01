import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetRickshawsQuery } from "@/features/rickshaws/api/rickshawApi";
import {
    useAddOwnerRentalIncomeMutation,
    useGetOwnerRentalIncomeQuery,
    type OwnerIncomePeriod,
} from "@/features/owner/api/ownerIncomeApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

const periods: OwnerIncomePeriod[] = ["today", "week", "month", "year", "all"];

function todayInputValue() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatTaka(amount: string, language: "en" | "bn") {
    return new Intl.NumberFormat(language === "bn" ? "bn-BD" : "en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(Number(amount));
}

export default function OwnerRentalIncome() {
    const { lang } = useAppSelector((state) => state.ui);
    const [period, setPeriod] = useState<OwnerIncomePeriod>("today");
    const [workDate, setWorkDate] = useState(todayInputValue);
    const [rickshawId, setRickshawId] = useState("");
    const [amount, setAmount] = useState("");
    const [saveError, setSaveError] = useState<"duplicate" | "other" | null>(null);
    const { data: fleetData, isLoading: fleetLoading } = useGetRickshawsQuery();
    const fleet = fleetData?.rickshaws ?? [];
    const selectedRickshawId = fleet.some((item) => item.id === rickshawId)
        ? rickshawId
        : fleet[0]?.id ?? "";
    const [addIncome, saveState] = useAddOwnerRentalIncomeMutation();
    const incomeQuery = useGetOwnerRentalIncomeQuery(period);
    const income = incomeQuery.data;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaveError(null);
        try {
            await addIncome({
                rickshawId: selectedRickshawId,
                workDate,
                amount: Number(amount),
            }).unwrap();
            setAmount("");
        } catch (error) {
            const status = typeof error === "object" && error !== null && "status" in error
                ? error.status
                : undefined;
            setSaveError(status === 409 ? "duplicate" : "other");
        }
    }

    return (
        <Card className="space-y-4 p-5 sm:p-6">
            <div>
                <h2 className="font-semibold">{translate(lang, "Daily rickshaw rental income")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {translate(lang, "Record the daily rent when a driver rents one of your rickshaws.")}
                </p>
            </div>

            {fleetLoading ? (
                <p className="text-sm text-muted-foreground">{translate(lang, "Loading fleet...")}</p>
            ) : fleet.length === 0 ? (
                <p className="text-sm text-muted-foreground">{translate(lang, "Add a rickshaw to your fleet to record rental income.")}</p>
            ) : (
                <>
                    <form
                        onSubmit={(event) => void handleSubmit(event)}
                        className="grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-end"
                    >
                        <label className="space-y-1 text-xs font-medium">
                            {translate(lang, "Rickshaw")}
                            <select
                                className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                                value={selectedRickshawId}
                                onChange={(event) => setRickshawId(event.target.value)}
                                required
                            >
                                {fleet.map((rickshaw) => (
                                    <option key={rickshaw.id} value={rickshaw.id}>{rickshaw.plateNo}</option>
                                ))}
                            </select>
                        </label>
                        <label className="space-y-1 text-xs font-medium">
                            {translate(lang, "Rental date")}
                            <Input
                                type="date"
                                value={workDate}
                                max={todayInputValue()}
                                onChange={(event) => setWorkDate(event.target.value)}
                                required
                            />
                        </label>
                        <label className="space-y-1 text-xs font-medium">
                            {translate(lang, "Daily rent (৳)")}
                            <Input
                                type="number"
                                min="0.01"
                                max="1000000"
                                step="0.01"
                                inputMode="decimal"
                                placeholder="500"
                                value={amount}
                                onChange={(event) => setAmount(event.target.value)}
                                required
                            />
                        </label>
                        <Button type="submit" disabled={saveState.isLoading || !selectedRickshawId}>
                            {translate(lang, saveState.isLoading ? "Saving..." : "Add rental")}
                        </Button>
                    </form>

                    {saveError && (
                        <p role="alert" className="text-sm text-destructive">
                            {translate(lang, saveError === "duplicate"
                                ? "Rental income is already recorded for this rickshaw and date."
                                : "Could not save rental income. Check the details and try again.")}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2" aria-label={translate(lang, "Choose totals period")}>
                        {periods.map((option) => (
                            <Button
                                key={option}
                                type="button"
                                size="sm"
                                variant={period === option ? "default" : "outline"}
                                aria-pressed={period === option}
                                onClick={() => setPeriod(option)}
                            >
                                {translate(lang, `activity-period-${option}`)}
                            </Button>
                        ))}
                    </div>

                    {incomeQuery.isLoading ? (
                        <p className="text-sm text-muted-foreground">{translate(lang, "Loading rental totals...")}</p>
                    ) : incomeQuery.isError ? (
                        <p role="alert" className="text-sm text-destructive">
                            {translate(lang, "Could not load rental income.")}
                        </p>
                    ) : income ? (
                        <>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl bg-emerald-50 p-3">
                                    <p className="text-xs text-muted-foreground">{translate(lang, "Total rental income")}</p>
                                    <p className="mt-1 text-xl font-semibold text-emerald-900">
                                        {formatTaka(income.totalRentalIncome, lang)}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-sky-50 p-3">
                                    <p className="text-xs text-muted-foreground">{translate(lang, "Rickshaw rental days")}</p>
                                    <p className="mt-1 text-xl font-semibold text-sky-900">{income.rentalDays}</p>
                                </div>
                            </div>

                            {income.byRickshaw.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">{translate(lang, "Income by rickshaw")}</h3>
                                    <ul className="divide-y rounded-xl border">
                                        {income.byRickshaw.map((item) => (
                                            <li key={item.rickshawId} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                                                <span className="font-medium">{item.plateNo}</span>
                                                <span className="text-muted-foreground">
                                                    {item.rentalDays} {translate(lang, "rental days")}
                                                </span>
                                                <span className="font-semibold">{formatTaka(item.total, lang)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {income.entries.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">{translate(lang, "Recent rental entries")}</h3>
                                    <ul className="divide-y rounded-xl border">
                                        {income.entries.slice(0, 5).map((entry) => (
                                            <li key={entry.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                                                <time dateTime={entry.workDate} className="text-muted-foreground">{entry.workDate}</time>
                                                <span>{entry.plateNo}</span>
                                                <span className="font-medium">{formatTaka(entry.amount, lang)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {translate(lang, "These totals are based on rental amounts entered by you.")}
                            </p>
                        </>
                    ) : null}
                </>
            )}
        </Card>
    );
}
