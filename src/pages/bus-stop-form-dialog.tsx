import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveBusStop, useTransportRoutes } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { BusStop } from "@/lib/types";

export function BusStopFormDialog({ open, onOpenChange, busStop }: { open: boolean; onOpenChange: (o: boolean) => void; busStop?: BusStop | null }) {
  const save = useSaveBusStop();
  const routes = useTransportRoutes();
  const [form, setForm] = useState<Partial<BusStop>>({});

  useEffect(() => {
    if (open) {
      setForm(
        busStop ?? {
          routeId: "",
          name: "",
          sequence: 1,
          arrivalTime: "",
          latitude: 0,
          longitude: 0,
          status: "active",
        }
      );
    }
  }, [open, busStop]);

  const set = (patch: Partial<BusStop>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.routeId || !form.name || form.sequence == null || !form.status) return;
    const now = new Date().toISOString();
    const routeName = routes.data?.find((r) => r.id === form.routeId)?.name;
    save.mutate(
      {
        id: busStop?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: busStop?.createdOn ?? now,
        updatedOn: now,
        routeId: form.routeId!,
        routeName: routeName || undefined,
        name: form.name!,
        sequence: Number(form.sequence),
        arrivalTime: form.arrivalTime || undefined,
        latitude: form.latitude != null && form.latitude !== 0 ? Number(form.latitude) : undefined,
        longitude: form.longitude != null && form.longitude !== 0 ? Number(form.longitude) : undefined,
        status: form.status!,
      } as BusStop,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{busStop ? `Edit stop — ${busStop.name}` : "Create bus stop"}</DialogTitle>
          <DialogDescription>Stop master with sequence and geo coordinates (M17.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Route</Label>
            <Select value={form.routeId} onValueChange={(v) => set({ routeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select route" /></SelectTrigger>
              <SelectContent>{(routes.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.code} – {r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as BusStop["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="inactive">inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Stop Name</Label>
            <Input placeholder="e.g. Baneshwor Chowk" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Sequence</Label>
            <Input type="number" min={1} value={form.sequence ?? 1} onChange={(e) => set({ sequence: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Arrival Time</Label>
            <Input type="time" value={form.arrivalTime ?? ""} onChange={(e) => set({ arrivalTime: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Latitude</Label>
            <Input type="number" step={0.0001} placeholder="27.691" value={form.latitude ?? 0} onChange={(e) => set({ latitude: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Longitude</Label>
            <Input type="number" step={0.0001} placeholder="85.335" value={form.longitude ?? 0} onChange={(e) => set({ longitude: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.routeId || !form.name || form.sequence == null || !form.status}>
            <Plus className="h-4 w-4" /> {busStop ? "Save changes" : "Create stop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
