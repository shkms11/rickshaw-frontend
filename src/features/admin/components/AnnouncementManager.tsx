import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetManagedAnnouncementsQuery,
  useGetNoticeOwnersQuery,
  useGetNoticeRecipientsQuery,
  usePublishAnnouncementMutation,
  useRemoveAnnouncementMutation,
  useUpdateAnnouncementMutation,
  type Announcement,
  type CreateAnnouncementParams,
} from "@/api/adminApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

type Audience = CreateAnnouncementParams["audience"];
const allowedAudiences: Audience[] = ["OWNER", "DRIVER"];

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
  return "Could not save this update.";
}

function getCurrentUserId() {
  try {
    const user: unknown = JSON.parse(localStorage.getItem("user") ?? "null");
    return typeof user === "object" && user !== null && "id" in user && typeof user.id === "string"
      ? user.id
      : "";
  } catch {
    return "";
  }
}

export default function AnnouncementManager() {
  const { lang } = useAppSelector((state) => state.ui);
  const isSuperAdmin = localStorage.getItem("role") === "super_admin";
  const [audience, setAudience] = useState<Audience>("DRIVER");
  const [form, setForm] = useState({
    title: "",
    message: "",
    targetUserId: "",
    ownerId: "",
  });
  const { data: ownersData, isError: ownersError } = useGetNoticeOwnersQuery();
  const { data: recipientsData, isError: recipientsError } = useGetNoticeRecipientsQuery({
    role: audience,
    ...(audience !== "ADMIN" && form.ownerId ? { ownerId: form.ownerId } : {}),
  });
  const { data: managedData, isError: noticesError } = useGetManagedAnnouncementsQuery();
  const [publish, publishState] = usePublishAnnouncementMutation();
  const [updateAnnouncement, updateState] = useUpdateAnnouncementMutation();
  const [removeAnnouncement, removeState] = useRemoveAnnouncementMutation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const owners = ownersData?.owners ?? [];
  const recipients = recipientsData?.recipients ?? [];
  const announcements = managedData?.announcements ?? [];
  const isSaving = publishState.isLoading || updateState.isLoading || removeState.isLoading;
  const currentUserId = getCurrentUserId();

  function reset() {
    setForm({ title: "", message: "", targetUserId: "", ownerId: "" });
    setEditingId(null);
  }

  function startEditing(announcement: Announcement) {
    setEditingId(announcement.id);
    setAudience(announcement.audience as Audience);
    setForm({
      title: announcement.title,
      message: announcement.message,
      targetUserId: announcement.targetUserId ?? "",
      ownerId: announcement.ownerId ?? "",
    });
    setError("");
    setStatus("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    const payload: CreateAnnouncementParams = {
      ...form,
      audience,
      targetUserId: form.targetUserId || null,
      ownerId: audience === "ADMIN" ? null : form.ownerId || null,
    };
    try {
      if (editingId) {
        await updateAnnouncement({ ...payload, announcementId: editingId }).unwrap();
        setStatus(translate(lang, "Update saved."));
      } else {
        await publish(payload).unwrap();
        setStatus(translate(lang, "Update published."));
      }
      reset();
    } catch (requestError) {
      setError(translate(lang, getErrorMessage(requestError)));
    }
  }

  async function remove(id: string) {
    setError("");
    setStatus("");
    try {
      await removeAnnouncement(id).unwrap();
      if (editingId === id) reset();
      setStatus(translate(lang, "Update removed."));
    } catch (requestError) {
      setError(translate(lang, getErrorMessage(requestError)));
    }
  }

  return (
    <Card className="space-y-5 p-5 sm:p-6">
      <div>
        <h2 className="font-semibold">{translate(lang, "Dashboard updates")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {translate(lang, "Post a note to a role or send it directly to one person.")}
        </p>
      </div>
      <form onSubmit={(event) => void submit(event)} className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="announcement-audience">{translate(lang, "Send to role")}</Label>
          <select
            id="announcement-audience"
            value={audience}
            onChange={(event) => {
              const nextAudience = event.target.value as Audience;
              setAudience(nextAudience);
              setForm((current) => ({
                ...current,
                targetUserId: "",
                ...(nextAudience === "ADMIN" ? { ownerId: "" } : {}),
              }));
            }}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {isSuperAdmin && <option value="ADMIN">{translate(lang, "Admins")}</option>}
            {allowedAudiences.map((role) => (
              <option key={role} value={role}>{translate(lang, role === "DRIVER" ? "Drivers" : "Owners")}</option>
            ))}
          </select>
        </div>
        {audience !== "ADMIN" && (
          <div className="grid gap-2">
            <Label htmlFor="announcement-owner">{translate(lang, "Owner scope")}</Label>
            <select
              id="announcement-owner"
              value={form.ownerId}
              onChange={(event) => setForm((current) => ({
                ...current,
                ownerId: event.target.value,
                targetUserId: "",
              }))}
              required={!isSuperAdmin}
              disabled={ownersError}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">{translate(lang, isSuperAdmin ? "All owners" : "Select an owner")}</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>{owner.user.name}</option>
              ))}
            </select>
          </div>
        )}
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="announcement-recipient">{translate(lang, "Person (leave blank to send to everyone in scope)")}</Label>
          <select
            id="announcement-recipient"
            value={form.targetUserId}
            onChange={(event) => setForm((current) => ({ ...current, targetUserId: event.target.value }))}
            disabled={recipientsError}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">{translate(lang, "Everyone in selected audience")}</option>
            {recipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.name}{recipient.phone ? ` · ${recipient.phone}` : ""}
              </option>
            ))}
          </select>
          {recipientsError && <p role="alert" className="text-xs text-destructive">{translate(lang, "Could not load recipients.")}</p>}
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="announcement-title">{translate(lang, "Title")}</Label>
          <Input id="announcement-title" maxLength={120} required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="announcement-message">{translate(lang, "Message")}</Label>
          <Textarea id="announcement-message" maxLength={2000} required rows={3} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} />
        </div>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit" disabled={isSaving || (audience !== "ADMIN" && !isSuperAdmin && !form.ownerId)} className="bg-emerald-700 text-white hover:bg-emerald-800">
            {translate(lang, isSaving ? "Saving..." : editingId ? "Save update" : "Publish update")}
          </Button>
          {editingId && <Button type="button" variant="outline" onClick={reset}>{translate(lang, "Cancel")}</Button>}
        </div>
      </form>
      {status && <p role="status" className="text-sm text-emerald-700">{status}</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {noticesError ? (
        <p role="alert" className="text-sm text-destructive">{translate(lang, "Could not load dashboard updates.")}</p>
      ) : (
        <div className="space-y-2 border-t pt-4">
          <h3 className="text-sm font-semibold">{translate(lang, "Recent updates")}</h3>
          {announcements.map((announcement) => {
            const canManage = isSuperAdmin || announcement.createdById === currentUserId;
            return (
              <article key={announcement.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="font-medium">{announcement.title}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{announcement.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {translate(lang, announcement.audience)} · {announcement.targetUserId ? translate(lang, "Direct") : translate(lang, "Group")} · {new Date(announcement.createdAt).toLocaleString()}
                  </p>
                </div>
                {canManage && (
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => startEditing(announcement)}>
                      {translate(lang, "Edit")}
                    </Button>
                    <Button type="button" size="sm" variant="destructive" disabled={isSaving} onClick={() => void remove(announcement.id)}>
                      {translate(lang, "Remove")}
                    </Button>
                  </div>
                )}
              </article>
            );
          })}
          {!announcements.length && (
            <p className="text-sm text-muted-foreground">{translate(lang, "No updates yet.")}</p>
          )}
        </div>
      )}
    </Card>
  );
}
