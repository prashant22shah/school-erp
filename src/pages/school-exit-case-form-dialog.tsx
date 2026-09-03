import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSchoolExitCase, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { SchoolExitCase } from "@/lib/types";

const LEAVING_TYPES: SchoolExitCase["leavingType"][] = ["transfer", "completion", "withdrawal", "expulsion"];
const STATUSES: SchoolExitCase["status"][] = ["draft", "submitted", "approved", "completed"];

export function SchoolExitCaseFormDialog({ open, onOpenChange, exitCase }: { open: boolean; onOpenChange: (o: boolean) => void; exitCase?: SchoolExitCase }) {
  const save = useSaveSchoolExitCase();
  const students = useStudents();
  const [form, setForm] = useState<Partial<SchoolExitCase>>({});

  useEffect(() => {
    if (open) setForm(exitCase ?? { studentRef: "", studentName: "", leavingType: "transfer", lastWorkingDate: new Date().toISOString().slice(0, 10), reason: "", clearanceStatus: "pending", status: "draft" });
  }, [open, exitCase]);

  const set = (patch: Partial<SchoolExitCase>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentRef || !form.leavingType) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(exitCase ?? { id: uid(), createdOn: now }),
        ...form,
        studentName,
      } as SchoolExitCase,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{exitCase ? `Edit exit case — ${exitCase.studentName}` : "Create exit case"}</DialogTitle>
          <DialogDescription>Process a student's school leaving, transfer or withdrawal (M21.06).</DialogDescription>
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
            <Label>Leaving Type</Label>
            <Select value={form.leavingType} onValueChange={(v) => set({ leavingType: v as SchoolExitCase["leavingType"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LEAVING_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Last Working Date</Label>
            <Input type="date" value={form.lastWorkingDate ? form.lastWorkingDate.slice(0, 10) : ""} onChange={(e) => set({ lastWorkingDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as SchoolExitCase["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Input placeholder="Reason for leaving" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Clearance Status</Label>
            <Input placeholder="e.g. pending, cleared" value={form.clearanceStatus ?? ""} onChange={(e) => set({ clearanceStatus: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef || !form.leavingType}>
            <Plus className="h-4 w-4" /> {exitCase ? "Save changes" : "Create exit case"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
