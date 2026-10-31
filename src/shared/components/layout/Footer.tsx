import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

export function Footer() {
  const { lang } = useAppSelector((state) => state.ui);

  return (
    <footer className="border-t border-slate-200/60 bg-slate-50/60 px-4 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto flex max-w-7xl flex-col gap-1.5 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left">
        <p className="text-xs text-slate-500 sm:text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-slate-600">Rickshaw System</span>.
          {translate(lang, "All rights reserved.")}
        </p>

        <p className="text-xs text-slate-500 sm:text-sm">
          {translate(lang, "Built for")}{" "}
          <span className="font-medium text-slate-600">
            {translate(lang, "drivers, owners & admins")}
          </span>
        </p>
      </div>
    </footer>
  );
}
