import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveTimetableSlot, useTimetables } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { TimetableSlot } from "@/lib/types";

const DAY_PATTERNS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon-Fri", "Daily"];

export function TimetableSlotFormDialog({ open, onOpenChange, slot }: { open: boolean; onOpenChange: (o: boolean) => void; slot?: TimetableSlot }) {
  const save = useSaveTimetableSlot();
  const timetables = useTimetables();
  const [form, setForm] = useState<Partial<TimetableSlot>>({});

  useEffect(() => {
    if (open) {
      setForm(slot ?? { timetableId: "", dayPattern: "Mon", startTime: "10:00", endTime: "10:45" });
    }
  }, [open, slot]);

  const set = (patch: Partial<TimetableSlot>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.timetableId || !form.dayPattern || !form.startTime || !form.endTime) return;
    const now = new Date().toISOString();
    const ttName = timetables.data?.find((t) => t.id === form.timetableId)?.name ?? "";
    save.mutate(
      {
        ...(slot ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        timetableName: ttName,
        updatedOn: now,
      } as TimetableSlot,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{slot ? `Edit slot — ${slot.dayPattern} ${slot.startTime}` : "Create timetable slot"}</DialogTitle>
          <DialogDescription>Reusable time slot for a timetable (M07.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Timetable</Label>
            <Select value={form.timetableId} onValueChange={(v) => set({ timetableId: v })}>
              <SelectTrigger><SelectValue placeholder="Select timetable" /></SelectTrigger>
              <SelectContent>{(timetables.data ?? []).map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Day Pattern</Label>
            <Select value={form.dayPattern} onValueChange={(v) => set({ dayPattern: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DAY_PATTERNS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
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
          <Button onClick={submit} disabled={save.isPending || !form.timetableId || !form.dayPattern || !form.startTime || !form.endTime}>
            <Plus className="h-4 w-4" /> {slot ? "Save changes" : "Create slot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
