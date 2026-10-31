import { Card } from "@/components/ui/card";
import type { TextPack } from "@/shared/types/home.types";

type Props = {
  text: TextPack;
};

/** Formats one informational statistic tile. */
function StatBox({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border border-white/30
        bg-white/20
        backdrop-blur-md
        p-3
      "
    >
      <div className="text-sm text-neutral-500">{label}</div>
      <div className={`text-xl font-bold ${valueClass}`}>{value}</div>
    </div>
  );
}

/** Presents the landing page's short system description and informational metrics. */
export function InfoStatsSection({ text }: Props) {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <Card
        className="
          p-6
          border-white/30
          bg-white/20
          backdrop-blur-lg
          lg:col-span-2
        "
      >
        <h3 className="mb-3 text-lg font-semibold text-neutral-800">
          {text.infoTitle}
        </h3>
        <p className="leading-relaxed text-neutral-600">{text.infoDesc}</p>
      </Card>

      <Card
        className="
          p-6
          border-white/30
          bg-white/20
          backdrop-blur-lg
        "
      >
        <h3 className="mb-4 text-lg font-semibold">System Overview</h3>

        <div className="grid grid-cols-2 gap-3">
          <StatBox label={text.stat1} value="128" />
          <StatBox label={text.stat2} value="9" />
          <StatBox label={text.stat3} value="3" valueClass="text-red-500" />
          <StatBox
            label={text.stat4}
            value="87%"
            valueClass="text-emerald-600"
          />
        </div>
      </Card>
    </section>
  );
}
