import { useState } from "react";
import { Button } from "@/components/ui/button";
import RegistrationForm from "@/features/auth/components/RegistrationForm";
import LoginForm, {
    type AuthenticatedRole,
} from "@/features/auth/components/LoginForm";

import type { Mode, Role, TextPack } from "@/shared/types/home.types";

type Props = {
    text: TextPack;
    step: 1 | 2;
    mode: Mode | null;
    onLogin: () => void;
    onRegister: () => void;
    onBack: () => void;
    onSelectRole: (role: Role) => void;
    onAuthenticated: (role: AuthenticatedRole) => void;
};

const roleStyles: Record<Role, string> = {
    driver: "bg-emerald-700 text-white hover:bg-emerald-800",
    owner: "bg-white border border-emerald-200 text-emerald-900 hover:bg-emerald-50",
    admin: "bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100",
};

function RoleButton({
    label,
    role,
    onClick,
}: {
    label: string;
    role: Role;
    onClick: () => void;
}) {
    return (
        <Button
            onClick={onClick}
            className={`h-14 w-full rounded-xl font-semibold ${roleStyles[role]}`}
        >
            {label}
        </Button>
    );
}

export function AuthCard({
    text,
    step,
    mode,
    onLogin,
    onRegister,
    onBack,
    onSelectRole,
    onAuthenticated,
}: Props) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedLoginRole, setSelectedLoginRole] = useState<Role | null>(
        null,
    );

    if (mode === "register" && selectedRole) {
        return (
            <div className="p-6 sm:p-7">
                <RegistrationForm
                    role={selectedRole}
                    onBack={() => setSelectedRole(null)}
                />
            </div>
        );
    }

    if (mode === "login" && selectedLoginRole) {
        return (
            <div className="p-6 sm:p-7">
                <LoginForm
                    role={selectedLoginRole}
                    onBack={() => setSelectedLoginRole(null)}
                    onSubmit={onAuthenticated}
                />
            </div>
        );
    }

    const isRoleStep = step === 2;

    const handleRoleSelect = (role: Role) => {
        if (mode === "register") {
            setSelectedRole(role);
            return;
        }

        if (mode === "login") {
            setSelectedLoginRole(role);
            return;
        }

        onSelectRole(role);
    };

    return (
        <div className="p-6 sm:p-7">
            <div className="space-y-6 text-center">
                <h3 className="text-xl font-semibold text-slate-800">
                    {isRoleStep ? text.chooseRole : text.chooseAction}
                </h3>

                {!isRoleStep && (
                    <div className="grid gap-3">
                        <Button
                            className="h-12 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
                            onClick={onLogin}
                        >
                            {text.login}
                        </Button>

                        <Button
                            variant="outline"
                            className="h-12 rounded-xl"
                            onClick={onRegister}
                        >
                            {text.register}
                        </Button>
                    </div>
                )}

                {isRoleStep && (
                    <>
                        <p className="text-sm text-muted-foreground">
                            {mode === "login" ? text.login : text.register}
                        </p>

                        <div className="grid gap-3">
                            <RoleButton
                                label={text.driver}
                                role="driver"
                                onClick={() => handleRoleSelect("driver")}
                            />

                            <RoleButton
                                label={text.owner}
                                role="owner"
                                onClick={() => handleRoleSelect("owner")}
                            />

                            {mode !== "register" && (
                                <RoleButton
                                    label={text.admin}
                                    role="admin"
                                    onClick={() => handleRoleSelect("admin")}
                                />
                            )}
                        </div>

                        <Button
                            variant="outline"
                            className="h-11 w-full rounded-xl"
                            onClick={onBack}
                        >
                            {text.back}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
