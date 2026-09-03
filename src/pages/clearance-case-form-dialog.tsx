import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveClearanceCase, useStudents } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { ClearanceCase } from "@/lib/types";

const PURPOSES = ["transfer", "graduation", "withdrawal", "library", "general"] as const;
const STATUSES = ["pending", "in_progress", "cleared", "blocked"] as const;

export function ClearanceCaseFormDialog({ open, onOpenChange, clearanceCase }: { open: boolean; onOpenChange: (v: boolean) => void; clearanceCase?: ClearanceCase }) {
  const save = useSaveClearanceCase();
  const students = useStudents();
  const [form, setForm] = useState<Partial<ClearanceCase>>({});

  useEffect(() => {
    if (open) {
      setForm(clearanceCase ?? { purpose: "general" as const, status: "pending" as const, initiatedOn: todayISO(), createdOn: todayISO() });
    }
  }, [open, clearanceCase]);

  const set = (patch: Partial<ClearanceCase>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentId || !form.purpose || !form.status || !form.initiatedBy) return;
    const student = students.data?.find((s) => s.id === form.studentId);
    save.mutate(
      { ...(clearanceCase ?? { id: uid() }), ...form, studentName: student?.personName ?? "", tenantId: "tenant-default" } as ClearanceCase,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{clearanceCase ? "Edit clearance case" : "Create clearance case"}</DialogTitle>
          <DialogDescription>Initiate or update a clearance case (M05.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentId} onValueChange={(v) => set({ studentId: v })}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{(students.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.personName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Purpose</Label>
            <Select value={form.purpose} onValueChange={(v) => set({ purpose: v as ClearanceCase["purpose"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PURPOSES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ClearanceCase["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Initiated by</Label>
            <Input placeholder="Name of initiator" value={form.initiatedBy ?? ""} onChange={(e) => set({ initiatedBy: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentId || !form.purpose || !form.status || !form.initiatedBy}>
            <Plus className="h-4 w-4" /> {clearanceCase ? "Save changes" : "Create case"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
