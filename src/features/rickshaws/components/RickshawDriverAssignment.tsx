import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/app/hooks";
import { useLazySearchOwnerDriverQuery, useAssignRickshawDriverMutation, type Rickshaw } from "@/features/rickshaws/api/rickshawApi";
import { translate } from "@/shared/i18n";

type Props = {
  rickshaw: Rickshaw;
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
  return "Could not update driver assignment. Check your connection and try again.";
}

export default function RickshawDriverAssignment({ rickshaw }: Props) {
  const { lang } = useAppSelector((state) => state.ui);
  const [phone, setPhone] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [searchDrivers, searchState] = useLazySearchOwnerDriverQuery();
  const [assignDriver, assignmentState] = useAssignRickshawDriverMutation();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const result = searchState.currentData?.drivers[0];
  const alreadyAssignedElsewhere =
    Boolean(result?.rickshaw && result.rickshaw.id !== rickshaw.id);

  async function findDriver(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const value = phone.trim();
    setSearchedPhone(value);
    try {
      await searchDrivers(value).unwrap();
    } catch (requestError) {
      setError(translate(lang, getErrorMessage(requestError)));
    }
  }

  async function applyAssignment(driverId: string | null) {
    setMessage("");
    setError("");
    try {
      await assignDriver({ rickshawId: rickshaw.id, driverId }).unwrap();
      setMessage(translate(lang, "Driver assignment updated."));
      setPhone("");
      setSearchedPhone("");
    } catch (requestError) {
      setError(translate(lang, getErrorMessage(requestError)));
    }
  }

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <div className="text-sm">
        <p className="font-medium">{translate(lang, "Assigned driver")}</p>
        {rickshaw.driver ? (
          <p className="text-muted-foreground">
            {rickshaw.driver.user.name} · {rickshaw.driver.user.phone ?? translate(lang, "Phone unavailable")}
          </p>
        ) : (
          <p className="text-muted-foreground">{translate(lang, "No driver assigned")}</p>
        )}
      </div>
      {rickshaw.status === "ACTIVE" && (
        <>
          <form onSubmit={(event) => void findDriver(event)} className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={translate(lang, "Search approved driver by phone")}
              aria-label={translate(lang, "Search approved driver by phone")}
              required
            />
            <Button type="submit" variant="outline" disabled={searchState.isFetching}>
              {translate(lang, searchState.isFetching ? "Searching..." : "Find driver")}
            </Button>
          </form>
          {searchedPhone && !searchState.isFetching && !searchState.error && !result && (
            <p className="text-sm text-muted-foreground">{translate(lang, "No approved driver found for this phone.")}</p>
          )}
          {result && searchedPhone && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/40 p-3">
              <div className="text-sm">
                <p className="font-medium">{result.user.name}</p>
                <p className="text-muted-foreground">{result.user.phone}</p>
                {alreadyAssignedElsewhere && (
                  <p className="text-xs text-muted-foreground">
                    {translate(lang, "Already assigned to")} {result.rickshaw?.plateNo}
                  </p>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                disabled={assignmentState.isLoading || alreadyAssignedElsewhere}
                onClick={() => void applyAssignment(result.id)}
              >
                {translate(lang, assignmentState.isLoading ? "Saving assignment..." : "Assign driver")}
              </Button>
            </div>
          )}
          {rickshaw.driver && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={assignmentState.isLoading}
              onClick={() => void applyAssignment(null)}
            >
              {translate(lang, "Unassign driver")}
            </Button>
          )}
        </>
      )}
      {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
