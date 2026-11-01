import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    useAddMyDriverActivityEntryMutation,
    useGetMyDriverStatsQuery,
    type DriverActivityPeriod,
} from "@/features/driver/api/driverApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

const periods: DriverActivityPeriod[] = ["today", "week", "month", "year", "all"];

function localDateInputValue() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function formatFare(amount: string, language: "en" | "bn") {
    return new Intl.NumberFormat(language === "bn" ? "bn-BD" : "en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(Number(amount));
}

function formatNumber(amount: number, language: "en" | "bn") {
    return new Intl.NumberFormat(language === "bn" ? "bn-BD" : "en-BD", {
        maximumFractionDigits: 1,
    }).format(amount);
}

/** Lets drivers log individual trips and review their self-reported totals by period. */
export default function DriverActivityCard() {
    const { lang } = useAppSelector((state) => state.ui);
    const [period, setPeriod] = useState<DriverActivityPeriod>("today");
    const [workDate, setWorkDate] = useState(localDateInputValue);
    const [fare, setFare] = useState("");
    const [distanceKm, setDistanceKm] = useState("");
    const [saveError, setSaveError] = useState(false);
    const [saveEntry, saveState] = useAddMyDriverActivityEntryMutation();
    const statsQuery = useGetMyDriverStatsQuery(period);
    const stats = statsQuery.data;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaveError(false);
        try {
            await saveEntry({
                workDate,
                fare: Number(fare),
                distanceKm: Number(distanceKm),
            }).unwrap();
            setFare("");
            setDistanceKm("");
        } catch {
            setSaveError(true);
        }
    }

    return (
        <Card className="space-y-4 p-5 sm:p-6">
            <div>
                <h2 className="font-semibold">{translate(lang, "Your driving activity")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {translate(lang, "Log each trip's fare and distance to track your totals.")}
                </p>
            </div>

            <form onSubmit={(event) => void handleSubmit(event)} className="grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
                <label className="space-y-1 text-xs font-medium">
                    {translate(lang, "Trip date")}
                    <Input
                        type="date"
                        value={workDate}
                        max={localDateInputValue()}
                        onChange={(event) => setWorkDate(event.target.value)}
                        required
                    />
                </label>
                <label className="space-y-1 text-xs font-medium">
                    {translate(lang, "Fare (৳)")}
                    <Input
                        type="number"
                        min="0.01"
                        max="100000"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="50"
                        value={fare}
                        onChange={(event) => setFare(event.target.value)}
                        required
                    />
                </label>
                <label className="space-y-1 text-xs font-medium">
                    {translate(lang, "Distance (km)")}
                    <Input
                        type="number"
                        min="0"
                        max="200"
                        step="0.1"
                        inputMode="decimal"
                        placeholder="1"
                        value={distanceKm}
                        onChange={(event) => setDistanceKm(event.target.value)}
                        required
                    />
                </label>
                <Button type="submit" disabled={saveState.isLoading}>
                    {translate(lang, saveState.isLoading ? "Saving..." : "Add trip")}
                </Button>
            </form>
            {saveError && (
                <p role="alert" className="text-sm text-destructive">
                    {translate(lang, "Could not save this trip. Check the values and try again.")}
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

            {statsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">{translate(lang, "Loading your activity...")}</p>
            ) : statsQuery.isError ? (
                <p role="alert" className="text-sm text-destructive">
                    {translate(lang, "Could not load your driving activity.")}
                </p>
            ) : stats ? (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-emerald-50 p-3">
                            <p className="text-xs text-muted-foreground">{translate(lang, "Total trips")}</p>
                            <p className="mt-1 text-xl font-semibold text-emerald-900">{formatNumber(stats.totalTrips, lang)}</p>
                        </div>
                        <div className="rounded-xl bg-amber-50 p-3">
                            <p className="text-xs text-muted-foreground">{translate(lang, "Total fare")}</p>
                            <p className="mt-1 text-lg font-semibold text-amber-900">{formatFare(stats.totalFare, lang)}</p>
                        </div>
                        <div className="col-span-2 rounded-xl bg-sky-50 p-3 sm:col-span-1">
                            <p className="text-xs text-muted-foreground">{translate(lang, "Total distance")}</p>
                            <p className="mt-1 text-lg font-semibold text-sky-900">
                                {formatNumber(stats.totalDistanceKm, lang)} {translate(lang, "km")}
                            </p>
                        </div>
                    </div>
                    {stats.entries.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">{translate(lang, "Recent trip entries")}</h3>
                            <ul className="divide-y rounded-xl border">
                                {stats.entries.slice(0, 5).map((entry) => (
                                    <li key={entry.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                                        <time dateTime={entry.workDate} className="text-muted-foreground">{entry.workDate}</time>
                                        <span>{formatFare(entry.fare, lang)}</span>
                                        <span>{formatNumber(entry.distanceKm, lang)} {translate(lang, "km")}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                        {translate(lang, "These totals use trips you entered and are not verified app trip records.")}
                    </p>
                </>
            ) : null}
        </Card>
    );
}
