import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveVehicleMaintenance, useVehicles } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { VehicleMaintenance, MaintenanceType, MaintenanceStatus } from "@/lib/types";

const TYPES: MaintenanceType[] = ["fuel", "service", "repair", "inspection", "tyre", "other"];
const STATUSES: MaintenanceStatus[] = ["scheduled", "in_progress", "completed", "cancelled"];

export function VehicleMaintenanceFormDialog({ open, onOpenChange, vehicleMaintenance }: { open: boolean; onOpenChange: (o: boolean) => void; vehicleMaintenance?: VehicleMaintenance | null }) {
  const save = useSaveVehicleMaintenance();
  const vehicles = useVehicles();
  const [form, setForm] = useState<Partial<VehicleMaintenance>>({});

  useEffect(() => {
    if (open) {
      setForm(
        vehicleMaintenance ?? {
          vehicleId: "",
          type: "service",
          description: "",
          cost: 0,
          odometerKm: 0,
          performedOn: "",
          nextDueOn: "",
          status: "scheduled",
        }
      );
    }
  }, [open, vehicleMaintenance]);

  const set = (patch: Partial<VehicleMaintenance>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.vehicleId || !form.type || !form.description || form.cost == null || !form.status) return;
    const now = new Date().toISOString();
    const vehicleNo = vehicles.data?.find((v) => v.id === form.vehicleId)?.registrationNo;
    save.mutate(
      {
        id: vehicleMaintenance?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: vehicleMaintenance?.createdOn ?? now,
        updatedOn: now,
        vehicleId: form.vehicleId!,
        vehicleNo: vehicleNo || undefined,
        type: form.type!,
        description: form.description!,
        cost: Number(form.cost),
        odometerKm: form.odometerKm != null && form.odometerKm !== 0 ? Number(form.odometerKm) : undefined,
        performedOn: form.performedOn || undefined,
        nextDueOn: form.nextDueOn || undefined,
        status: form.status!,
      } as VehicleMaintenance,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{vehicleMaintenance ? `Edit maintenance — ${vehicleMaintenance.description.slice(0, 30)}` : "Create maintenance record"}</DialogTitle>
          <DialogDescription>Fuel, service and repair tracking (M17.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Vehicle</Label>
            <Select value={form.vehicleId} onValueChange={(v) => set({ vehicleId: v })}>
              <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
              <SelectContent>{(vehicles.data ?? []).map((v) => <SelectItem key={v.id} value={v.id}>{v.registrationNo} ({v.type})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as MaintenanceType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="e.g. Quarterly engine service" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Cost (NPR)</Label>
            <Input type="number" min={0} value={form.cost ?? 0} onChange={(e) => set({ cost: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as MaintenanceStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Odometer (km)</Label>
            <Input type="number" min={0} placeholder="Optional" value={form.odometerKm ?? 0} onChange={(e) => set({ odometerKm: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Performed On</Label>
            <Input type="date" value={form.performedOn ? form.performedOn.slice(0, 10) : ""} onChange={(e) => set({ performedOn: e.target.value || undefined })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Next Due On</Label>
            <Input type="date" value={form.nextDueOn ? form.nextDueOn.slice(0, 10) : ""} onChange={(e) => set({ nextDueOn: e.target.value || undefined })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.vehicleId || !form.type || !form.description || form.cost == null || !form.status}>
            <Plus className="h-4 w-4" /> {vehicleMaintenance ? "Save changes" : "Create record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
