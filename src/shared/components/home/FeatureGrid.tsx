import { Card } from "@/components/ui/card";
import { Activity, MapPin, Navigation, Shield } from "lucide-react";
import type { TextPack } from "@/shared/types/home.types";

type Props = {
  text: TextPack;
};

/** Displays one translated product capability in a consistent card. */
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card
      className="group relative h-full overflow-hidden rounded-xl border-slate-200/70 bg-white/80 p-4 shadow-none transition-colors duration-200 hover:border-emerald-200 hover:bg-white motion-reduce:transition-none sm:p-5"
    >
      <div className="mb-4 grid size-9 place-items-center rounded-lg bg-emerald-50/80 text-emerald-700 transition-colors group-hover:bg-emerald-100">
        {icon}
      </div>
      <h3 className="text-sm font-semibold tracking-tight text-slate-800 sm:text-base">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{desc}</p>
    </Card>
  );
}

/** Groups the four headline capabilities using the active bilingual text pack. */
export function FeatureGrid({ text }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <FeatureCard
        icon={<MapPin className="h-5 w-5" />}
        title={text.feature1Title}
        desc={text.feature1Desc}
      />
      <FeatureCard
        icon={<Activity className="h-5 w-5" />}
        title={text.feature2Title}
        desc={text.feature2Desc}
      />
      <FeatureCard
        icon={<Navigation className="h-5 w-5" />}
        title={text.feature3Title}
        desc={text.feature3Desc}
      />
      <FeatureCard
        icon={<Shield className="h-5 w-5" />}
        title={text.feature4Title}
        desc={text.feature4Desc}
      />
    </section>
  );
}
