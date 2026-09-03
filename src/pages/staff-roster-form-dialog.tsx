import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveStaffRoster, useShifts } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { StaffRoster, RosterStatus } from "@/lib/types";

const STATUSES: RosterStatus[] = ["scheduled", "completed", "absent", "on_leave"];

export function StaffRosterFormDialog({ open, onOpenChange, roster }: { open: boolean; onOpenChange: (o: boolean) => void; roster?: StaffRoster }) {
  const save = useSaveStaffRoster();
  const shifts = useShifts();
  const [form, setForm] = useState<Partial<StaffRoster>>({});

  useEffect(() => {
    if (open) setForm(roster ?? { staffRef: "", staffName: "", localDate: "", shiftId: "", status: "scheduled" });
  }, [open, roster]);

  const set = (patch: Partial<StaffRoster>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.staffRef || !form.staffName || !form.localDate || !form.shiftId) return;
    const now = new Date().toISOString();
    const shiftName = shifts.data?.find((s) => s.id === form.shiftId)?.name ?? "";
    save.mutate(
      {
        ...(roster ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        shiftName,
        updatedOn: now,
      } as StaffRoster,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{roster ? `Edit roster — ${roster.staffName}` : "Create staff roster"}</DialogTitle>
          <DialogDescription>Assign staff to shift on a date (M07.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Staff Ref</Label>
            <Select value={form.staffRef} onValueChange={(v) => {
              const names: Record<string,string> = { "uid-5": "Manoj Rai", "uid-2": "Ramesh Shrestha", "uid-4": "Suresh Thapa" };
              set({ staffRef: v, staffName: names[v] ?? v });
            }}>
              <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="uid-5">Manoj Rai</SelectItem>
                <SelectItem value="uid-2">Ramesh Shrestha</SelectItem>
                <SelectItem value="uid-4">Suresh Thapa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Staff Name</Label>
            <Input placeholder="Staff name" value={form.staffName ?? ""} onChange={(e) => set({ staffName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Local Date</Label>
            <Input type="date" value={form.localDate ?? ""} onChange={(e) => set({ localDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Shift</Label>
            <Select value={form.shiftId} onValueChange={(v) => set({ shiftId: v })}>
              <SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger>
              <SelectContent>{(shifts.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as RosterStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_"," ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.staffRef || !form.staffName || !form.localDate || !form.shiftId}>
            <Plus className="h-4 w-4" /> {roster ? "Save changes" : "Create roster"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
