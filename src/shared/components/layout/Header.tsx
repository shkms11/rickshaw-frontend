import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages, TextCursorInput, LogOut, Home } from "lucide-react";
import logo from "@/assets/logo.jpg";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleLang, toggleLargeText } from "@/store/uiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { translate } from "@/shared/i18n";

// Optional bilingual page title.
type Props = {
    title?: {
        en: string;
        bn: string;
    };
};

export function Header({ title }: Props) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Get language and text-size settings from Redux.
    const { lang, largeText } = useAppSelector((state) => state.ui);

    // Control header visibility while scrolling.
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);

    // Hide on scroll down; show on scroll up.
    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.classList.toggle("large-text", largeText);
    }, [lang, largeText]);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            setHidden(currentY > lastScrollY.current && currentY > 80);
            lastScrollY.current = currentY;
        };

        window.addEventListener("scroll", handleScroll);

        // Remove listener when component unmounts.
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Select the page title or use a language-based default.
    const pageTitle =
        title?.[lang] ?? translate(lang, "Rickshaw System");

    // Show logout only on driver, owner, and admin routes.
    const showLogout = ["/driver", "/owner", "/admin"].some((path) =>
        location.pathname.startsWith(path),
    );

    // Clear client-side user data and return home.
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        sessionStorage.clear();
        navigate("/");
    };

    const handleHome = () => {
        if (showLogout) {
            const confirmed = window.confirm(
                lang === "bn"
                    ? "হোমে ফিরলে আপনি লগআউট হবেন। চালিয়ে যাবেন?"
                    : "Going home will log you out. Continue?",
            );
            if (!confirmed) return;
            handleLogout();
            return;
        }
        navigate("/");
    };

    // Adjust button size for accessibility.
    const buttonSize = largeText ? "h-12 px-4 text-lg" : "h-10 px-3 text-sm";

    return (
        <header
            // Keep header sticky and animate hide/show.
            className={`sticky top-0 z-50 bg-slate-50/95 px-3 pt-3 backdrop-blur-sm transition-transform duration-300 sm:px-4 sm:pt-4 ${
                hidden ? "-translate-y-full" : "translate-y-0"
            }`}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border bg-white px-3 py-3 shadow-sm sm:px-5">
                {/* Home button, logo, and current page title. */}
                <div className="flex min-w-0 items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleHome}
                        aria-label={translate(lang, "Home")}
                        className="shrink-0"
                    >
                        <Home className="h-5 w-5" />
                    </Button>

                    <img
                        src={logo}
                        alt="Rickshaw Logo"
                        className="h-9 w-9 shrink-0 rounded-lg object-contain"
                    />

                    <h1
                        className={`truncate font-semibold tracking-tight text-emerald-800 ${
                            largeText
                                ? "text-xl sm:text-2xl"
                                : "text-lg sm:text-xl"
                        }`}
                    >
                        {pageTitle}
                    </h1>
                </div>

                {/* Language, accessibility, and logout controls. */}
                <div className="flex shrink-0 items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className={buttonSize}
                        aria-label={lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
                        onClick={() => {
                            const nextLang = lang === "bn" ? "en" : "bn";
                            window.localStorage.setItem("lang", nextLang);
                            dispatch(toggleLang());
                        }}
                    >
                        <Languages className="mr-2 h-4 w-4" />
                        {lang === "bn" ? "EN" : "বাংলা"}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className={buttonSize}
                        aria-label={lang === "bn" ? "বড় লেখা চালু বা বন্ধ করুন" : "Toggle larger text"}
                        onClick={() => {
                            window.localStorage.setItem(
                                "largeText",
                                String(!largeText),
                            );
                            dispatch(toggleLargeText());
                        }}
                    >
                        <TextCursorInput className="mr-2 h-4 w-4" />
                        A+
                    </Button>

                    {/* Display logout only on relevant routes. */}
                    {showLogout && (
                        <Button
                            type="button"
                            variant="outline"
                            className={`${buttonSize} border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700`}
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            {translate(lang, "Logout")}
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
