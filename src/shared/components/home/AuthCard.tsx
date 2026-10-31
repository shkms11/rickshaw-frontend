import { useState } from "react";
import { ArrowLeft, Bike, Building2, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LoginForm, {
    type AuthenticatedRole,
    type LoginRole,
} from "@/features/auth/components/LoginForm";
import RegistrationForm from "@/features/auth/components/RegistrationForm";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";
import type { TextPack } from "@/shared/types/home.types";

type AuthMode = "login" | "register";
type Props = {
    text: TextPack;
    onAuthenticated: (role: AuthenticatedRole) => void;
};

const roles: Array<{
    id: LoginRole;
    title: keyof Pick<TextPack, "driver" | "owner" | "admin">;
    detail: string;
    icon: typeof UserRound;
}> = [
    {
        id: "driver",
        title: "driver",
        detail: "Share your live GPS location.",
        icon: Bike,
    },
    {
        id: "owner",
        title: "owner",
        detail: "Manage vehicles and view your fleet.",
        icon: Building2,
    },
    {
        id: "admin",
        title: "admin",
        detail: "Review accounts and monitor operations.",
        icon: ShieldCheck,
    },
];

export function AuthCard({ text, onAuthenticated }: Props) {
    const { lang } = useAppSelector((state) => state.ui);
    const [mode, setMode] = useState<AuthMode>("login");
    const [role, setRole] = useState<LoginRole | null>(null);

    function selectMode(nextMode: AuthMode) {
        setMode(nextMode);
        setRole(null);
    }

    return (
        <Card
            id="account"
            className="w-full overflow-hidden rounded-3xl border-slate-200/80 bg-white p-0 shadow-xl shadow-slate-950/[0.08] ring-1 ring-white/80"
        >
            <div className="border-b border-slate-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-700 text-white shadow-md shadow-emerald-900/15">
                        <Bike className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                            {translate(lang, "Rickshaw System")}
                        </p>
                        <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                            {translate(lang, "Your work, in one place")}
                        </h2>
                    </div>
                </div>

                <div
                    className="mt-5 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1"
                    role="group"
                    aria-label={text.chooseAction}
                >
                    {(["login", "register"] as const).map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => selectMode(item)}
                            aria-pressed={mode === item}
                            className={`min-h-11 rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${
                                mode === item
                                    ? "bg-white text-emerald-900 shadow-sm"
                                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                            }`}
                        >
                            {item === "login" ? text.login : text.register}
                        </button>
                    ))}
                </div>
            </div>

            <div
                id="account-panel"
                className="p-5 sm:p-6"
            >
                {role ? (
                    <div className="space-y-5">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="-ml-2"
                            onClick={() => setRole(null)}
                        >
                            <ArrowLeft className="mr-2 size-4" />
                            {text.back}
                        </Button>
                        {mode === "login" ? (
                            <LoginForm
                                role={role}
                                onBack={() => setRole(null)}
                                onSubmit={onAuthenticated}
                            />
                        ) : role === "admin" ? (
                            <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                                {translate(
                                    lang,
                                    "Admin accounts must be created by an authorized administrator.",
                                )}
                            </p>
                        ) : (
                            <RegistrationForm
                                role={role}
                                onBack={() => setRole(null)}
                            />
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-slate-900">
                                {translate(
                                    lang,
                                    mode === "login"
                                        ? "Choose your account"
                                        : "Create an account",
                                )}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {translate(
                                    lang,
                                    mode === "login"
                                        ? "Select your role to continue."
                                        : "Choose driver or owner to get started.",
                                )}
                            </p>
                        </div>
                        <div className="space-y-2">
                            {roles
                                .filter(
                                    (item) =>
                                        mode === "login" ||
                                        item.id !== "admin",
                                )
                                .map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setRole(item.id)}
                                            className="group flex min-h-[72px] w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                                        >
                                            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-white group-hover:text-emerald-700">
                                                <Icon className="size-5" aria-hidden="true" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block font-semibold text-slate-900">
                                                    {text[item.title]}
                                                </span>
                                                <span className="mt-1 block text-sm leading-5 text-slate-500">
                                                    {translate(lang, item.detail)}
                                                </span>
                                            </span>
                                            <span className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-700" aria-hidden="true">
                                                →
                                            </span>
                                        </button>
                                    );
                                })}
                        </div>
                        {mode === "register" && (
                            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                                {translate(
                                    lang,
                                    "New driver and owner accounts need administrator approval before sign-in.",
                                )}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
