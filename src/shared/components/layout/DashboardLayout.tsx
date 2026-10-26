import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

type Props = {
  title: string;
  children: ReactNode;
};

export default function DashboardLayout({ title, children }: Props) {
  const { lang } = useAppSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border bg-white shadow-sm"
        >
          <div className="p-4 sm:p-6 md:p-8">
            {title && (
              <div className="mb-6 border-b pb-4">
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {translate(lang, title)}
                </h1>
              </div>
            )}

            {children}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
