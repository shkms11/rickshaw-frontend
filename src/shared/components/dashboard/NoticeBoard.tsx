import { useState } from "react";
import { Bell } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";
import {
  useGetAdminNoticeBoardQuery,
  useGetAnnouncementsQuery,
  useUpdateAdminNoticeBoardMutation,
  type NoticeAudience,
} from "@/api/adminApi";

type NoticeBoardProps = {
  audience: NoticeAudience;
};

const notices = {
  driver: [
    "Turn on GPS sharing while working so your assigned vehicle can be tracked.",
    "Use the lost-rickshaw alert immediately if your assigned vehicle is missing.",
    "Send account or vehicle problems to the admin team from this dashboard.",
  ],
  "driver-health": [
    "Drink water regularly, especially during hot weather.",
    "Take short breaks to stretch and rest when it is safe.",
    "If you feel unwell, stop in a safe place and ask for help.",
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
} satisfies Record<NoticeAudience, string[]>;

/** Shows static role-specific operating reminders in the currently selected language. */
export default function NoticeBoard({ audience }: NoticeBoardProps) {
  const { lang } = useAppSelector((state) => state.ui);
  const { data, isError } = useGetAnnouncementsQuery();
  const isSuperAdmin = audience === "admin" && localStorage.getItem("role") === "super_admin";
  const [selectedAudience, setSelectedAudience] = useState<NoticeAudience>(audience);
  const boardAudience: NoticeAudience = isSuperAdmin ? selectedAudience : audience;
  const { data: board, isError: isBoardError, isLoading: isBoardLoading } = useGetAdminNoticeBoardQuery(boardAudience);
  const [updateBoard, { isLoading: isSaving }] = useUpdateAdminNoticeBoardMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const announcements = data?.announcements ?? [];
  const boardItems = board?.items ?? notices[boardAudience];

  function startEditing() {
    setDraft(boardItems.join("\n"));
    setError("");
    setStatus("");
    setIsEditing(true);
  }

  async function saveNoticeBoard() {
    const items = draft.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    if (!items.length || items.length > 12 || items.some((item) => item.length > 300)) {
      setError(translate(lang, "Enter 1 to 12 notices, with each notice no longer than 300 characters."));
      return;
    }
    setError("");
    setStatus("");
    try {
      await updateBoard({ audience: boardAudience, items }).unwrap();
      setIsEditing(false);
      setStatus(translate(lang, "Notice board saved."));
    } catch (requestError) {
      setError(translate(lang, getErrorMessage(requestError)));
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="size-4 text-emerald-700" aria-hidden="true" />
          {translate(lang, "Notice board")}
        </CardTitle>
        {isSuperAdmin && !isEditing && (
          <div className="flex items-center gap-2">
            <label htmlFor="notice-board-audience" className="sr-only">
              {translate(lang, "Dashboard notices")}
            </label>
            <select
              id="notice-board-audience"
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={selectedAudience}
              onChange={(event) => {
                setSelectedAudience(event.target.value as NoticeAudience);
                setStatus("");
                setError("");
              }}
            >
              <option value="admin">{translate(lang, "Admin dashboard")}</option>
              <option value="owner">{translate(lang, "Owner dashboard")}</option>
              <option value="driver">{translate(lang, "Driver dashboard")}</option>
              <option value="driver-health">{translate(lang, "Driver wellbeing")}</option>
            </select>
            <Button type="button" size="sm" variant="outline" onClick={startEditing}>
              {translate(lang, "Edit notices")}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isBoardLoading ? (
          <p className="text-sm text-muted-foreground">{translate(lang, "Loading notices...")}</p>
        ) : isEditing ? (
          <div className="space-y-3">
            <label htmlFor="admin-notice-items" className="text-sm text-muted-foreground">
              {translate(lang, "One notice per line (up to 12 notices).")}
            </label>
            <Textarea
              id="admin-notice-items"
              rows={5}
              maxLength={4000}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div className="flex gap-2">
              <Button type="button" disabled={isSaving} className="bg-emerald-700 text-white hover:bg-emerald-800" onClick={() => void saveNoticeBoard()}>
                {translate(lang, isSaving ? "Saving..." : "Save notices")}
              </Button>
              <Button type="button" variant="outline" disabled={isSaving} onClick={() => setIsEditing(false)}>
                {translate(lang, "Cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {boardItems.map((notice, index) => (
              <li key={`${index}-${notice}`} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                <span>{translate(lang, notice)}</span>
              </li>
            ))}
          </ul>
        )}
        {isBoardError && (
          <p role="alert" className="mt-3 text-xs text-destructive">
            {translate(lang, "Could not load the notice board.")}
          </p>
        )}
        {status && <p role="status" className="mt-3 text-xs text-emerald-700">{status}</p>}
        {error && <p role="alert" className="mt-3 text-xs text-destructive">{error}</p>}
        {announcements.length > 0 && (
          <div className="mt-4 space-y-3 border-t pt-4">
            {announcements.map((announcement) => (
              <article key={announcement.id} className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                <h3 className="text-sm font-semibold text-slate-900">{announcement.title}</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{announcement.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {announcement.createdBy.name} · {new Date(announcement.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        )}
        {isError && (
          <p role="alert" className="mt-3 text-xs text-destructive">
            {translate(lang, "Could not load updates.")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }
  return "Could not update the admin notice board.";
}