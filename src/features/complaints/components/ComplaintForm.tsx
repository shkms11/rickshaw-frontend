import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComplaintMutation } from "@/features/complaints/api/complaintApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

type ComplaintFormProps = {
  title: string;
  description: string;
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
  return "Could not submit the report. Check your connection and try again.";
}

/** Submits a user report through the complaint API and displays its request status. */
export default function ComplaintForm({ title, description }: ComplaintFormProps) {
  const { lang } = useAppSelector((state) => state.ui);
  const [createComplaint, { isLoading }] = useCreateComplaintMutation();
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await createComplaint({ subject: subject.trim(), description: details.trim() }).unwrap();
      setSubject("");
      setDetails("");
      setMessage(translate(lang, "Report sent to admin."));
    } catch (requestError) {
      setError(translate(lang, getErrorMessage(requestError)));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translate(lang, title)}</CardTitle>
        <CardDescription>{translate(lang, description)}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="complaint-subject">{translate(lang, "Subject")}</Label>
            <Input
              id="complaint-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              minLength={3}
              maxLength={120}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complaint-description">{translate(lang, "Describe the problem")}</Label>
            <Textarea
              id="complaint-description"
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              minLength={10}
              maxLength={2000}
              rows={4}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {translate(lang, isLoading ? "Sending..." : "Send report")}
          </Button>
        </form>
        {message && <p role="status" className="mt-3 text-sm text-emerald-700">{message}</p>}
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
