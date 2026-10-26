import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

export function Footer() {
  const { lang } = useAppSelector((state) => state.ui);

  return (
    <footer className="px-4 pb-4 pt-6 sm:px-6 sm:pb-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t px-2 pt-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-emerald-700">Rickshaw System</span>.
          {translate(lang, "All rights reserved.")}
        </p>

        <p className="text-sm text-muted-foreground">
          {translate(lang, "Built for")}{" "}
          <span className="font-medium text-slate-700">
            {translate(lang, "drivers, owners & admins")}
          </span>
        </p>
      </div>
    </footer>
  );
}
