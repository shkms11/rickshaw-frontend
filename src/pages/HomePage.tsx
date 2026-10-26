import { useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowDown, Bike, CheckCircle2, MapPinned, ShieldCheck } from "lucide-react";
import { AuthCard } from "@/shared/components/home/AuthCard";
import { FeatureGrid } from "@/shared/components/home/FeatureGrid";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/hooks";
import { HOME_TEXT } from "@/shared/types/home.content";
import { getAuthenticatedRole } from "@/shared/authSession";
import type { AuthenticatedRole } from "@/features/auth/components/LoginForm";

export default function HomePage() {
    const navigate = useNavigate();
    const { lang, largeText } = useAppSelector((state) => state.ui);
    const authRef = useRef<HTMLElement>(null);
    const text = HOME_TEXT[lang];
    const role = getAuthenticatedRole();

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
            className={`overflow-hidden bg-slate-50 text-slate-900 ${largeText ? "text-lg" : ""}`}
        >
            <section className="relative isolate">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.14),_transparent_45%),linear-gradient(to_bottom,_white,_#f8fafc)]" />
                <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-16">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-emerald-800 shadow-sm">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            {text.heroBadge}
                        </div>
                        <div className="space-y-4">
                            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                                {text.heroTitle}
                                <span className="mt-2 block text-emerald-700">
                                    {text.heroHighlight}
                                </span>
                            </h1>
                            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                                {text.heroDesc}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                size="lg"
                                className="h-12 rounded-xl bg-emerald-700 px-5 text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-800"
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
                                className="h-12 rounded-xl border-slate-300 bg-white px-5"
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
                        <div className="grid max-w-xl gap-3 pt-2 sm:grid-cols-3">
                            {[
                                { icon: MapPinned, label: text.feature1Title },
                                { icon: Bike, label: text.feature3Title },
                                { icon: ShieldCheck, label: text.feature4Title },
                            ].map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-700"
                                >
                                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                                    <Icon className="size-4 shrink-0 text-emerald-700" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <section
                        ref={authRef}
                        aria-label={text.chooseAction}
                        className="scroll-mt-24"
                    >
                        <AuthCard
                            text={text}
                            onAuthenticated={handleAuthenticatedRole}
                        />
                    </section>
                </div>
            </section>

            <section
                id="features"
                className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-12 sm:px-6 sm:pb-16"
            >
                <div className="mb-5 max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                        {text.secondary}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        {text.infoTitle}
                    </h2>
                    <p className="mt-2 leading-6 text-slate-600">
                        {text.infoDesc}
                    </p>
                </div>
                <FeatureGrid text={text} />
            </section>
        </main>
    );
}
