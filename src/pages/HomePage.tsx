import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { HeroSection } from "@/shared/components/home/HeroSection";
import { AuthCard } from "@/shared/components/home/AuthCard";
import { FeatureGrid } from "@/shared/components/home/FeatureGrid";
import { InfoStatsSection } from "@/shared/components/home/InfoStatsSection";

import { HOME_TEXT } from "@/shared/types/home.content";
import type { Mode, Role } from "@/shared/types/home.types";
import { useAppSelector } from "@/app/hooks";
import type { AuthenticatedRole } from "@/features/auth/components/LoginForm";

export default function HomePage() {
    const navigate = useNavigate();
    const { lang, largeText } = useAppSelector((state) => state.ui);

    const [step, setStep] = useState<1 | 2>(1);
    const [mode, setMode] = useState<Mode | null>(null);
    const [highlightAuth, setHighlightAuth] = useState(false);

    const authRef = useRef<HTMLDivElement | null>(null);

    const text = useMemo(() => HOME_TEXT[lang], [lang]);

    const startAuth = (selectedMode: Mode) => {
        setMode(selectedMode);
        setStep(2);
    };

    const resetAuth = () => {
        setStep(1);
        setMode(null);
    };

    const handleRoleSelect = (role: Role) => {
        if (!mode) return;

        localStorage.setItem("role", role);
        sessionStorage.setItem("auth_mode", mode);

        navigate(`/${role}`);
    };

    const handleAuthenticatedRole = (role: AuthenticatedRole) => {
        localStorage.setItem("role", role);
        sessionStorage.setItem("auth_mode", "login");

        navigate(
            role === "admin" || role === "super_admin" ? "/admin" : `/${role}`,
        );
    };

    const handleGetStarted = () => {
        resetAuth();

        authRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        setHighlightAuth(true);

        setTimeout(() => {
            setHighlightAuth(false);
        }, 1200);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className={`min-h-screen bg-slate-50 text-slate-900 ${
                largeText ? "text-lg" : "text-base"
            }`}
        >
            <main id="main-content">
                {/* Hero */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="mx-auto max-w-6xl px-4 py-6 sm:px-6"
                >
                    <HeroSection
                        text={text}
                        onGetStarted={handleGetStarted}
                        onLearnMore={() =>
                            document
                                .getElementById("features")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    />
                </motion.section>

                {/* Authentication */}
                <motion.section
                    ref={authRef}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: highlightAuth ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.35 }}
                    className="mx-auto max-w-2xl px-4 sm:px-6"
                >
                    <div
                        className={`rounded-2xl border bg-white p-6 shadow-sm transition ${
                            highlightAuth ? "ring-2 ring-emerald-300" : ""
                        }`}
                    >
                        <AuthCard
                            text={text}
                            step={step}
                            mode={mode}
                            onLogin={() => startAuth("login")}
                            onRegister={() => startAuth("register")}
                            onBack={resetAuth}
                            onSelectRole={handleRoleSelect}
                            onAuthenticated={handleAuthenticatedRole}
                        />
                    </div>
                </motion.section>

                {/* Features */}
                <motion.section
                    id="features"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mx-auto mt-12 max-w-6xl px-4 sm:px-6"
                >
                    <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                        <FeatureGrid text={text} />
                    </div>
                </motion.section>

                {/* Information */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mx-auto max-w-6xl px-4 py-12 pb-16 sm:px-6"
                >
                    <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                        <InfoStatsSection text={text} />
                    </div>
                </motion.section>
            </main>
        </motion.div>
    );
}
