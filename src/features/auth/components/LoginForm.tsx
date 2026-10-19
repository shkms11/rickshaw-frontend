import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export type LoginRole = "driver" | "owner" | "admin";

type LoginFormProps = {
  role: LoginRole;
  onBack?: () => void;
  onSubmit?: (data: {
    role: LoginRole;
    identifier: string;
    password: string;
  }) => void;
};

const roleStyles: Record<LoginRole, string> = {
  driver: "bg-emerald-700 hover:bg-emerald-800",
  owner: "bg-emerald-700 hover:bg-emerald-800",
  admin: "bg-amber-600 hover:bg-amber-700",
};

const roleTitles: Record<LoginRole, string> = {
  driver: "Driver Login",
  owner: "Owner Login",
  admin: "Admin Login",
};

export default function LoginForm({ role, onBack, onSubmit }: LoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSubmit?.({
      role,
      identifier: identifier.trim(),
      password,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-slate-800">
          {roleTitles[role]}
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your details to access your account.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="login-identifier">Phone Number or Email</label>
        <Input
          id="login-identifier"
          type="text"
          autoComplete="username"
          placeholder="Enter phone number or email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="login-password">Password</label>

        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter password"
            className="pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((previous) => !previous)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className={`h-12 w-full text-white ${roleStyles[role]}`}
      >
        Login
      </Button>

      {onBack && (
        <Button
          type="button"
          variant="outline"
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
