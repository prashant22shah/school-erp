import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveBudget, useFiscalYears } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Budget, BudgetStatus } from "@/lib/types";

const STATUSES: BudgetStatus[] = ["draft", "approved", "locked"];

export function BudgetFormDialog({ open, onOpenChange, budget }: { open: boolean; onOpenChange: (o: boolean) => void; budget?: Budget }) {
  const save = useSaveBudget();
  const fiscalYears = useFiscalYears();
  const [form, setForm] = useState<Partial<Budget>>({});

  useEffect(() => {
    if (open) {
      setForm(
        budget ?? {
          fiscalYearId: "",
          department: "",
          allocatedAmount: 0,
          utilizedAmount: 0,
          status: "draft",
        }
      );
    }
  }, [open, budget]);

  const set = (patch: Partial<Budget>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.fiscalYearId || !form.department || form.allocatedAmount == null || form.utilizedAmount == null || !form.status) return;
    const now = new Date().toISOString();
    const fiscalYearName = fiscalYears.data?.find((f) => f.id === form.fiscalYearId)?.name ?? "";
    save.mutate(
      {
        id: budget?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: budget?.createdOn ?? now,
        updatedOn: now,
        fiscalYearId: form.fiscalYearId!,
        fiscalYearName,
        department: form.department!,
        allocatedAmount: Number(form.allocatedAmount),
        utilizedAmount: Number(form.utilizedAmount),
        status: form.status!,
      } as Budget,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{budget ? `Edit budget — ${budget.department}` : "Create budget"}</DialogTitle>
          <DialogDescription>Allocate and track department budget (M12.19).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Fiscal Year</Label>
            <Select value={form.fiscalYearId} onValueChange={(v) => set({ fiscalYearId: v })}>
              <SelectTrigger><SelectValue placeholder="Select fiscal year" /></SelectTrigger>
              <SelectContent>{(fiscalYears.data ?? []).map((fy) => <SelectItem key={fy.id} value={fy.id}>{fy.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Input placeholder="e.g. Science Dept" value={form.department ?? ""} onChange={(e) => set({ department: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Allocated Amount</Label>
            <Input type="number" min={0} value={form.allocatedAmount ?? 0} onChange={(e) => set({ allocatedAmount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Utilized Amount</Label>
            <Input type="number" min={0} value={form.utilizedAmount ?? 0} onChange={(e) => set({ utilizedAmount: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as BudgetStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.fiscalYearId || !form.department || !form.status}>
            <Plus className="h-4 w-4" /> {budget ? "Save changes" : "Create budget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
