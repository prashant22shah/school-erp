import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveVehicle } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Vehicle, VehicleType, VehicleStatus } from "@/lib/types";

const VEHICLE_TYPES: VehicleType[] = ["bus", "minibus", "van", "car"];
const STATUSES: VehicleStatus[] = ["active", "maintenance", "retired", "idle"];

export function VehicleFormDialog({ open, onOpenChange, vehicle }: { open: boolean; onOpenChange: (o: boolean) => void; vehicle?: Vehicle | null }) {
  const save = useSaveVehicle();
  const [form, setForm] = useState<Partial<Vehicle>>({});

  useEffect(() => {
    if (open) {
      setForm(
        vehicle ?? {
          registrationNo: "",
          type: "bus",
          capacity: 0,
          driverName: "",
          driverContact: "",
          fitnessUntil: new Date().toISOString().slice(0, 10),
          insuranceUntil: new Date().toISOString().slice(0, 10),
          permitUntil: new Date().toISOString().slice(0, 10),
          pollutionUntil: new Date().toISOString().slice(0, 10),
          status: "active",
        }
      );
    }
  }, [open, vehicle]);

  const set = (patch: Partial<Vehicle>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.registrationNo || !form.type || form.capacity == null || !form.fitnessUntil || !form.insuranceUntil || !form.permitUntil || !form.pollutionUntil || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: vehicle?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: vehicle?.createdOn ?? now,
        updatedOn: now,
        registrationNo: form.registrationNo!,
        type: form.type!,
        capacity: Number(form.capacity),
        driverName: form.driverName || undefined,
        driverContact: form.driverContact || undefined,
        fitnessUntil: form.fitnessUntil!,
        insuranceUntil: form.insuranceUntil!,
        permitUntil: form.permitUntil!,
        pollutionUntil: form.pollutionUntil!,
        status: form.status!,
      } as Vehicle,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{vehicle ? `Edit vehicle — ${vehicle.registrationNo}` : "Create vehicle"}</DialogTitle>
          <DialogDescription>Fleet & compliance vehicle details (M17.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Registration No</Label>
            <Input placeholder="e.g. Ba 1 Pa 2345" value={form.registrationNo ?? ""} onChange={(e) => set({ registrationNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as VehicleType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{VEHICLE_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Capacity</Label>
            <Input type="number" min={0} value={form.capacity ?? 0} onChange={(e) => set({ capacity: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as VehicleStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Driver Name</Label>
            <Input placeholder="Driver full name" value={form.driverName ?? ""} onChange={(e) => set({ driverName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Driver Contact</Label>
            <Input placeholder="9841xxxxxx" value={form.driverContact ?? ""} onChange={(e) => set({ driverContact: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Fitness Until</Label>
            <Input type="date" value={form.fitnessUntil ? form.fitnessUntil.slice(0, 10) : ""} onChange={(e) => set({ fitnessUntil: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Insurance Until</Label>
            <Input type="date" value={form.insuranceUntil ? form.insuranceUntil.slice(0, 10) : ""} onChange={(e) => set({ insuranceUntil: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Permit Until</Label>
            <Input type="date" value={form.permitUntil ? form.permitUntil.slice(0, 10) : ""} onChange={(e) => set({ permitUntil: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Pollution Until</Label>
            <Input type="date" value={form.pollutionUntil ? form.pollutionUntil.slice(0, 10) : ""} onChange={(e) => set({ pollutionUntil: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.registrationNo || !form.type || form.capacity == null || !form.fitnessUntil || !form.insuranceUntil || !form.permitUntil || !form.pollutionUntil || !form.status}>
            <Plus className="h-4 w-4" /> {vehicle ? "Save changes" : "Create vehicle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
