import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavePayrollRun } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { PayrollRun, PayrollStatus } from "@/lib/types";

const STATUSES: PayrollStatus[] = ["draft", "computed", "approved", "paid", "cancelled"];

export function PayrollRunFormDialog({ open, onOpenChange, payrollRun }: { open: boolean; onOpenChange: (o: boolean) => void; payrollRun?: PayrollRun }) {
  const save = useSavePayrollRun();
  const [form, setForm] = useState<Partial<PayrollRun>>({});

  useEffect(() => {
    if (open) {
      const now = new Date();
      setForm(
        payrollRun ?? {
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          status: "draft",
          totalAmount: 0,
          runOn: now.toISOString().slice(0, 10),
        }
      );
    }
  }, [open, payrollRun]);

  const set = (patch: Partial<PayrollRun>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (form.month == null || form.year == null || !form.status || form.totalAmount == null || !form.runOn) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: payrollRun?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: payrollRun?.createdOn ?? now,
        updatedOn: now,
        month: Number(form.month),
        year: Number(form.year),
        status: form.status!,
        totalAmount: Number(form.totalAmount),
        runOn: form.runOn!,
      } as PayrollRun,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{payrollRun ? `Edit payroll run — ${payrollRun.month}/${payrollRun.year}` : "Create payroll run"}</DialogTitle>
          <DialogDescription>Generate and approve monthly payroll runs (M13.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Month (1-12)</Label>
            <Input type="number" min={1} max={12} value={form.month ?? 1} onChange={(e) => set({ month: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Year</Label>
            <Input type="number" min={2000} value={form.year ?? new Date().getFullYear()} onChange={(e) => set({ year: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PayrollStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Total Amount</Label>
            <Input type="number" min={0} value={form.totalAmount ?? 0} onChange={(e) => set({ totalAmount: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Run On</Label>
            <Input type="date" value={form.runOn ? form.runOn.slice(0, 10) : ""} onChange={(e) => set({ runOn: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || form.month == null || form.year == null || !form.status || form.totalAmount == null || !form.runOn}>
            <Plus className="h-4 w-4" /> {payrollRun ? "Save changes" : "Create payroll run"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
