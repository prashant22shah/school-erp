import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveRiderAssignment, useTransportRoutes, useBusStops } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { RiderAssignment, RiderType, AssignmentStatus } from "@/lib/types";

const RIDER_TYPES: RiderType[] = ["student", "staff"];
const STATUSES: AssignmentStatus[] = ["active", "inactive", "pending", "cancelled"];

export function RiderAssignmentFormDialog({ open, onOpenChange, riderAssignment }: { open: boolean; onOpenChange: (o: boolean) => void; riderAssignment?: RiderAssignment | null }) {
  const save = useSaveRiderAssignment();
  const routes = useTransportRoutes();
  const stops = useBusStops();
  const [form, setForm] = useState<Partial<RiderAssignment>>({});

  useEffect(() => {
    if (open) {
      setForm(
        riderAssignment ?? {
          riderRef: "",
          riderName: "",
          riderType: "student",
          routeId: "",
          stopId: "",
          pickupTime: "",
          status: "active",
        }
      );
    }
  }, [open, riderAssignment]);

  const set = (patch: Partial<RiderAssignment>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.riderRef || !form.riderName || !form.riderType || !form.routeId || !form.status) return;
    const now = new Date().toISOString();
    const routeName = routes.data?.find((r) => r.id === form.routeId)?.name;
    const stopName = form.stopId ? stops.data?.find((s) => s.id === form.stopId)?.name : undefined;
    save.mutate(
      {
        id: riderAssignment?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: riderAssignment?.createdOn ?? now,
        updatedOn: now,
        riderRef: form.riderRef!,
        riderName: form.riderName!,
        riderType: form.riderType!,
        routeId: form.routeId!,
        routeName: routeName || undefined,
        stopId: form.stopId || undefined,
        stopName: stopName || undefined,
        vehicleId: undefined,
        pickupTime: form.pickupTime || undefined,
        status: form.status!,
      } as RiderAssignment,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{riderAssignment ? `Edit assignment — ${riderAssignment.riderName}` : "Create rider assignment"}</DialogTitle>
          <DialogDescription>Rider to route/stop assignment (M17.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Rider Ref</Label>
            <Input placeholder="e.g. enrol-1 or staff id" value={form.riderRef ?? ""} onChange={(e) => set({ riderRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Rider Type</Label>
            <Select value={form.riderType} onValueChange={(v) => set({ riderType: v as RiderType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RIDER_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Rider Name</Label>
            <Input placeholder="Full name" value={form.riderName ?? ""} onChange={(e) => set({ riderName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Route</Label>
            <Select value={form.routeId} onValueChange={(v) => set({ routeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select route" /></SelectTrigger>
              <SelectContent>{(routes.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.code} – {r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Stop</Label>
            <Select value={form.stopId ?? "__none__"} onValueChange={(v) => set({ stopId: v === "__none__" ? undefined : v })}>
              <SelectTrigger><SelectValue placeholder="Select stop (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— None —</SelectItem>
                {(stops.data ?? []).filter((s) => !form.routeId || s.routeId === form.routeId).map((s) => <SelectItem key={s.id} value={s.id}>{s.name} (Seq {s.sequence})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Pickup Time</Label>
            <Input type="time" value={form.pickupTime ?? ""} onChange={(e) => set({ pickupTime: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as AssignmentStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.riderRef || !form.riderName || !form.riderType || !form.routeId || !form.status}>
            <Plus className="h-4 w-4" /> {riderAssignment ? "Save changes" : "Create assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
