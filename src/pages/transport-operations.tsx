import { useMemo, useState } from "react";
import { Navigation, Wrench, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { GpsTrackFormDialog } from "@/pages/gps-track-form-dialog";
import { VehicleMaintenanceFormDialog } from "@/pages/vehicle-maintenance-form-dialog";
import { useGpsTracks, useVehicleMaintenance, useDeleteGpsTrack, useDeleteVehicleMaintenance } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { GpsTrack, VehicleMaintenance } from "@/lib/types";

const gpsStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  moving: "success",
  stopped: "warning",
  idle: "secondary",
  offline: "destructive",
};

const maintenanceTypeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive" | "purple"> = {
  fuel: "warning",
  service: "info",
  repair: "destructive",
  inspection: "success",
  tyre: "secondary",
  other: "purple",
};

const maintenanceStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  scheduled: "warning",
  in_progress: "info",
  completed: "success",
  cancelled: "secondary",
};

export default function TransportOperationsPage() {
  const gpsTracks = useGpsTracks();
  const maintenance = useVehicleMaintenance();
  const deleteTrack = useDeleteGpsTrack();
  const deleteMaintenance = useDeleteVehicleMaintenance();
  const [q, setQ] = useState("");
  const [trackOpen, setTrackOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<GpsTrack | undefined>();
  const [maintOpen, setMaintOpen] = useState(false);
  const [editingMaint, setEditingMaint] = useState<VehicleMaintenance | undefined>();

  const filteredTracks = useMemo(() => {
    let list = gpsTracks.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((g) => (g.vehicleNo ?? "").toLowerCase().includes(s) || g.status.toLowerCase().includes(s) || g.vehicleId.toLowerCase().includes(s));
    }
    return list;
  }, [gpsTracks.data, q]);

  const filteredMaintenance = useMemo(() => {
    let list = maintenance.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((m) => (m.vehicleNo ?? "").toLowerCase().includes(s) || m.type.toLowerCase().includes(s) || m.description.toLowerCase().includes(s) || m.status.toLowerCase().includes(s));
    }
    return list;
  }, [maintenance.data, q]);

  const moving = (gpsTracks.data ?? []).filter((g) => g.status === "moving").length;
  const scheduled = (maintenance.data ?? []).filter((m) => m.status === "scheduled").length;
  const completed = (maintenance.data ?? []).filter((m) => m.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Navigation}
        title="GPS & Maintenance"
        titleNe="जिपिएस र मर्मत"
        microModule="M17.05/M17.06"
        description="Live GPS tracking and fuel & maintenance operations."
        actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { setEditingTrack(undefined); setTrackOpen(true); }}><CanCreate resource="gpsTracks">New GPS Track</CanCreate></Button><Button onClick={() => { setEditingMaint(undefined); setMaintOpen(true); }}> New Maintenance</Button></div>}
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Navigation className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">GPS Tracks</p><p className="text-lg font-bold">{gpsTracks.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Navigation className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Moving</p><p className="text-lg font-bold">{moving}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Wrench className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Scheduled Maint.</p><p className="text-lg font-bold">{scheduled}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Wrench className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completed}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search tracks or maintenance…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="tracks">
        <TabsList><TabsTrigger value="tracks">GPS Tracks</TabsTrigger><TabsTrigger value="maintenance">Maintenance</TabsTrigger></TabsList>

        <TabsContent value="tracks" className="mt-4">
          {gpsTracks.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Vehicle</TableHead><TableHead>Coordinates</TableHead><TableHead>Speed</TableHead><TableHead>Heading</TableHead><TableHead>Status</TableHead><TableHead>Tracked On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredTracks.map((g) => (<TableRow key={g.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{g.vehicleNo ?? g.vehicleId.slice(0, 8)}</code></TableCell><TableCell><span className="text-xs font-mono">{g.latitude.toFixed(4)}, {g.longitude.toFixed(4)}</span></TableCell><TableCell><span className="text-sm font-mono">{g.speedKmph} km/h</span></TableCell><TableCell><span className="text-sm font-mono">{g.heading != null ? `${g.heading}°` : "—"}</span></TableCell><TableCell><Badge variant={gpsStatusVariant[g.status] ?? "secondary"} className="capitalize">{g.status}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(g.trackedOn)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="gpsTracks" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          {maintenance.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Vehicle</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead>Cost</TableHead><TableHead>Odometer</TableHead><TableHead>Performed / Next Due</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredMaintenance.map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{m.vehicleNo ?? m.vehicleId.slice(0, 8)}</code></TableCell><TableCell><Badge variant={maintenanceTypeVariant[m.type] ?? "secondary"} className="capitalize">{m.type}</Badge></TableCell><TableCell><span className="line-clamp-1 max-w-[200px] text-sm">{m.description}</span></TableCell><TableCell><span className="text-sm font-mono">{m.cost.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono">{m.odometerKm != null ? `${m.odometerKm.toLocaleString()} km` : "—"}</span></TableCell><TableCell><span className="text-xs">{m.performedOn ? fmtDate(m.performedOn) : "—"} {m.nextDueOn ? `→ ${fmtDate(m.nextDueOn)}` : ""}</span></TableCell><TableCell><Badge variant={maintenanceStatusVariant[m.status] ?? "secondary"} className="capitalize">{m.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="vehicleMaintenance" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <GpsTrackFormDialog open={trackOpen} onOpenChange={setTrackOpen} gpsTrack={editingTrack} />
      <VehicleMaintenanceFormDialog open={maintOpen} onOpenChange={setMaintOpen} vehicleMaintenance={editingMaint} />
    </div>
  );
}
