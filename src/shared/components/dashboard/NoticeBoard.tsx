import { Bell } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

type NoticeBoardProps = {
  audience: "driver" | "owner" | "admin";
};

const notices = {
  driver: [
    "Turn on GPS sharing while working so your assigned vehicle can be tracked.",
    "Use the lost-rickshaw alert immediately if your assigned vehicle is missing.",
    "Send account or vehicle problems to the admin team from this dashboard.",
  ],
  owner: [
    "Search approved drivers by phone number before assigning a vehicle.",
    "A vehicle removal request takes effect only after admin approval.",
    "Lost-rickshaw alerts and admin decisions appear in your fleet.",
  ],
  admin: [
    "Review vehicle removal requests and lost-rickshaw alerts promptly.",
    "Use fleet controls to update vehicle and driver statuses.",
    "Registration approvals and user reports are available below.",
  ],
} satisfies Record<NoticeBoardProps["audience"], string[]>;

export default function NoticeBoard({ audience }: NoticeBoardProps) {
  const { lang } = useAppSelector((state) => state.ui);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="size-4 text-emerald-700" aria-hidden="true" />
          {translate(lang, "Notice board")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {notices[audience].map((notice) => (
            <li key={notice} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
              <span>{translate(lang, notice)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}