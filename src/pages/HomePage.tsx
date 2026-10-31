import { useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
    ArrowDown,
    Bike,
    CheckCircle2,
    MapPinned,
    ShieldCheck,
} from "lucide-react";
import { AuthCard } from "@/shared/components/home/AuthCard";
import { FeatureGrid } from "@/shared/components/home/FeatureGrid";
import { RickshawStory } from "@/shared/components/home/RickshawStory";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/hooks";
import { HOME_TEXT } from "@/shared/types/home.content";
import { getAuthenticatedRole } from "@/shared/authSession";
import type { AuthenticatedRole } from "@/features/auth/components/LoginForm";

/** Shows the bilingual landing/auth experience and routes signed-in users to their dashboard. */
export default function HomePage() {
    const navigate = useNavigate();
    const { lang } = useAppSelector((state) => state.ui);
    const authRef = useRef<HTMLElement>(null);
    const text = HOME_TEXT[lang];
    const role = getAuthenticatedRole();

    // Keep an existing valid session out of the public sign-in screen.
    if (role) {
        return (
            <Navigate
                to={
                    role === "admin" || role === "super_admin"
                        ? "/admin"
                        : `/${role}`
                }
                replace
            />
        );
    }

    function handleAuthenticatedRole(authenticatedRole: AuthenticatedRole) {
        // LoginForm persists the session first; navigation then opens its role dashboard.
        navigate(
            authenticatedRole === "admin" ||
                authenticatedRole === "super_admin"
                ? "/admin"
                : `/${authenticatedRole}`,
        );
    }

    return (
        <main
            id="main-content"
            className="overflow-hidden bg-slate-50 text-slate-900"
        >
            <section className="relative isolate overflow-hidden border-b border-slate-200/70">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_10%,_rgba(16,185,129,0.16),_transparent_38%),radial-gradient(ellipse_at_90%_75%,_rgba(14,165,233,0.08),_transparent_35%),linear-gradient(to_bottom,_white,_#f8fafc)]" />
                <div className="pointer-events-none absolute -right-32 top-12 -z-10 size-96 rounded-full border border-emerald-900/[0.04]" />
                <div className="pointer-events-none absolute -right-20 top-24 -z-10 size-72 rounded-full border border-emerald-900/[0.04]" />
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-20">
                    <div className="space-y-7">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/85 px-3.5 py-2 text-sm font-semibold text-emerald-800 shadow-sm shadow-emerald-950/[0.03] backdrop-blur">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50 motion-reduce:animate-none" />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
                            </span>
                            {text.heroBadge}
                        </div>
                        <div className="space-y-5">
                            <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-[4.25rem]">
                                {text.heroTitle}
                                <span className="mt-2 block text-emerald-700 [text-wrap:balance]">
                                    {text.heroHighlight}
                                </span>
                            </h1>
                            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                                {text.heroDesc}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                size="lg"
                                className="h-12 rounded-xl bg-emerald-700 px-5 text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-xl"
                                onClick={() =>
                                    authRef.current?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "center",
                                    })
                                }
                            >
                                {text.primary}
                                <ArrowDown className="ml-2 size-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="h-12 rounded-xl border-slate-300/80 bg-white/80 px-5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white"
                                onClick={() =>
                                    document
                                        .getElementById("features")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                        })
                                }
                            >
                                {text.secondary}
                            </Button>
                        </div>
                        <div className="grid max-w-2xl gap-2 pt-1 sm:grid-cols-3">
                            {[
                                { icon: MapPinned, label: text.feature1Title },
                                { icon: Bike, label: text.feature3Title },
                                { icon: ShieldCheck, label: text.feature4Title },
                            ].map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex min-h-12 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/65 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-950/[0.02] backdrop-blur"
                                >
                                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                                        <Icon className="size-4" aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0 leading-snug">{label}</span>
                                    <CheckCircle2 className="ml-auto size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <section
                        ref={authRef}
                        aria-label={text.chooseAction}
                        className="scroll-mt-24 lg:pl-2"
                    >
                        <AuthCard
                            text={text}
                            onAuthenticated={handleAuthenticatedRole}
                        />
                    </section>
                </div>
            </section>

            <RickshawStory text={text} />

            <section
                id="features"
                aria-labelledby="features-title"
                className="relative scroll-mt-24 border-t border-slate-200/60 bg-slate-50/50"
            >
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
                    <div className="mb-6 max-w-2xl sm:mb-7">
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800 sm:text-sm">
                            <span className="size-1.5 rounded-full bg-emerald-600/80" />
                            {text.featuresEyebrow}
                        </p>
                        <h2
                            id="features-title"
                            className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl"
                        >
                            {text.infoTitle}
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                            {text.infoDesc}
                        </p>
                    </div>
                    <FeatureGrid text={text} />
                </div>
            </section>
        </main>
    );
}
