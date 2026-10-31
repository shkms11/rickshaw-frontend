import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Driver } from "../types/driver.type";

type Props = {
  driver: Driver;
};

const statusColorMap: Record<Driver["status"], string> = {
  active: "bg-emerald-700",
  inactive: "bg-neutral-400",
  suspended: "bg-amber-500",
  blocked: "bg-red-600",
  pending_verification: "bg-blue-500",
};

/** Shows the supplied driver's identity, status, contact, and assigned-vehicle details. */
export default function DriverProfile({ driver }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      {/* shine overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-white/10 to-transparent" />

      <Card className="border-0 bg-transparent shadow-none">
        <CardContent className="relative z-10 p-6 sm:p-8 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 rounded-2xl">
              <AvatarImage src={driver.photoUrl} alt={driver.name} />
              <AvatarFallback>
                {driver.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-neutral-800">
                {driver.name}
              </h2>
              <p className="text-sm text-neutral-500">{driver.phone}</p>
            </div>

            <Badge
              className={`${statusColorMap[driver.status]} text-white rounded-xl px-3 py-1`}
            >
              {driver.status.replace("_", " ")}
            </Badge>
          </div>

          {/* Info Grid */}
          <div className="space-y-3 text-sm text-neutral-700">
            <div className="flex justify-between">
              <span className="text-neutral-500">NID</span>
              <span>{driver.nid}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">License</span>
              <span>{driver.licenseNumber}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">Rickshaw</span>
              <span>{driver.assignedRickshawId ?? "Unassigned"}</span>
            </div>
          </div>

          {/* Address */}
          <div className="pt-4 border-t border-white/30">
            <p className="text-sm text-neutral-600">
              {driver.address.area}, {driver.address.city}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
