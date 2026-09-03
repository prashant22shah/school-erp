import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveGpsTrack, useVehicles } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { GpsTrack, GpsStatus } from "@/lib/types";

const STATUSES: GpsStatus[] = ["moving", "stopped", "idle", "offline"];

export function GpsTrackFormDialog({ open, onOpenChange, gpsTrack }: { open: boolean; onOpenChange: (o: boolean) => void; gpsTrack?: GpsTrack | null }) {
  const save = useSaveGpsTrack();
  const vehicles = useVehicles();
  const [form, setForm] = useState<Partial<GpsTrack>>({});

  useEffect(() => {
    if (open) {
      setForm(
        gpsTrack ?? {
          vehicleId: "",
          latitude: 0,
          longitude: 0,
          speedKmph: 0,
          heading: 0,
          status: "moving",
          trackedOn: new Date().toISOString().slice(0, 16),
        }
      );
    }
  }, [open, gpsTrack]);

  const set = (patch: Partial<GpsTrack>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.vehicleId || form.latitude == null || form.longitude == null || form.speedKmph == null || !form.status || !form.trackedOn) return;
    const now = new Date().toISOString();
    const vehicleNo = vehicles.data?.find((v) => v.id === form.vehicleId)?.registrationNo;
    save.mutate(
      {
        id: gpsTrack?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: gpsTrack?.createdOn ?? now,
        updatedOn: now,
        vehicleId: form.vehicleId!,
        vehicleNo: vehicleNo || undefined,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        speedKmph: Number(form.speedKmph),
        heading: form.heading != null ? Number(form.heading) : undefined,
        status: form.status!,
        trackedOn: form.trackedOn!,
      } as GpsTrack,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{gpsTrack ? `Edit GPS track — ${gpsTrack.vehicleNo ?? gpsTrack.vehicleId}` : "Create GPS track"}</DialogTitle>
          <DialogDescription>Live GPS telemetry for vehicle tracking (M17.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Vehicle</Label>
            <Select value={form.vehicleId} onValueChange={(v) => set({ vehicleId: v })}>
              <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
              <SelectContent>{(vehicles.data ?? []).map((v) => <SelectItem key={v.id} value={v.id}>{v.registrationNo} ({v.type})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Latitude</Label>
            <Input type="number" step={0.0001} value={form.latitude ?? 0} onChange={(e) => set({ latitude: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Longitude</Label>
            <Input type="number" step={0.0001} value={form.longitude ?? 0} onChange={(e) => set({ longitude: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Speed (km/h)</Label>
            <Input type="number" min={0} value={form.speedKmph ?? 0} onChange={(e) => set({ speedKmph: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Heading (°)</Label>
            <Input type="number" min={0} max={360} value={form.heading ?? 0} onChange={(e) => set({ heading: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as GpsStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Tracked On</Label>
            <Input type="datetime-local" value={form.trackedOn ? form.trackedOn.slice(0, 16) : ""} onChange={(e) => set({ trackedOn: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.vehicleId || form.latitude == null || form.longitude == null || form.speedKmph == null || !form.status || !form.trackedOn}>
            <Plus className="h-4 w-4" /> {gpsTrack ? "Save changes" : "Create track"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
