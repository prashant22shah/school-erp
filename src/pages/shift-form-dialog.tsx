import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveShift, useCampuses } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Shift } from "@/lib/types";

export function ShiftFormDialog({ open, onOpenChange, shift }: { open: boolean; onOpenChange: (o: boolean) => void; shift?: Shift }) {
  const save = useSaveShift();
  const campuses = useCampuses();
  const [form, setForm] = useState<Partial<Shift>>({});

  useEffect(() => {
    if (open) setForm(shift ?? { campusId: "", code: "", name: "", startTime: "08:00", endTime: "14:00" });
  }, [open, shift]);

  const set = (patch: Partial<Shift>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.campusId || !form.code || !form.name || !form.startTime || !form.endTime) return;
    const now = new Date().toISOString();
    const campusName = campuses.data?.find((c) => c.id === form.campusId)?.name ?? "";
    save.mutate(
      {
        ...(shift ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        campusName,
        updatedOn: now,
      } as Shift,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{shift ? `Edit shift — ${shift.name}` : "Create shift"}</DialogTitle>
          <DialogDescription>Define staff shift with time window (M07.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Campus</Label>
            <Select value={form.campusId} onValueChange={(v) => set({ campusId: v })}>
              <SelectTrigger><SelectValue placeholder="Select campus" /></SelectTrigger>
              <SelectContent>{(campuses.data ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. MOR-08" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="e.g. Morning Shift" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Start Time</Label>
            <Input type="time" value={form.startTime ?? ""} onChange={(e) => set({ startTime: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>End Time</Label>
            <Input type="time" value={form.endTime ?? ""} onChange={(e) => set({ endTime: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.campusId || !form.code || !form.name || !form.startTime || !form.endTime}>
            <Plus className="h-4 w-4" /> {shift ? "Save changes" : "Create shift"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
