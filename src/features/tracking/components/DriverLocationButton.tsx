import { LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";

type Props = {
    driverId: string;
    onSelect: (driverId: string) => void;
};

export default function DriverLocationButton({ driverId, onSelect }: Props) {
    const { lang } = useAppSelector((state) => state.ui);

    return (
        <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onSelect(driverId)}
        >
            <LocateFixed className="mr-1 size-4" />
            {translate(lang, "View location")}
        </Button>
    );
}
