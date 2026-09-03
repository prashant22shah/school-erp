import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveFormerStudent, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { FormerStudent } from "@/lib/types";

const STATUSES: FormerStudent["status"][] = ["active", "inactive", "lost_contact"];

export function FormerStudentFormDialog({ open, onOpenChange, student }: { open: boolean; onOpenChange: (o: boolean) => void; student?: FormerStudent }) {
  const save = useSaveFormerStudent();
  const students = useStudents();
  const [form, setForm] = useState<Partial<FormerStudent>>({});

  useEffect(() => {
    if (open) setForm(student ?? { studentRef: "", studentName: "", completionYear: new Date().getFullYear(), lastClass: "", contactEmail: "", contactPhone: "", status: "active" });
  }, [open, student]);

  const set = (patch: Partial<FormerStudent>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentRef || !form.studentName) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(student ?? { id: uid(), createdOn: now }),
        ...form,
      } as FormerStudent,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{student ? `Edit former student — ${student.studentName}` : "Add former student"}</DialogTitle>
          <DialogDescription>Record a former student for alumni tracking (M21.07).</DialogDescription>
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
            <Label>Completion Year</Label>
            <Input type="number" min={2000} max={2100} value={form.completionYear ?? new Date().getFullYear()} onChange={(e) => set({ completionYear: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Last Class</Label>
            <Input placeholder="e.g. Grade 12" value={form.lastClass ?? ""} onChange={(e) => set({ lastClass: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as FormerStudent["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Contact Email</Label>
            <Input type="email" placeholder="student@example.com" value={form.contactEmail ?? ""} onChange={(e) => set({ contactEmail: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Contact Phone</Label>
            <Input placeholder="9800000000" value={form.contactPhone ?? ""} onChange={(e) => set({ contactPhone: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef || !form.studentName}>
            <Plus className="h-4 w-4" /> {student ? "Save changes" : "Add former student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
