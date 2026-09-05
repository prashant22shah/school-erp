import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveFinanceAnalytics } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";

export function FinanceAnalyticsFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: any }) {
  const save = useSaveFinanceAnalytics();
  const [form, setForm] = useState({ id: "", period: "", totalRevenue: 0, totalExpense: 0, feeCollectionRate: 0, outstandingReceivable: 0, budgetUtilization: 0, scholarshipDisbursed: 0, operatingSurplus: 0, analyzedOn: "", createdOn: "" });

  useEffect(() => {
    if (open) {
      if (editing) setForm(editing);
      else setForm({ id: uid(), period: "", totalRevenue: 0, totalExpense: 0, feeCollectionRate: 0, outstandingReceivable: 0, budgetUtilization: 0, scholarshipDisbursed: 0, operatingSurplus: 0, analyzedOn: new Date().toISOString(), createdOn: new Date().toISOString() });
    }
  }, [open, editing]);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Finance Analytics" : "Add Finance Analytics"}</DialogTitle>
          <DialogDescription>Track financial performance metrics (M24.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Period</Label>
            <Input placeholder="e.g. FY 2025 Q1" value={form.period} onChange={(e) => set({ period: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total Revenue</Label>
            <Input type="number" min={0} step={0.01} value={form.totalRevenue} onChange={(e) => set({ totalRevenue: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total Expense</Label>
            <Input type="number" min={0} step={0.01} value={form.totalExpense} onChange={(e) => set({ totalExpense: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Fee Collection Rate (%)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.feeCollectionRate} onChange={(e) => set({ feeCollectionRate: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Outstanding Receivable</Label>
            <Input type="number" min={0} step={0.01} value={form.outstandingReceivable} onChange={(e) => set({ outstandingReceivable: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Budget Utilization (%)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.budgetUtilization} onChange={(e) => set({ budgetUtilization: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Scholarship Disbursed</Label>
            <Input type="number" min={0} step={0.01} value={form.scholarshipDisbursed} onChange={(e) => set({ scholarshipDisbursed: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Operating Surplus</Label>
            <Input type="number" step={0.01} value={form.operatingSurplus} onChange={(e) => set({ operatingSurplus: Number(e.target.value) })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate({ ...form, analyzedOn: new Date().toISOString() }, { onSuccess: () => onOpenChange(false) })} disabled={save.isPending || !form.period}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
