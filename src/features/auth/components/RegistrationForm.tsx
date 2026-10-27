import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

export type Role = "driver" | "owner" | "admin";

type RegistrationFormProps = {
  role: Role;
  onBack?: () => void;
};

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export default function RegistrationForm({
  role,
  onBack,
}: RegistrationFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    licenseNo: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { lang } = useAppSelector((state) => state.ui);

  function update(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setSubmitted(false);

    if (role === "admin") {
      setMessage(
        "Admin accounts must be created by an authorized administrator.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: role.toUpperCase(),
          ...(role === "driver" && { licenseNo: form.licenseNo.trim() }),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage(
        "Registration received. Your account is pending approval. Please log in after an administrator approves it.",
      );
      setSubmitted(true);
    } catch (error) {
      setMessage(
        translate(
          lang,
          error instanceof Error
            ? error.message
            : "Could not connect to the server.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">
          {translate(
            lang,
            role === "driver" ? "Driver Registration" : "Owner Registration",
          )}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {translate(lang, "Fill in your information to register.")}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="name">{translate(lang, "Full Name")}</label>
        <Input
          id="name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </div>

      {role === "driver" && (
        <div className="space-y-2">
          <label htmlFor="licenseNo">
            {translate(lang, "Driving License Number")}
          </label>
          <Input
            id="licenseNo"
            autoComplete="off"
            value={form.licenseNo}
            onChange={(e) => update("licenseNo", e.target.value)}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="phone">{translate(lang, "Phone number")}</label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+8801712345678"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email">{translate(lang, "Email (optional)")}</label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password">{translate(lang, "Password")}</label>
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

      <Button
        type="submit"
        disabled={loading || submitted}
        className="w-full bg-green-700 hover:bg-green-800"
      >
        {translate(lang, loading ? "Registering..." : `Register as ${role}`)}
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
          {translate(lang, "Back")}
        </Button>
      )}
    </form>
  );
}
