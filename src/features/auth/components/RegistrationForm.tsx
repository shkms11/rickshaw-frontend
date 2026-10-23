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
  password: string;
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
    password: "",
    nid: "",
    address: "",
    extra: "",
  });

  const [idImage, setIdImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (role === "admin") {
      setMessage(
        "Admin accounts must be created by an authorized administrator.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: role.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      onSubmit?.({ role, ...form, idImage });
      setMessage("Registration successful!");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not connect to the server.",
      );
    } finally {
      setLoading(false);
    }
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
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password">Password</label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="nid">NID Number</label>
        <Input
          id="nid"
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
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="extra">{config.extraLabel}</label>
        <Input
          id="extra"
          value={form.extra}
          onChange={(e) => update("extra", e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-green-700 hover:bg-green-800"
      >
        {loading ? "Registering..." : `Register as ${role}`}
      </Button>

      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}

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
