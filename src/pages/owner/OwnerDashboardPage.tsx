import { useState, type FormEvent } from "react";
import { Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/shared/components/layout/DashboardLayout";
import FleetLocationMap from "@/features/tracking/components/FleetLocationMap";
import {
    useCreateRickshawMutation,
    useGetRickshawsQuery,
} from "@/features/rickshaws/api/rickshawApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";
import { useGetDriverLocationsQuery } from "@/features/tracking/api/locationApi";

export default function OwnerDashboardPage() {
    const { lang } = useAppSelector((state) => state.ui);
    const { data, isLoading, isError } = useGetRickshawsQuery();
    const { data: locations } = useGetDriverLocationsQuery(undefined, {
        pollingInterval: 15000,
    });
    const [createRickshaw, { isLoading: isSaving }] = useCreateRickshawMutation();
    const [plateNo, setPlateNo] = useState("");
    const [model, setModel] = useState("");
    const [message, setMessage] = useState("");
    const fleet = data?.rickshaws ?? [];

    async function registerVehicle(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        try {
            await createRickshaw({
                plateNo: plateNo.trim().toUpperCase(),
                ...(model.trim() && { model: model.trim() }),
            }).unwrap();
            setPlateNo("");
            setModel("");
            setMessage(translate(lang, "Rickshaw registered."));
        } catch (error) {
            const responseMessage =
                typeof error === "object" &&
                error !== null &&
                "data" in error &&
                typeof error.data === "object" &&
                error.data !== null &&
                "message" in error.data &&
                typeof error.data.message === "string"
                    ? error.data.message
                    : "Could not register rickshaw. Check your connection and try again.";
            setMessage(translate(lang, responseMessage));
        }
    }

    return (
        <DashboardLayout title="Fleet Owner Dashboard">
            <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="p-5">
                        <p className="text-sm text-muted-foreground">{translate(lang, "Registered rickshaws")}</p>
                        <p className="mt-2 text-3xl font-semibold">{isLoading ? "…" : fleet.length}</p>
                    </Card>
                    <Card className="p-5">
                        <p className="text-sm text-muted-foreground">{translate(lang, "Active vehicles")}</p>
                        <p className="mt-2 text-3xl font-semibold">
                            {isLoading ? "…" : fleet.filter((item) => item.status === "ACTIVE").length}
                        </p>
                    </Card>
                    <Card className="p-5">
                        <p className="text-sm text-muted-foreground">{translate(lang, "Drivers sharing GPS")}</p>
                        <p className="mt-2 text-3xl font-semibold">
                            {locations?.locations.length ?? "…"}
                        </p>
                        <p className="text-xs text-muted-foreground">{translate(lang, "See the live map below")}</p>
                    </Card>
                </div>

                <Card className="p-5 sm:p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <Bike className="size-5 text-emerald-700" />
                        <div>
                            <h2 className="font-semibold">{translate(lang, "Register a rickshaw")}</h2>
                            <p className="text-sm text-muted-foreground">{translate(lang, "Add a vehicle to your fleet.")}</p>
                        </div>
                    </div>
                    <form onSubmit={(event) => void registerVehicle(event)} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                        <Input
                            value={plateNo}
                            onChange={(event) => setPlateNo(event.target.value)}
                            placeholder={translate(lang, "Plate number")}
                            aria-label={translate(lang, "Plate number")}
                            required
                            minLength={2}
                            maxLength={32}
                        />
                        <Input
                            value={model}
                            onChange={(event) => setModel(event.target.value)}
                            placeholder={translate(lang, "Model (optional)")}
                            aria-label={translate(lang, "Model (optional)")}
                            maxLength={80}
                        />
                        <Button type="submit" disabled={isSaving} className="bg-emerald-700 text-white hover:bg-emerald-800">
                            {translate(lang, isSaving ? "Saving..." : "Add rickshaw")}
                        </Button>
                    </form>
                    {message && <p role="status" className="mt-3 text-sm">{message}</p>}
                </Card>

                <FleetLocationMap />

                <Card className="overflow-hidden">
                    <div className="border-b p-5">
                        <h2 className="font-semibold">{translate(lang, "Your fleet")}</h2>
                    </div>
                    {isError ? (
                        <p role="alert" className="p-5 text-sm text-destructive">{translate(lang, "Could not load fleet. Please check your connection and sign-in.")}</p>
                    ) : isLoading ? (
                        <p className="p-5 text-sm text-muted-foreground">{translate(lang, "Loading fleet...")}</p>
                    ) : fleet.length === 0 ? (
                        <p className="p-5 text-sm text-muted-foreground">{translate(lang, "No vehicles yet. Add your first rickshaw above.")}</p>
                    ) : (
                        <div className="divide-y">
                            {fleet.map((vehicle) => (
                                <div key={vehicle.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                                    <div>
                                        <p className="font-medium">{vehicle.plateNo}</p>
                                        <p className="text-sm text-muted-foreground">{vehicle.model ?? translate(lang, "Model not provided")}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-muted-foreground">{vehicle.driver?.user.name ?? translate(lang, "No driver assigned")}</span>
                                        <Badge variant={vehicle.status === "ACTIVE" ? "default" : "outline"}>{translate(lang, vehicle.status)}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
}
