import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveFeeStructure, useAcademicYears } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { FeeStructure } from "@/lib/types";

const FREQUENCIES: FeeStructure["frequency"][] = ["one_time", "monthly", "term", "annual"];

export function FeeStructureFormDialog({ open, onOpenChange, feeStructure }: { open: boolean; onOpenChange: (o: boolean) => void; feeStructure?: FeeStructure }) {
  const save = useSaveFeeStructure();
  const academicYears = useAcademicYears();
  const [form, setForm] = useState<Partial<FeeStructure>>({});

  useEffect(() => {
    if (open) {
      setForm(
        feeStructure ?? {
          academicPeriodRef: "",
          name: "",
          code: "",
          amount: 0,
          frequency: "annual",
          isActive: true,
        }
      );
    }
  }, [open, feeStructure]);

  const set = (patch: Partial<FeeStructure>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.code || form.amount == null || !form.frequency || !form.academicPeriodRef) return;
    const now = new Date().toISOString();
    const academicPeriodName = academicYears.data?.find((y) => y.id === form.academicPeriodRef)?.name ?? "";
    save.mutate(
      {
        id: feeStructure?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: feeStructure?.createdOn ?? now,
        updatedOn: now,
        academicPeriodRef: form.academicPeriodRef!,
        academicPeriodName,
        name: form.name!,
        code: form.code!,
        amount: Number(form.amount),
        frequency: form.frequency!,
        isActive: form.isActive ?? true,
      } as FeeStructure,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{feeStructure ? `Edit fee structure — ${feeStructure.name}` : "Create fee structure"}</DialogTitle>
          <DialogDescription>Define fee catalog item with frequency and amount (M12.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. FEE-ANN-01" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Academic Period</Label>
            <Select value={form.academicPeriodRef} onValueChange={(v) => set({ academicPeriodRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
              <SelectContent>{(academicYears.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="e.g. Annual Tuition Fee" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Amount</Label>
            <Input type="number" min={0} value={form.amount ?? 0} onChange={(e) => set({ amount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Frequency</Label>
            <Select value={form.frequency} onValueChange={(v) => set({ frequency: v as FeeStructure["frequency"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{FREQUENCIES.map((f) => <SelectItem key={f} value={f} className="capitalize">{f.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch checked={!!form.isActive} onCheckedChange={(v) => set({ isActive: v })} />
            <Label>Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.code || !form.academicPeriodRef || !form.frequency}>
            <Plus className="h-4 w-4" /> {feeStructure ? "Save changes" : "Create fee structure"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
