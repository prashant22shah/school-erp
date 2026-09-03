import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveBoardingLog, useRiderAssignments, useTransportRoutes, useVehicles } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { BoardingLog, BoardingStatus } from "@/lib/types";

const STATUSES: BoardingStatus[] = ["boarded", "alighted", "absent", "no_show"];

export function BoardingLogFormDialog({ open, onOpenChange, boardingLog }: { open: boolean; onOpenChange: (o: boolean) => void; boardingLog?: BoardingLog | null }) {
  const save = useSaveBoardingLog();
  const riderAssignments = useRiderAssignments();
  const routes = useTransportRoutes();
  const vehicles = useVehicles();
  const [form, setForm] = useState<Partial<BoardingLog>>({});

  useEffect(() => {
    if (open) {
      setForm(
        boardingLog ?? {
          riderAssignmentId: "",
          riderName: "",
          routeId: "",
          vehicleId: "",
          logDate: new Date().toISOString().slice(0, 10),
          boardingStatus: "boarded",
          remarks: "",
        }
      );
    }
  }, [open, boardingLog]);

  const set = (patch: Partial<BoardingLog>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.riderName || !form.logDate || !form.boardingStatus) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: boardingLog?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: boardingLog?.createdOn ?? now,
        updatedOn: now,
        riderAssignmentId: form.riderAssignmentId || undefined,
        riderName: form.riderName!,
        routeId: form.routeId || undefined,
        vehicleId: form.vehicleId || undefined,
        logDate: form.logDate!,
        boardingStatus: form.boardingStatus!,
        recordedOn: now,
        remarks: form.remarks || undefined,
      } as BoardingLog,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{boardingLog ? `Edit boarding log — ${boardingLog.riderName}` : "Create boarding log"}</DialogTitle>
          <DialogDescription>Boarding & safety log entries (M17.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Rider Assignment</Label>
            <Select value={form.riderAssignmentId ?? "__none__"} onValueChange={(v) => {
              const actual = v === "__none__" ? undefined : v;
              const ra = actual ? riderAssignments.data?.find((r) => r.id === actual) : undefined;
              set({ riderAssignmentId: actual, riderName: ra?.riderName ?? form.riderName });
            }}>
              <SelectTrigger><SelectValue placeholder="Select assignment (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— None / Manual —</SelectItem>
                {(riderAssignments.data ?? []).map((ra) => <SelectItem key={ra.id} value={ra.id}>{ra.riderName} ({ra.routeName ?? ra.routeId})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Rider Name</Label>
            <Input placeholder="Rider full name" value={form.riderName ?? ""} onChange={(e) => set({ riderName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Route</Label>
            <Select value={form.routeId ?? "__none__"} onValueChange={(v) => set({ routeId: v === "__none__" ? undefined : v })}>
              <SelectTrigger><SelectValue placeholder="Select route (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— None —</SelectItem>
                {(routes.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.code} – {r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Vehicle</Label>
            <Select value={form.vehicleId ?? "__none__"} onValueChange={(v) => set({ vehicleId: v === "__none__" ? undefined : v })}>
              <SelectTrigger><SelectValue placeholder="Select vehicle (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— None —</SelectItem>
                {(vehicles.data ?? []).map((v) => <SelectItem key={v.id} value={v.id}>{v.registrationNo}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Log Date</Label>
            <Input type="date" value={form.logDate ? form.logDate.slice(0, 10) : ""} onChange={(e) => set({ logDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Boarding Status</Label>
            <Select value={form.boardingStatus} onValueChange={(v) => set({ boardingStatus: v as BoardingStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Remarks</Label>
            <Textarea placeholder="Optional remarks…" value={form.remarks ?? ""} onChange={(e) => set({ remarks: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.riderName || !form.logDate || !form.boardingStatus}>
            <Plus className="h-4 w-4" /> {boardingLog ? "Save changes" : "Create log"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
