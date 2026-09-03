import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveRouteSchedule, useTransportRoutes } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { RouteSchedule } from "@/lib/types";

type ScheduleStatus = RouteSchedule["status"];
const STATUSES: ScheduleStatus[] = ["active", "suspended", "cancelled"];

export function RouteScheduleFormDialog({ open, onOpenChange, routeSchedule }: { open: boolean; onOpenChange: (o: boolean) => void; routeSchedule?: RouteSchedule | null }) {
  const save = useSaveRouteSchedule();
  const routes = useTransportRoutes();
  const [form, setForm] = useState<Partial<RouteSchedule>>({});

  useEffect(() => {
    if (open) {
      setForm(
        routeSchedule ?? {
          routeId: "",
          dayPattern: "Mon-Sat",
          departureTime: "",
          arrivalTime: "",
          status: "active",
        }
      );
    }
  }, [open, routeSchedule]);

  const set = (patch: Partial<RouteSchedule>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.routeId || !form.dayPattern || !form.departureTime || !form.arrivalTime || !form.status) return;
    const now = new Date().toISOString();
    const routeName = routes.data?.find((r) => r.id === form.routeId)?.name;
    save.mutate(
      {
        id: routeSchedule?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: routeSchedule?.createdOn ?? now,
        updatedOn: now,
        routeId: form.routeId!,
        routeName: routeName || undefined,
        dayPattern: form.dayPattern!,
        departureTime: form.departureTime!,
        arrivalTime: form.arrivalTime!,
        status: form.status!,
      } as RouteSchedule,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{routeSchedule ? `Edit schedule — ${routeSchedule.routeName ?? routeSchedule.routeId}` : "Create route schedule"}</DialogTitle>
          <DialogDescription>Schedule with day pattern and timings (M17.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Route</Label>
            <Select value={form.routeId} onValueChange={(v) => set({ routeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select route" /></SelectTrigger>
              <SelectContent>{(routes.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.code} – {r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Day Pattern</Label>
            <Input placeholder="e.g. Mon-Sat, Mon-Fri, Daily" value={form.dayPattern ?? ""} onChange={(e) => set({ dayPattern: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ScheduleStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Departure Time</Label>
            <Input type="time" value={form.departureTime ?? ""} onChange={(e) => set({ departureTime: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Arrival Time</Label>
            <Input type="time" value={form.arrivalTime ?? ""} onChange={(e) => set({ arrivalTime: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.routeId || !form.dayPattern || !form.departureTime || !form.arrivalTime || !form.status}>
            <Plus className="h-4 w-4" /> {routeSchedule ? "Save changes" : "Create schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
