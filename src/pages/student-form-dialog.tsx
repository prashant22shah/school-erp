import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveStudent, usePersons, useGradeClasses, useSections } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { Student, StudentStatus } from "@/lib/types";

const STATUSES: StudentStatus[] = ["active", "inactive", "graduated", "transferred", "expelled", "withdrawn"];

export function StudentFormDialog({ open, onOpenChange, student }: { open: boolean; onOpenChange: (o: boolean) => void; student?: Student }) {
  const save = useSaveStudent();
  const persons = usePersons();
  const gradeClasses = useGradeClasses();
  const sections = useSections();
  const [form, setForm] = useState<Partial<Student>>({});

  useEffect(() => {
    if (open) {
      setForm(student ?? { personId: "", personName: "", admissionNo: "", admissionNumber: "", iemisId: "", status: "active", admittedOn: "", currentGradeId: "", currentSectionId: "", createdOn: todayISO() });
    }
  }, [open, student]);

  const set = (patch: Partial<Student>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.personId || !form.admissionNo || !form.admissionNumber || !form.status || !form.admittedOn) return;
    const person = persons.data?.find((p) => p.id === form.personId);
    save.mutate(
      { ...(student ?? { id: uid() }), ...form, personName: person?.legalName ?? "", tenantId: "tenant-default" } as Student,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{student ? `Edit student — ${student.personName}` : "Create student"}</DialogTitle>
          <DialogDescription>Register student admission and academic placement (M05.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Person</Label>
            <Select value={form.personId} onValueChange={(v) => set({ personId: v })}>
              <SelectTrigger><SelectValue placeholder="Select person" /></SelectTrigger>
              <SelectContent>{persons.data?.map((p) => <SelectItem key={p.id} value={p.id}>{p.legalName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Admission No</Label>
            <Input placeholder="e.g. ADM-001" value={form.admissionNo ?? ""} onChange={(e) => set({ admissionNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Admission Number</Label>
            <Input placeholder="e.g. 2081-001" value={form.admissionNumber ?? ""} onChange={(e) => set({ admissionNumber: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>EMIS ID</Label>
            <Input placeholder="e.g. IEMIS-12345" value={form.iemisId ?? ""} onChange={(e) => set({ iemisId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as StudentStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Admitted On</Label>
            <Input type="date" value={form.admittedOn ?? ""} onChange={(e) => set({ admittedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Current Grade</Label>
            <Select value={form.currentGradeId} onValueChange={(v) => set({ currentGradeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
              <SelectContent>{gradeClasses.data?.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Current Section</Label>
            <Select value={form.currentSectionId} onValueChange={(v) => set({ currentSectionId: v })}>
              <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
              <SelectContent>{sections.data?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.personId || !form.admissionNo || !form.admissionNumber || !form.status || !form.admittedOn}>
            <Plus className="h-4 w-4" /> {student ? "Save changes" : "Create student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
