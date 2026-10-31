import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";
import { apiBaseUrl } from "@/shared/api/apiBaseUrl";

export type LoginRole = "driver" | "owner" | "admin";
export type AuthenticatedRole = LoginRole | "super_admin";

type LoginFormProps = {
    role: LoginRole;
    onBack?: () => void;
    onSubmit?: (role: AuthenticatedRole) => void;
};

const roleStyles: Record<LoginRole, string> = {
    driver: "bg-emerald-700 hover:bg-emerald-800",
    owner: "bg-emerald-700 hover:bg-emerald-800",
    admin: "bg-amber-600 hover:bg-amber-700",
};

const roleTitles: Record<LoginRole, string> = {
    driver: "Driver Login",
    owner: "Owner Login",
    admin: "Admin Login",
};

/** Sends credentials to the auth API, validates the returned role, and persists the session. */
export default function LoginForm({ role, onBack, onSubmit }: LoginFormProps) {
    const { lang } = useAppSelector((state) => state.ui);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${apiBaseUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identifier: identifier.trim(),
                    password,
                }),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (
                    response.status === 403 &&
                    data.code === "ACCOUNT_PENDING_APPROVAL"
                ) {
                    throw new Error(
                        "Your account is pending administrator approval. Please try again after it has been approved.",
                    );
                }

                if (
                    response.status === 403 &&
                    data.code === "ACCOUNT_REJECTED"
                ) {
                    throw new Error(
                        "Your account was not approved. Please contact an administrator.",
                    );
                }

                throw new Error(data.message || "Login failed.");
            }

            if (!data.token || !data.user?.role) {
                throw new Error(
                    "The server returned an invalid login response.",
                );
            }

            const authenticatedRole = String(data.user.role).toLowerCase();
            if (
                !["driver", "owner", "admin", "super_admin"].includes(
                    authenticatedRole,
                )
            ) {
                throw new Error("Your account has an unsupported role.");
            }

            if (
                authenticatedRole !== role &&
                !(role === "admin" && authenticatedRole === "super_admin")
            ) {
                throw new Error("This account does not match the selected role.");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("role", authenticatedRole);
            // The parent uses the verified role to navigate to its dashboard.
            onSubmit?.(authenticatedRole as AuthenticatedRole);
        } catch (error) {
            setMessage(
                translate(
                    lang,
                    error instanceof Error
                        ? error.message
                        : "Could not connect to the server.",
                ),
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-md space-y-5"
        >
            <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-slate-800">
                    {translate(lang, roleTitles[role])}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {translate(lang, "Enter your details to access your account.")}
                </p>
            </div>

            <div className="space-y-2">
                <label htmlFor="login-identifier">{translate(lang, "Email or Bangladesh phone")}</label>
                <Input
                    id="login-identifier"
                    type="text"
                    inputMode="text"
                    autoComplete="username"
                    placeholder={translate(lang, "Email or +8801...")}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="login-password">{translate(lang, "Password")}</label>

                <div className="relative">
                    <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={translate(lang, "Enter password")}
                        className="pr-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="button"
                        aria-label={
                            translate(
                                lang,
                                showPassword ? "Hide password" : "Show password",
                            )
                        }
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((previous) => !previous)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                        {showPassword ? (
                            <EyeOff className="size-5" />
                        ) : (
                            <Eye className="size-5" />
                        )}
                    </button>
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className={`h-12 w-full text-white ${roleStyles[role]}`}
            >
                {translate(lang, loading ? "Logging in..." : "Login")}
            </Button>

            {message && (
                <p role="alert" className="text-sm text-destructive">
                    {message}
                </p>
            )}

            {onBack && (
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onBack}
                >
                    <ArrowLeft className="mr-2 size-4" />
                    {translate(lang, "Back")}
                </Button>
            )}
        </form>
    );
}
