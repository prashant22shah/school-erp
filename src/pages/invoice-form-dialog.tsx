import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveInvoice, useAcademicYears, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/lib/types";

const STATUSES: InvoiceStatus[] = ["draft", "issued", "paid", "overdue", "cancelled"];

export function InvoiceFormDialog({ open, onOpenChange, invoice }: { open: boolean; onOpenChange: (o: boolean) => void; invoice?: Invoice }) {
  const save = useSaveInvoice();
  const academicYears = useAcademicYears();
  const students = useStudents();
  const [form, setForm] = useState<Partial<Invoice>>({});

  useEffect(() => {
    if (open) {
      setForm(
        invoice ?? {
          studentRef: "",
          studentName: "",
          academicPeriodRef: "",
          invoiceNo: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
          issueDate: new Date().toISOString().slice(0, 10),
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          amount: 0,
          paidAmount: 0,
          balance: 0,
          status: "draft",
        }
      );
    }
  }, [open, invoice]);

  const set = (patch: Partial<Invoice>) => setForm((f) => ({ ...f, ...patch }));

  // auto compute balance when amount/paidAmount change
  useEffect(() => {
    if (form.amount != null && form.paidAmount != null) {
      const bal = Number(form.amount) - Number(form.paidAmount);
      if (bal !== form.balance) setForm((f) => ({ ...f, balance: bal }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.amount, form.paidAmount]);

  const submit = () => {
    if (!form.studentRef || !form.academicPeriodRef || !form.invoiceNo || !form.issueDate || !form.dueDate || form.amount == null || form.paidAmount == null || form.balance == null || !form.status) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? form.studentRef!;
    save.mutate(
      {
        id: invoice?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: invoice?.createdOn ?? now,
        updatedOn: now,
        studentRef: form.studentRef!,
        studentName,
        academicPeriodRef: form.academicPeriodRef!,
        invoiceNo: form.invoiceNo!,
        issueDate: form.issueDate!,
        dueDate: form.dueDate!,
        amount: Number(form.amount),
        paidAmount: Number(form.paidAmount),
        balance: Number(form.balance),
        status: form.status!,
      } as Invoice,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{invoice ? `Edit invoice — ${invoice.invoiceNo}` : "Create invoice"}</DialogTitle>
          <DialogDescription>Issue or update student invoice (M12.07/M12.08).</DialogDescription>
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
            <Label>Academic Period</Label>
            <Select value={form.academicPeriodRef} onValueChange={(v) => set({ academicPeriodRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
              <SelectContent>{(academicYears.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {(students.data ?? []).length === 0 && (
            <div className="space-y-1.5">
              <Label>Student Name (manual)</Label>
              <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value, studentRef: e.target.value || form.studentRef })} />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Invoice No</Label>
            <Input placeholder="e.g. INV-10001" value={form.invoiceNo ?? ""} onChange={(e) => set({ invoiceNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as InvoiceStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Issue Date</Label>
            <Input type="date" value={form.issueDate ? form.issueDate.slice(0, 10) : ""} onChange={(e) => set({ issueDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Due Date</Label>
            <Input type="date" value={form.dueDate ? form.dueDate.slice(0, 10) : ""} onChange={(e) => set({ dueDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Amount</Label>
            <Input type="number" min={0} value={form.amount ?? 0} onChange={(e) => set({ amount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Paid Amount</Label>
            <Input type="number" min={0} value={form.paidAmount ?? 0} onChange={(e) => set({ paidAmount: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Balance</Label>
            <Input type="number" value={form.balance ?? 0} onChange={(e) => set({ balance: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef || !form.academicPeriodRef || !form.invoiceNo || !form.status}>
            <Plus className="h-4 w-4" /> {invoice ? "Save changes" : "Create invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
