import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveBoardRegistration, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { BoardRegistration } from "@/lib/types";

const STATUSES: BoardRegistration["status"][] = ["pending", "submitted", "approved", "rejected", "registered"];

export function BoardRegistrationFormDialog({ open, onOpenChange, registration }: { open: boolean; onOpenChange: (o: boolean) => void; registration?: BoardRegistration }) {
  const save = useSaveBoardRegistration();
  const students = useStudents();
  const [form, setForm] = useState<Partial<BoardRegistration>>({});

  useEffect(() => {
    if (open) setForm(registration ?? { studentRef: "", studentName: "", board: "", session: "", symbolNo: "", registrationNo: "", subjects: "", status: "pending" });
  }, [open, registration]);

  const set = (patch: Partial<BoardRegistration>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentRef || !form.board || !form.session) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(registration ?? { id: uid(), createdOn: now }),
        ...form,
        studentName,
      } as BoardRegistration,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{registration ? `Edit registration — ${registration.studentName}` : "Create board registration"}</DialogTitle>
          <DialogDescription>Register a student for board examination (M21.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
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
            <Label>Board</Label>
            <Input placeholder="e.g. NEB" value={form.board ?? ""} onChange={(e) => set({ board: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Session</Label>
            <Input placeholder="e.g. 2082" value={form.session ?? ""} onChange={(e) => set({ session: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Symbol No.</Label>
            <Input placeholder="e.g. 00123456" value={form.symbolNo ?? ""} onChange={(e) => set({ symbolNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Registration No.</Label>
            <Input placeholder="e.g. REG-2082-001" value={form.registrationNo ?? ""} onChange={(e) => set({ registrationNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as BoardRegistration["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Subjects</Label>
            <Input placeholder="e.g. English, Nepali, Physics, Chemistry" value={form.subjects ?? ""} onChange={(e) => set({ subjects: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef || !form.board || !form.session}>
            <Plus className="h-4 w-4" /> {registration ? "Save changes" : "Create registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
