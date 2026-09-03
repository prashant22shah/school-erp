import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveExamRoom, useExams, useLocations } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ExamRoom } from "@/lib/types";

export function ExamRoomFormDialog({ open, onOpenChange, room }: { open: boolean; onOpenChange: (o: boolean) => void; room?: ExamRoom }) {
  const save = useSaveExamRoom();
  const exams = useExams();
  const locations = useLocations();
  const [form, setForm] = useState<Partial<ExamRoom>>({});

  useEffect(() => {
    if (open) setForm(room ?? { examId: "", locationRef: "", capacity: 30 });
  }, [open, room]);

  const set = (patch: Partial<ExamRoom>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.examId || !form.locationRef || form.capacity == null) return;
    const now = new Date().toISOString();
    const examName = exams.data?.find((e) => e.id === form.examId)?.name ?? "";
    const locationName = locations.data?.find((l) => l.id === form.locationRef)?.name ?? "";
    save.mutate(
      {
        ...(room ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        capacity: Number(form.capacity),
        examName,
        locationName,
        updatedOn: now,
      } as ExamRoom,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{room ? `Edit exam room — ${room.locationName ?? room.locationRef}` : "Create exam room"}</DialogTitle>
          <DialogDescription>Assign a venue and capacity for an exam (M08.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Exam</Label>
            <Select value={form.examId} onValueChange={(v) => set({ examId: v })}>
              <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
              <SelectContent>{(exams.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.code} — {e.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Select value={form.locationRef} onValueChange={(v) => set({ locationRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
              <SelectContent>{(locations.data ?? []).map((l) => <SelectItem key={l.id} value={l.id}>{l.name} ({l.code})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Capacity</Label>
            <Input type="number" min={0} value={form.capacity ?? 0} onChange={(e) => set({ capacity: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.examId || !form.locationRef}>
            <Plus className="h-4 w-4" /> {room ? "Save changes" : "Create exam room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
