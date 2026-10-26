import { Card } from "@/components/ui/card";
import { Activity, MapPin, Navigation, Shield } from "lucide-react";
import type { TextPack } from "@/shared/types/home.types";

type Props = {
  text: TextPack;
};

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
      className="rounded-2xl border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="text-emerald-700">{icon}</div>
      <h3 className="font-semibold text-neutral-800">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-600">{desc}</p>
    </Card>
  );
}

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
