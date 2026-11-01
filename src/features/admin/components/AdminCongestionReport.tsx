import { useState, type FormEvent } from "react";
import { Activity, AlertTriangle, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";
import { useLazyGetAdminCongestionReportQuery } from "@/api/adminApi";

export default function AdminCongestionReport() {
    const { lang } = useAppSelector((state) => state.ui);
    const [area, setArea] = useState("");
    const [loadReport, reportQuery] = useLazyGetAdminCongestionReportQuery();
    const report = reportQuery.data;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const query = area.trim();
        if (query.length >= 2) void loadReport(query);
    }

    return (
        <Card className="overflow-hidden">
            <div className="border-b bg-gradient-to-r from-amber-50 via-white to-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white">
                        <Activity className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                        <h2 className="font-semibold">{translate(lang, "Area activity report")}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {translate(lang, "Review recorded trip demand and recent accurate GPS activity by Bangladesh area.")}
                        </p>
                    </div>
                </div>
                <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={submit}>
                    <label className="min-w-0 flex-1">
                        <span className="sr-only">{translate(lang, "Area or district name")}</span>
                        <Input
                            value={area}
                            onChange={(event) => setArea(event.target.value)}
                            placeholder={translate(lang, "e.g. Dhanmondi, Dhaka")}
                            minLength={2}
                            maxLength={100}
                            required
                        />
                    </label>
                    <Button type="submit" disabled={reportQuery.isFetching || area.trim().length < 2}>
                        <Search className="mr-2 size-4" aria-hidden="true" />
                        {translate(lang, reportQuery.isFetching ? "Preparing report..." : "Review area")}
                    </Button>
                </form>
            </div>

            {reportQuery.isError && (
                <p role="alert" className="p-5 text-sm text-destructive">
                    {translate(lang, "Could not load area activity report.")}
                </p>
            )}

            {report && (
                <div className="space-y-4 p-5 sm:p-6">
                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden="true" />
                        <div>
                            <h3 className="font-medium">{report.area}</h3>
                            <p className="text-xs text-muted-foreground">{translate(lang, "Last 7 days")}</p>
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <Metric label="Recorded trips" value={report.matchingTripRecords} />
                        <Metric label="Currently active trip records" value={report.activeTripRecords} />
                        <Metric
                            label="Recent accurate rickshaw GPS"
                            value={report.liveRickshawsWithinArea === null
                                ? translate(lang, "Unavailable")
                                : report.liveRickshawsWithinArea}
                        />
                    </div>
                    {report.lowAccuracyGpsReports > 0 && (
                        <p className="text-xs text-muted-foreground">
                            {report.lowAccuracyGpsReports} {translate(lang, "nearby GPS reports were too imprecise to count.")}
                        </p>
                    )}
                    <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <p>{translate(lang, report.limitation)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{translate(lang, report.driverDirections)}</p>
                </div>
            )}
        </Card>
    );
}

function Metric({ label, value }: { label: string; value: number | string }) {
    const { lang } = useAppSelector((state) => state.ui);
    return (
        <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{translate(lang, label)}</p>
            <p className="mt-1 text-xl font-semibold">{value}</p>
        </div>
    );
}
