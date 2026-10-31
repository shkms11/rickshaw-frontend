import type { ReactNode } from "react";
import { LayoutDashboard } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

type Props = {
  title: string;
  children: ReactNode;
};

/** Provides dashboard page framing, translated heading, and reduced-motion-aware entrance. */
export default function DashboardLayout({ title, children }: Props) {
  const { lang } = useAppSelector((state) => state.ui);
  const reduceMotion = useReducedMotion();

  return (
    <div className="dashboard-theme relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-36 -top-32 size-[28rem] rounded-full bg-emerald-100/45 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-[30rem] rounded-full bg-sky-100/35 blur-3xl" />
      </div>
      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-w-0"
        >
          <div>
            {title && (
              <header className="mb-6 flex items-center gap-3 border-b border-slate-200/80 pb-5 sm:mb-7 sm:gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-emerald-100 bg-white text-emerald-800 shadow-sm sm:size-14">
                  <LayoutDashboard className="size-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                    {translate(lang, "Dashboard")}
                  </p>
                  <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                  {translate(lang, title)}
                  </h1>
                </div>
              </header>
            )}

            <div className="space-y-6">{children}</div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
