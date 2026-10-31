import { SearchX } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";
import DriverLocationButton from "@/features/tracking/components/DriverLocationButton";

export type SearchResult = {
  id: string;
  name: string;
  type: "driver" | "owner" | "user" | "rickshaw" | "location" | "payment" | "complaint";
  description?: string;
};

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  error?: boolean;
  hasSearched?: boolean;
  onViewDriverLocation: (driverId: string) => void;
}

export default function SearchResults({
  results,
  isLoading = false,
  error = false,
  hasSearched = false,
  onViewDriverLocation,
}: SearchResultsProps) {
  const { lang } = useAppSelector((state) => state.ui);

  if (!hasSearched) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">{translate(lang, "Searching...")}</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-sm text-destructive">
          {translate(lang, "Something went wrong while searching.")}
        </p>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-2 p-8 text-center">
        <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden="true" />

        <p className="font-medium">{translate(lang, "No results found")}</p>

        <p className="text-sm text-muted-foreground">
          {translate(lang, "Try a different search term or filter.")}
        </p>
      </Card>
    );
  }

  return (
    <Card className="divide-y">
      {results.map((result) => (
        <div
          key={`${result.type}-${result.id}`}
          className="flex items-center justify-between gap-4 p-4"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{result.name}</p>

            {result.description && (
              <p className="truncate text-sm text-muted-foreground">
                {result.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {result.type === "driver" && (
              <DriverLocationButton
                driverId={result.id}
                onSelect={onViewDriverLocation}
              />
            )}
            <Badge variant="outline" className="capitalize">
              {translate(lang, result.type)}
            </Badge>
          </div>
        </div>
      ))}
    </Card>
  );
}
