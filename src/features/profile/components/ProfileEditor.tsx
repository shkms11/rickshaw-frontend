import { useState, type FormEvent, type ReactNode } from "react";
import { ChevronDown, ChevronUp, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  type UpdateProfile,
  type UserProfile,
} from "@/features/profile/api/profileApi";

const divisions = [
  "Barishal",
  "Chattogram",
  "Dhaka",
  "Khulna",
  "Mymensingh",
  "Rajshahi",
  "Rangpur",
  "Sylhet",
];

const emptyDraft: UpdateProfile = {
  name: "",
  phone: "",
  email: "",
  nid: "",
  dateOfBirth: "",
  division: "",
  district: "",
  upazila: "",
  unionWard: "",
  villageRoad: "",
  postalCode: "",
  photoUrl: "",
};

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
  return "Could not save your profile. Please try again.";
}

export default function ProfileEditor() {
  const { lang } = useAppSelector((state) => state.ui);
  const { data, isLoading, isError } = useGetMyProfileQuery();
  if (isLoading) {
    return <Card className="p-5 text-sm text-muted-foreground">{translate(lang, "Loading profile...")}</Card>;
  }
  if (isError || !data) {
    return <Card role="alert" className="p-5 text-sm text-destructive">{translate(lang, "Could not load your profile.")}</Card>;
  }

  return <ProfileForm profile={data.profile} />;
}

function ProfileForm({ profile }: { profile: UserProfile }) {
  const { lang } = useAppSelector((state) => state.ui);
  const [updateProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();
  const isDriver = profile.role === "DRIVER";
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<UpdateProfile>(() => ({
    ...emptyDraft,
    name: profile.name,
    phone: profile.phone ?? "",
    email: profile.email ?? "",
    nid: profile.profile?.nid ?? "",
    dateOfBirth: profile.profile?.dateOfBirth?.slice(0, 10) ?? "",
    division: profile.profile?.division ?? "",
    district: profile.profile?.district ?? "",
    upazila: profile.profile?.upazila ?? "",
    unionWard: profile.profile?.unionWard ?? "",
    villageRoad: profile.profile?.villageRoad ?? "",
    postalCode: profile.profile?.postalCode ?? "",
    photoUrl: profile.profile?.photoUrl ?? "",
    ...(isDriver ? { licenseNo: profile.driver?.licenseNo ?? "" } : {}),
  }));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function setField<K extends keyof UpdateProfile>(key: K, value: UpdateProfile[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await updateProfile(draft).unwrap();
      setMessage(translate(lang, "Profile updated."));
    } catch (requestError) {
      setError(translate(lang, getErrorMessage(requestError)));
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={draft.photoUrl || undefined} alt={draft.name} />
            <AvatarFallback>
              {draft.name.trim().slice(0, 2).toUpperCase() || <UserRound className="size-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate font-semibold">{draft.name}</h2>
            <p className="truncate text-sm text-muted-foreground">{draft.phone}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          aria-expanded={expanded}
          aria-controls="profile-details"
          onClick={() => setExpanded((current) => !current)}
          className="shrink-0"
        >
          {translate(lang, expanded ? "Hide details" : "Edit profile")}
          {expanded ? <ChevronUp className="ml-2 size-4" /> : <ChevronDown className="ml-2 size-4" />}
        </Button>
      </div>
      {expanded && (
      <form id="profile-details" onSubmit={(event) => void submit(event)} className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2">
        <p className="text-sm text-muted-foreground sm:col-span-2">
          {translate(lang, "Add your personal and address details.")}
        </p>
        <Field label="Full name" id="profile-name">
          <Input id="profile-name" required value={draft.name} onChange={(event) => setField("name", event.target.value)} />
        </Field>
        <Field label="Phone number" id="profile-phone">
          <Input id="profile-phone" required type="tel" value={draft.phone} onChange={(event) => setField("phone", event.target.value)} />
        </Field>
        <Field label="Email" id="profile-email">
          <Input id="profile-email" type="email" value={draft.email} onChange={(event) => setField("email", event.target.value)} />
        </Field>
        <Field label="Profile picture URL" id="profile-photo">
          <Input id="profile-photo" type="url" value={draft.photoUrl} onChange={(event) => setField("photoUrl", event.target.value)} />
        </Field>
        {isDriver && (
          <Field label="Driving license number" id="profile-license">
            <Input id="profile-license" value={draft.licenseNo ?? ""} onChange={(event) => setField("licenseNo", event.target.value)} />
          </Field>
        )}
        <Field label="NID number" id="profile-nid">
          <Input id="profile-nid" inputMode="numeric" value={draft.nid} onChange={(event) => setField("nid", event.target.value)} />
        </Field>
        <Field label="Date of birth" id="profile-dob">
          <Input id="profile-dob" type="date" value={draft.dateOfBirth} onChange={(event) => setField("dateOfBirth", event.target.value)} />
        </Field>
        <Field label="Division" id="profile-division">
          <select
            id="profile-division"
            value={draft.division}
            onChange={(event) => setField("division", event.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">{translate(lang, "Select division")}</option>
            {divisions.map((division) => <option key={division} value={division}>{division}</option>)}
          </select>
        </Field>
        <Field label="District" id="profile-district">
          <Input id="profile-district" value={draft.district} onChange={(event) => setField("district", event.target.value)} />
        </Field>
        <Field label="Upazila / Thana" id="profile-upazila">
          <Input id="profile-upazila" value={draft.upazila} onChange={(event) => setField("upazila", event.target.value)} />
        </Field>
        <Field label="Union / Ward" id="profile-union">
          <Input id="profile-union" value={draft.unionWard} onChange={(event) => setField("unionWard", event.target.value)} />
        </Field>
        <Field label="Village / Road / House" id="profile-address">
          <Input id="profile-address" value={draft.villageRoad} onChange={(event) => setField("villageRoad", event.target.value)} />
        </Field>
        <Field label="Postal code" id="profile-postal">
          <Input id="profile-postal" value={draft.postalCode} onChange={(event) => setField("postalCode", event.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSaving} className="bg-emerald-700 text-white hover:bg-emerald-800">
            {translate(lang, isSaving ? "Saving..." : "Save profile")}
          </Button>
          {message && <p role="status" className="mt-3 text-sm text-emerald-700">{message}</p>}
          {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
        </div>
      </form>
      )}
    </Card>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  const { lang } = useAppSelector((state) => state.ui);
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{translate(lang, label)}</Label>
      {children}
    </div>
  );
}
