import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import ScanId from "./ScanId";

export type Role = "driver" | "owner" | "admin";

type RegistrationFormProps = {
  role: Role;
  onBack?: () => void;
  onSubmit?: (data: FormData) => void;
};

export type FormData = {
  role: Role;
  name: string;
  phone: string;
  email: string;
  nid: string;
  address: string;
  extra: string;
  idImage: File | null;
};

const roleConfig = {
  driver: {
    title: "Driver Registration",
    extraLabel: "Driving License Number",
    extraPlaceholder: "Enter license number",
  },
  owner: {
    title: "Owner Registration",
    extraLabel: "Vehicle or Business Details",
    extraPlaceholder: "Enter vehicle or business details",
  },
  admin: {
    title: "Admin Registration",
    extraLabel: "Staff ID",
    extraPlaceholder: "Enter staff ID",
  },
};

export default function RegistrationForm({
  role,
  onBack,
  onSubmit,
}: RegistrationFormProps) {
  const config = roleConfig[role];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    nid: "",
    address: "",
    extra: "",
  });

  const [idImage, setIdImage] = useState<File | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSubmit?.({
      role,
      ...form,
      idImage,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">{config.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in your information to register.
        </p>
      </div>

      <ScanId onFileSelected={setIdImage} />

      <div className="space-y-2">
        <label htmlFor="name">Full Name</label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Enter full name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone">Phone Number</label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email">Email (Optional)</label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter email address"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="nid">NID Number</label>
        <Input
          id="nid"
          placeholder="Enter NID number"
          value={form.nid}
          onChange={(e) => update("nid", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address">Address</label>
        <Input
          id="address"
          autoComplete="street-address"
          placeholder="Enter address"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="extra">{config.extraLabel}</label>
        <Input
          id="extra"
          placeholder={config.extraPlaceholder}
          value={form.extra}
          onChange={(e) => update("extra", e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
        Register as {role.charAt(0).toUpperCase() + role.slice(1)}
      </Button>

      {onBack && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
      )}
    </form>
  );
}
