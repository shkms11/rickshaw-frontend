import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/app/hooks";
import { translate } from "@/shared/i18n";
import { useGetDriverLocationsQuery } from "@/features/tracking/api/locationApi";

const driverIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
});

export default function FleetLocationMap() {
    const { lang } = useAppSelector((state) => state.ui);
    const { data, isLoading, isError } = useGetDriverLocationsQuery(undefined, {
        pollingInterval: 15000,
    });
    const locations = data?.locations ?? [];
    const liveCount = locations.filter((location) => location.isLive).length;

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b p-5">
                <div>
                    <h2 className="font-semibold">{translate(lang, "Driver locations")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {translate(lang, "Refreshes every 15 seconds · Last known points stay visible")}
                    </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {liveCount} {translate(lang, "live")} · {locations.length} {translate(lang, "last known")}
                </span>
            </div>
            {isLoading ? (
                <p className="p-6 text-sm text-muted-foreground">{translate(lang, "Loading locations...")}</p>
            ) : isError ? (
                <p role="alert" className="p-6 text-sm text-destructive">
                    {translate(lang, "Could not load live locations. Check your connection and sign-in.")}
                </p>
            ) : (
                <>
                    <MapContainer
                        center={[23.8103, 90.4125]}
                        zoom={12}
                        scrollWheelZoom={false}
                        style={{ height: 360, width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {locations.map((location) => (
                            <Marker
                                key={`${location.driverName}-${location.updatedAt}`}
                                position={[location.latitude, location.longitude]}
                                icon={driverIcon}
                            >
                                <Popup>
                                    <strong>{location.driverName}</strong>
                                    <br />
                                    {location.rickshawPlate ?? translate(lang, "No vehicle assigned")}
                                    <br />
                                    {location.source === "DEMO"
                                        ? translate(lang, "DEMO SAMPLE LOCATION")
                                        : location.isLive
                                            ? translate(lang, "Live")
                                            : translate(lang, "Last known location")}
                                    <br />
                                    {new Date(location.updatedAt).toLocaleString()}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                    {locations.length === 0 && (
                        <p className="border-t p-4 text-sm text-muted-foreground">
                            {translate(lang, "No drivers are sharing GPS right now.")}
                        </p>
                    )}
                </>
            )}
        </Card>
    );
}
