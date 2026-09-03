import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveFeeAssignment, useFeeStructures, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { FeeAssignment, FeeAssignmentStatus } from "@/lib/types";

const STATUSES: FeeAssignmentStatus[] = ["assigned", "invoiced", "waived"];

export function FeeAssignmentFormDialog({ open, onOpenChange, assignment }: { open: boolean; onOpenChange: (o: boolean) => void; assignment?: FeeAssignment }) {
  const save = useSaveFeeAssignment();
  const feeStructures = useFeeStructures();
  const students = useStudents();
  const [form, setForm] = useState<Partial<FeeAssignment>>({});

  useEffect(() => {
    if (open) {
      setForm(
        assignment ?? {
          studentRef: "",
          studentName: "",
          feeStructureId: "",
          amount: 0,
          discountAmount: 0,
          dueDate: new Date().toISOString().slice(0, 10),
          status: "assigned",
        }
      );
    }
  }, [open, assignment]);

  const set = (patch: Partial<FeeAssignment>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentRef || !form.feeStructureId || form.amount == null || form.discountAmount == null || !form.dueDate || !form.status) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? form.studentRef!;
    const feeStructureName = feeStructures.data?.find((f) => f.id === form.feeStructureId)?.name ?? "";
    save.mutate(
      {
        id: assignment?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: assignment?.createdOn ?? now,
        updatedOn: now,
        studentRef: form.studentRef!,
        studentName,
        feeStructureId: form.feeStructureId!,
        feeStructureName,
        amount: Number(form.amount),
        discountAmount: Number(form.discountAmount),
        dueDate: form.dueDate!,
        status: form.status!,
      } as FeeAssignment,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{assignment ? `Edit fee assignment — ${assignment.studentName}` : "Create fee assignment"}</DialogTitle>
          <DialogDescription>Assign a fee structure to a student (M12.06/M12.09).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentRef} onValueChange={(v) => set({ studentRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{(students.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.personName} ({s.admissionNo})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Fee Structure</Label>
            <Select value={form.feeStructureId} onValueChange={(v) => set({ feeStructureId: v })}>
              <SelectTrigger><SelectValue placeholder="Select fee" /></SelectTrigger>
              <SelectContent>{(feeStructures.data ?? []).map((f) => <SelectItem key={f.id} value={f.id}>{f.code} — {f.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {/* fallback if no students loaded */}
          {(students.data ?? []).length === 0 && (
            <div className="space-y-1.5">
              <Label>Student Name (manual)</Label>
              <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value, studentRef: e.target.value || form.studentRef })} />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Amount</Label>
            <Input type="number" min={0} value={form.amount ?? 0} onChange={(e) => set({ amount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Discount Amount</Label>
            <Input type="number" min={0} value={form.discountAmount ?? 0} onChange={(e) => set({ discountAmount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Due Date</Label>
            <Input type="date" value={form.dueDate ? form.dueDate.slice(0, 10) : ""} onChange={(e) => set({ dueDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as FeeAssignmentStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef || !form.feeStructureId || !form.dueDate || !form.status}>
            <Plus className="h-4 w-4" /> {assignment ? "Save changes" : "Create assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
