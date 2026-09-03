import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavePayslip, usePayrollRuns, useStaffProfiles } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Payslip, PayslipStatus } from "@/lib/types";

const STATUSES: PayslipStatus[] = ["draft", "issued", "paid"];

export function PayslipFormDialog({ open, onOpenChange, payslip }: { open: boolean; onOpenChange: (o: boolean) => void; payslip?: Payslip }) {
  const save = useSavePayslip();
  const payrollRuns = usePayrollRuns();
  const staffProfiles = useStaffProfiles();
  const [form, setForm] = useState<Partial<Payslip>>({});

  useEffect(() => {
    if (open) {
      setForm(
        payslip ?? {
          payrollRunId: "",
          staffRef: "",
          staffName: "",
          gross: 0,
          deductions: 0,
          net: 0,
          status: "draft",
        }
      );
    }
  }, [open, payslip]);

  const set = (patch: Partial<Payslip>) => setForm((f) => ({ ...f, ...patch }));

  // auto compute net when gross/deductions change
  useEffect(() => {
    if (form.gross != null && form.deductions != null) {
      const net = Number(form.gross) - Number(form.deductions);
      if (net !== form.net) setForm((f) => ({ ...f, net }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.gross, form.deductions]);

  const submit = () => {
    if (!form.payrollRunId || !form.staffRef || form.gross == null || form.deductions == null || form.net == null || !form.status) return;
    const now = new Date().toISOString();
    const staffName = staffProfiles.data?.find((s) => s.id === form.staffRef)?.name ?? form.staffName ?? form.staffRef!;
    const run = payrollRuns.data?.find((r) => r.id === form.payrollRunId);
    const payrollMonth = run ? `${run.month}/${run.year}` : undefined;
    save.mutate(
      {
        id: payslip?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: payslip?.createdOn ?? now,
        updatedOn: now,
        payrollRunId: form.payrollRunId!,
        payrollMonth,
        staffRef: form.staffRef!,
        staffName,
        gross: Number(form.gross),
        deductions: Number(form.deductions),
        net: Number(form.net),
        status: form.status!,
      } as Payslip,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{payslip ? `Edit payslip — ${payslip.staffName}` : "Create payslip"}</DialogTitle>
          <DialogDescription>Issue payslips linked to payroll runs (M13.08/M13.09).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Payroll Run</Label>
            <Select value={form.payrollRunId} onValueChange={(v) => set({ payrollRunId: v })}>
              <SelectTrigger><SelectValue placeholder="Select run" /></SelectTrigger>
              <SelectContent>{(payrollRuns.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.month}/{r.year} — {r.status}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PayslipStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Staff</Label>
            <Select value={form.staffRef} onValueChange={(v) => {
              const name = staffProfiles.data?.find((s) => s.id === v)?.name ?? "";
              set({ staffRef: v, staffName: name });
            }}>
              <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
              <SelectContent>{(staffProfiles.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name} ({s.staffCode})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Staff Name</Label>
            <Input placeholder="Staff display name" value={form.staffName ?? ""} onChange={(e) => set({ staffName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Gross</Label>
            <Input type="number" min={0} value={form.gross ?? 0} onChange={(e) => set({ gross: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Deductions</Label>
            <Input type="number" min={0} value={form.deductions ?? 0} onChange={(e) => set({ deductions: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Net</Label>
            <Input type="number" value={form.net ?? 0} onChange={(e) => set({ net: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.payrollRunId || !form.staffRef || form.gross == null || form.deductions == null || form.net == null || !form.status}>
            <Plus className="h-4 w-4" /> {payslip ? "Save changes" : "Create payslip"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
