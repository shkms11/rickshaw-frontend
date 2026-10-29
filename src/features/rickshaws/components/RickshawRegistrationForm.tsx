import { useState, type FormEvent } from "react";
import { Bike } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateRickshawMutation } from "@/features/rickshaws/api/rickshawApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

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
  return "Could not register rickshaw. Check your connection and try again.";
}

export default function RickshawRegistrationForm() {
  const { lang } = useAppSelector((state) => state.ui);
  const [createRickshaw, { isLoading }] = useCreateRickshawMutation();
  const [plateNo, setPlateNo] = useState("");
  const [model, setModel] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await createRickshaw({
        plateNo: plateNo.trim().toUpperCase(),
        ...(model.trim() && { model: model.trim() }),
      }).unwrap();
      setPlateNo("");
      setModel("");
      setMessage(translate(lang, "Rickshaw registered."));
    } catch (requestError) {
      setError(translate(lang, getErrorMessage(requestError)));
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bike className="size-5 text-emerald-700" aria-hidden="true" />
          <div>
            <CardTitle>{translate(lang, "Register a rickshaw")}</CardTitle>
            <CardDescription>{translate(lang, "Add a vehicle to your fleet.")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={(event) => void handleSubmit(event)} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="new-rickshaw-plate">{translate(lang, "Plate number")}</Label>
            <Input
              id="new-rickshaw-plate"
              value={plateNo}
              onChange={(event) => setPlateNo(event.target.value)}
              placeholder={translate(lang, "Plate number")}
              required
              minLength={2}
              maxLength={32}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-rickshaw-model">{translate(lang, "Model (optional)")}</Label>
            <Input
              id="new-rickshaw-model"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              placeholder={translate(lang, "Model (optional)")}
              maxLength={80}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="self-end bg-emerald-700 text-white hover:bg-emerald-800">
            {translate(lang, isLoading ? "Saving..." : "Add rickshaw")}
          </Button>
        </form>
        {message && <p role="status" className="mt-3 text-sm text-emerald-700">{message}</p>}
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
