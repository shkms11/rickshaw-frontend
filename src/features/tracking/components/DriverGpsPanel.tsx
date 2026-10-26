import { useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin, Radio, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    useSaveMyLocationMutation,
    useStopMyLocationMutation,
} from "@/features/tracking/api/locationApi";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";
import type { GPSPoint } from "@/features/gps/types/gps.types";

export default function DriverGpsPanel() {
    const { lang } = useAppSelector((state) => state.ui);
    const [saveLocation] = useSaveMyLocationMutation();
    const [stopLocation] = useStopMyLocationMutation();
    const watchId = useRef<number | null>(null);
    const lastSentAt = useRef(0);
    const [point, setPoint] = useState<GPSPoint | null>(null);
    const [error, setError] = useState("");
    const [tracking, setTracking] = useState(false);

    function stopTracking() {
        const wasTracking = tracking;
        if (watchId.current !== null) {
            navigator.geolocation.clearWatch(watchId.current);
            watchId.current = null;
        }
        setTracking(false);
        if (wasTracking) {
            void stopLocation().unwrap().catch(() => {
                setError("Could not stop GPS sharing on the server.");
            });
        }
    }

    useEffect(() => () => {
        if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    }, []);

    function startTracking() {
        if (!("geolocation" in navigator)) {
            setError("This device does not support GPS location.");
            return;
        }
        setError("");
        watchId.current = navigator.geolocation.watchPosition(
            (position) => {
                const next: GPSPoint = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    timestamp: position.timestamp,
                };
                setPoint(next);
                if (Date.now() - lastSentAt.current >= 5000) {
                    lastSentAt.current = Date.now();
                    void saveLocation({
                        latitude: next.lat,
                        longitude: next.lng,
                        accuracy: position.coords.accuracy,
                    }).unwrap().catch(() => {
                        setError("GPS found your location, but the server could not save it.");
                    });
                }
                setError("");
            },
            (positionError) => {
                setError(
                    positionError.code === positionError.PERMISSION_DENIED
                        ? "Location permission was denied. Allow location access in your browser settings."
                        : positionError.message || "Unable to read device location.",
                );
                stopTracking();
            },
            { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 },
        );
        setTracking(true);
    }

    return (
        <Card className="space-y-4 p-5 sm:p-6">
            <div className="flex items-start gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                    <LocateFixed className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">
                        {translate(lang, "Rickshaw GPS")}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {translate(lang, "Share your live location with your fleet manager while you are on shift.")}
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm">
                    <Radio className={`size-4 ${tracking ? "text-emerald-600" : "text-muted-foreground"}`} />
                    <span>{tracking ? translate(lang, "GPS sharing is on") : translate(lang, "GPS sharing is off")}</span>
                </div>
                {tracking ? (
                    <Button type="button" variant="outline" onClick={stopTracking}>
                        <Square className="mr-2 size-4" />
                        {translate(lang, "Stop sharing")}
                    </Button>
                ) : (
                    <Button type="button" onClick={startTracking} className="bg-emerald-700 text-white hover:bg-emerald-800">
                        <MapPin className="mr-2 size-4" />
                        {translate(lang, "Start GPS sharing")}
                    </Button>
                )}
            </div>
            {point && (
                <p className="text-sm text-muted-foreground">
                    {translate(lang, "Last reported")}: {point.lat.toFixed(5)}, {point.lng.toFixed(5)} · {new Date(point.timestamp).toLocaleTimeString()}
                </p>
            )}
            {error && <p role="alert" className="text-sm text-destructive">{translate(lang, error)}</p>}
            <p className="text-xs text-muted-foreground">
                {translate(lang, "Location is shared only while this page is open and GPS sharing is enabled.")}
            </p>
        </Card>
    );
}
