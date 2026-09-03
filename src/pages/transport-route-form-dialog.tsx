import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveTransportRoute, useVehicles } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { TransportRoute } from "@/lib/types";

type RouteStatus = TransportRoute["status"];
type Direction = TransportRoute["direction"];
const STATUSES: RouteStatus[] = ["active", "inactive", "archived"];
const DIRECTIONS: Direction[] = ["pickup", "drop", "both"];

export function TransportRouteFormDialog({ open, onOpenChange, transportRoute }: { open: boolean; onOpenChange: (o: boolean) => void; transportRoute?: TransportRoute | null }) {
  const save = useSaveTransportRoute();
  const vehicles = useVehicles();
  const [form, setForm] = useState<Partial<TransportRoute>>({});

  useEffect(() => {
    if (open) {
      setForm(
        transportRoute ?? {
          code: "",
          name: "",
          direction: "both",
          vehicleId: "",
          totalDistanceKm: 0,
          estimatedMins: 0,
          status: "active",
        }
      );
    }
  }, [open, transportRoute]);

  const set = (patch: Partial<TransportRoute>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name || !form.direction || form.totalDistanceKm == null || form.estimatedMins == null || !form.status) return;
    const now = new Date().toISOString();
    const vehicleNo = form.vehicleId ? vehicles.data?.find((v) => v.id === form.vehicleId)?.registrationNo : undefined;
    save.mutate(
      {
        id: transportRoute?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: transportRoute?.createdOn ?? now,
        updatedOn: now,
        code: form.code!,
        name: form.name!,
        direction: form.direction!,
        vehicleId: form.vehicleId || undefined,
        vehicleNo: vehicleNo || undefined,
        totalDistanceKm: Number(form.totalDistanceKm),
        estimatedMins: Number(form.estimatedMins),
        status: form.status!,
      } as TransportRoute,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{transportRoute ? `Edit route — ${transportRoute.code}` : "Create transport route"}</DialogTitle>
          <DialogDescription>Route master with vehicle and distance mapping (M17.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. R-04" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as RouteStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="e.g. Baneshwor – Koteshwor Loop" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Direction</Label>
            <Select value={form.direction} onValueChange={(v) => set({ direction: v as Direction })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DIRECTIONS.map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Vehicle</Label>
            <Select value={form.vehicleId ?? "__none__"} onValueChange={(v) => set({ vehicleId: v === "__none__" ? undefined : v })}>
              <SelectTrigger><SelectValue placeholder="Select vehicle (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— None —</SelectItem>
                {(vehicles.data ?? []).map((v) => <SelectItem key={v.id} value={v.id}>{v.registrationNo} ({v.type})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Total Distance (km)</Label>
            <Input type="number" min={0} step={0.1} value={form.totalDistanceKm ?? 0} onChange={(e) => set({ totalDistanceKm: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Estimated Mins</Label>
            <Input type="number" min={0} value={form.estimatedMins ?? 0} onChange={(e) => set({ estimatedMins: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name || !form.direction || form.totalDistanceKm == null || form.estimatedMins == null || !form.status}>
            <Plus className="h-4 w-4" /> {transportRoute ? "Save changes" : "Create route"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
