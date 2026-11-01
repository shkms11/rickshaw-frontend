import { HeartPulse } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/app/hooks";
import { useGetAdminNoticeBoardQuery } from "@/api/adminApi";
import { translate } from "@/shared/i18n";

const defaultTips = [
    "Drink water regularly, especially during hot weather.",
    "Take short breaks to stretch and rest when it is safe.",
    "If you feel unwell, stop in a safe place and ask for help.",
];

export default function DriverWellbeing() {
    const { lang } = useAppSelector((state) => state.ui);
    const { data, isError } = useGetAdminNoticeBoardQuery("driver-health");

    return (
        <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-sm">
            <CardHeader className="border-b border-emerald-100 bg-emerald-50/70 pb-4">
                <CardTitle className="flex items-center gap-3 text-base">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-sm">
                        <HeartPulse className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                        <span className="block font-semibold text-emerald-950">
                            {translate(lang, "Driver wellbeing")}
                        </span>
                        <span className="mt-1 block text-sm font-normal text-emerald-900/75">
                            {translate(lang, "Your health matters. Take care of yourself on every trip.")}
                        </span>
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <ul className="grid gap-2 sm:grid-cols-3">
                    {(data?.items ?? defaultTips).map((tip, index) => (
                        <li key={`${index}-${tip}`} className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-white/80 p-3 text-sm text-slate-700">
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800" aria-hidden="true">
                                {index + 1}
                            </span>
                            <span className="leading-relaxed">{translate(lang, tip)}</span>
                        </li>
                    ))}
                </ul>
                {isError && (
                    <p role="alert" className="mt-3 text-xs text-destructive">
                        {translate(lang, "Could not load driver wellbeing tips.")}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
