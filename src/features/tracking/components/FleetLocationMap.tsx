import { Fragment, useEffect, useRef } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { type Marker as LeafletMarker } from "leaflet";
import { CarFront, Clock3, MapPin, MapPinned, Radio, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/app/hooks";
import { getAuthenticatedRole } from "@/shared/authSession";
import { translate } from "@/shared/i18n";
import type { Lang } from "@/shared/types/home.types";
import {
    useGetDriverLocationsQuery,
    type DriverLocation,
} from "@/features/tracking/api/locationApi";

function createDriverIcon(isLive: boolean, selected: boolean) {
    const color = isLive ? "#059669" : "#d97706";
    const size = selected ? 40 : 34;

    return L.divIcon({
        className: "",
        html: `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;border-radius:50% 50% 50% 5px;transform:rotate(-45deg);background:${color};border:3px solid #fff;box-shadow:0 3px 12px rgba(15,23,42,.35)"><span style="width:9px;height:9px;border-radius:50%;background:#fff;transform:rotate(45deg)"></span></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    });
}

function formatAccuracy(accuracy: number) {
    return accuracy >= 1000
        ? `±${(accuracy / 1000).toFixed(1)} km`
        : `±${Math.round(accuracy)} m`;
}

/** Fits all initial reports once, then flies to a newly selected driver's point. */
function MapViewController({
    locations,
    selectedLocation,
}: {
    locations: DriverLocation[];
    selectedLocation?: DriverLocation;
}) {
    const map = useMap();
    const hasFittedLocations = useRef(false);
    const selectedDriverId = selectedLocation?.driverId;
    const selectedLatitude = selectedLocation?.latitude;
    const selectedLongitude = selectedLocation?.longitude;

    useEffect(() => {
        if (locations.length === 0) return;

        if (selectedLocation || hasFittedLocations.current) return;

        const bounds = L.latLngBounds(
            locations.map((location) => [location.latitude, location.longitude]),
        );
        map.fitBounds(bounds, { padding: [32, 32], maxZoom: 15 });
        hasFittedLocations.current = true;
    }, [locations, map, selectedLocation]);

    useEffect(() => {
        if (
            !selectedDriverId ||
            selectedLatitude === undefined ||
            selectedLongitude === undefined
        ) return;

        map.flyTo(
            [selectedLatitude, selectedLongitude],
            Math.max(map.getZoom(), 16),
        );
        hasFittedLocations.current = true;
    }, [
        map,
        selectedDriverId,
        selectedLatitude,
        selectedLongitude,
    ]);

    return null;
}

/** Shows one driver's live/last-known state and details in a map popup. */
function DriverMarker({
    location,
    selected,
    lang,
    showOwner,
}: {
    location: DriverLocation;
    selected: boolean;
    lang: Lang;
    showOwner: boolean;
}) {
    const markerRef = useRef<LeafletMarker>(null);

    useEffect(() => {
        if (selected) markerRef.current?.openPopup();
    }, [selected]);

    return (
        <Marker
            ref={markerRef}
            position={[location.latitude, location.longitude]}
            icon={createDriverIcon(location.isLive, selected)}
        >
            <Popup className="driver-location-popup" minWidth={270} maxWidth={300}>
                <div className="w-[270px] overflow-hidden rounded-xl bg-white text-slate-900">
                    <div className="flex items-start gap-3 bg-slate-50 px-4 py-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                            <UserRound className="size-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold leading-5">
                                {location.driverName}
                            </p>
                            <span
                                className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                    location.source === "DEMO"
                                        ? "bg-slate-200 text-slate-700"
                                        : location.isLive
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-amber-100 text-amber-900"
                                }`}
                            >
                                <span
                                    className={`size-1.5 rounded-full ${
                                        location.source === "DEMO"
                                            ? "bg-slate-500"
                                            : location.isLive
                                                ? "bg-emerald-600"
                                                : "bg-amber-600"
                                    }`}
                                />
                                {location.source === "DEMO"
                                    ? translate(lang, "DEMO SAMPLE LOCATION")
                                    : location.isLive
                                        ? translate(lang, "Live")
                                        : translate(lang, "Last known location")}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 px-4 py-3">
                        <div className="space-y-2 border-b pb-3">
                            <div className="flex items-center gap-2 text-sm">
                                <CarFront className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                                <span className="text-xs text-slate-500">{translate(lang, "Vehicle")}</span>
                                <span className="ml-auto text-right text-xs font-medium text-slate-800">
                                    {location.rickshawPlate ?? translate(lang, "No vehicle assigned")}
                                </span>
                            </div>
                            {showOwner && (
                                <div className="flex items-center gap-2 text-sm">
                                    <UserRound className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                                    <span className="text-xs text-slate-500">{translate(lang, "Owner")}</span>
                                    <span className="ml-auto text-right text-xs font-medium text-slate-800">
                                        {location.ownerName ?? translate(lang, "Not assigned to an owner")}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="rounded-lg bg-slate-50 p-3">
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                <MapPin className="size-3.5 text-emerald-700" aria-hidden="true" />
                                {translate(lang, "GPS coordinates")}
                            </div>
                            <p className="mt-1 font-mono text-xs font-semibold tracking-tight text-slate-800">
                                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                            </p>
                        </div>

                        <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="text-slate-500">{translate(lang, "Reported accuracy")}</span>
                            <span className="font-semibold text-slate-800">
                                {location.accuracy === null
                                    ? translate(lang, "Unavailable")
                                    : formatAccuracy(location.accuracy)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 border-t bg-slate-50 px-4 py-2.5 text-[11px] text-slate-500">
                        <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
                        <span>{translate(lang, "Last updated")}</span>
                        <span className="ml-auto font-medium text-slate-700">
                            {new Date(location.updatedAt).toLocaleString(
                                lang === "bn" ? "bn-BD" : "en-US",
                                { dateStyle: "medium", timeStyle: "short" },
                            )}
                        </span>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}

type Props = {
    selectedDriverId?: string | null;
};

/** Renders location records from the tracking API, distinguishing live and last-known reports. */
export default function FleetLocationMap({ selectedDriverId = null }: Props) {
    const { lang } = useAppSelector((state) => state.ui);
    const role = getAuthenticatedRole();
    const mapCard = useRef<HTMLDivElement>(null);
    const { data, isLoading, isError } = useGetDriverLocationsQuery(undefined, {
        pollingInterval: 15000,
    });
    const locations = data?.locations ?? [];
    const liveCount = locations.filter((location) => location.isLive).length;
    const lastKnownCount = locations.length - liveCount;
    const selectedLocation = locations.find(
        (location) => location.driverId === selectedDriverId,
    );

    useEffect(() => {
        if (selectedDriverId) {
            mapCard.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [selectedDriverId]);

    return (
        <div ref={mapCard} id="driver-locations-map">
            <Card className="overflow-hidden">
                <div className="flex flex-col gap-4 border-b bg-gradient-to-r from-emerald-50/80 via-white to-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
                            <MapPinned className="size-5" aria-hidden="true" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                                    {translate(lang, "Driver locations")}
                                </h2>
                                <Badge variant="outline" className="gap-1 border-emerald-200 bg-white text-emerald-800">
                                    <Radio className="size-3" aria-hidden="true" />
                                    {translate(lang, "Fleet map")}
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                                {translate(
                                    lang,
                                    role === "owner"
                                        ? "Only drivers assigned to your fleet are shown."
                                        : "Driver locations grouped by owner.",
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:justify-end">
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3 py-2 shadow-sm">
                            <span className="relative flex size-2.5">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-600" />
                            </span>
                            <span className="text-sm font-semibold text-slate-900">{liveCount}</span>
                            <span className="text-xs text-slate-600">{translate(lang, "live")}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-white px-3 py-2 shadow-sm">
                            <span className="size-2.5 rounded-full bg-amber-500" />
                            <span className="text-sm font-semibold text-slate-900">{lastKnownCount}</span>
                            <span className="text-xs text-slate-600">{translate(lang, "last known")}</span>
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <div className="flex h-[360px] flex-col items-center justify-center gap-3 bg-slate-50 text-slate-600 sm:h-[440px]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                            <MapPinned className="size-6" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-medium">{translate(lang, "Loading locations...")}</p>
                    </div>
                ) : isError ? (
                    <div role="alert" className="flex h-[360px] flex-col items-center justify-center gap-2 bg-slate-50 px-6 text-center sm:h-[440px]">
                        <p className="font-medium text-destructive">
                            {translate(lang, "Could not load live locations. Check your connection and sign-in.")}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="relative bg-slate-100 p-2 sm:p-3">
                            <div className="overflow-hidden rounded-xl border border-white shadow-inner">
                                <MapContainer
                                    center={[23.8103, 90.4125]}
                                    zoom={12}
                                    scrollWheelZoom
                                    className="h-[360px] w-full sm:h-[440px]"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <MapViewController
                                        locations={locations}
                                        selectedLocation={selectedLocation}
                                    />
                                    {locations.map((location) => (
                                        <Fragment key={location.driverId}>
                                            {location.accuracy !== null && location.accuracy > 0 && (
                                                <Circle
                                                    center={[location.latitude, location.longitude]}
                                                    radius={location.accuracy}
                                                    pathOptions={{
                                                        color: location.isLive ? "#047857" : "#b45309",
                                                        fillColor: location.isLive ? "#10b981" : "#f59e0b",
                                                        fillOpacity: 0.12,
                                                        weight: 2,
                                                    }}
                                                />
                                            )}
                                            <DriverMarker
                                                location={location}
                                                selected={location.driverId === selectedDriverId}
                                                lang={lang}
                                                showOwner={role !== "owner"}
                                            />
                                        </Fragment>
                                    ))}
                                </MapContainer>
                            </div>
                            <div className="pointer-events-none absolute bottom-6 left-6 flex items-center gap-4 rounded-lg border border-white/80 bg-white/95 px-3 py-2 text-xs font-medium text-slate-700 shadow-md backdrop-blur">
                                <span className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full bg-emerald-600" />
                                    {translate(lang, "Live")}
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full bg-amber-500" />
                                    {translate(lang, "Last known location")}
                                </span>
                            </div>
                            <div className="pointer-events-none absolute right-6 top-6 flex items-center gap-1.5 rounded-lg border border-white/80 bg-white/95 px-3 py-2 text-xs font-medium text-slate-700 shadow-md backdrop-blur">
                                <Clock3 className="size-3.5 text-emerald-700" aria-hidden="true" />
                                {translate(lang, "Refreshes every 15 seconds")}
                            </div>
                        </div>
                        {selectedDriverId && !selectedLocation && (
                            <p role="status" className="border-t bg-amber-50 px-5 py-3 text-sm text-amber-900">
                                {translate(lang, "No GPS location has been reported for this driver.")}
                            </p>
                        )}
                        {locations.length === 0 && !selectedDriverId && (
                            <p className="border-t bg-slate-50 px-5 py-3 text-sm text-slate-600">
                                {translate(lang, "No drivers are sharing GPS right now.")}
                            </p>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
}
