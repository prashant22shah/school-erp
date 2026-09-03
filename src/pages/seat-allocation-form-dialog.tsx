import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSeatAllocation, useExams, useExamRooms, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { SeatAllocation } from "@/lib/types";

export function SeatAllocationFormDialog({ open, onOpenChange, allocation }: { open: boolean; onOpenChange: (o: boolean) => void; allocation?: SeatAllocation }) {
  const save = useSaveSeatAllocation();
  const exams = useExams();
  const rooms = useExamRooms();
  const students = useStudents();
  const [form, setForm] = useState<Partial<SeatAllocation>>({});

  useEffect(() => {
    if (open) setForm(allocation ?? { examId: "", roomId: "", studentRef: "", studentName: "", seatNo: "" });
  }, [open, allocation]);

  const set = (patch: Partial<SeatAllocation>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.examId || !form.roomId || !form.studentRef || !form.seatNo) return;
    const now = new Date().toISOString();
    const roomName = rooms.data?.find((r) => r.id === form.roomId)?.locationName ?? "";
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(allocation ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        roomName,
        studentName,
        updatedOn: now,
      } as SeatAllocation,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{allocation ? `Edit seat — ${allocation.seatNo}` : "Create seat allocation"}</DialogTitle>
          <DialogDescription>Allocate a seat to a student in an exam room (M08.04).</DialogDescription>
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
            <Label>Room</Label>
            <Select value={form.roomId} onValueChange={(v) => set({ roomId: v })}>
              <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
              <SelectContent>{(rooms.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.locationName ?? r.locationRef} ({r.examName ?? r.examId})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentRef} onValueChange={(v) => {
              const name = students.data?.find((s) => s.id === v)?.personName ?? "";
              set({ studentRef: v, studentName: name });
            }}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{(students.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.personName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Seat No</Label>
            <Input placeholder="e.g. A-01" value={form.seatNo ?? ""} onChange={(e) => set({ seatNo: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Student Name</Label>
            <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.examId || !form.roomId || !form.studentRef || !form.seatNo}>
            <Plus className="h-4 w-4" /> {allocation ? "Save changes" : "Allocate seat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
