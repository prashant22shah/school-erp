import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCompensation, useStaffProfiles } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Compensation } from "@/lib/types";

type CompComponent = Compensation["component"];
const COMPONENTS: CompComponent[] = ["basic", "allowance", "bonus", "deduction"];

export function CompensationFormDialog({ open, onOpenChange, compensation }: { open: boolean; onOpenChange: (o: boolean) => void; compensation?: Compensation }) {
  const save = useSaveCompensation();
  const staffProfiles = useStaffProfiles();
  const [form, setForm] = useState<Partial<Compensation>>({});

  useEffect(() => {
    if (open) {
      setForm(
        compensation ?? {
          staffRef: "",
          staffName: "",
          component: "basic",
          amount: 0,
          effectiveFrom: new Date().toISOString().slice(0, 10),
        }
      );
    }
  }, [open, compensation]);

  const set = (patch: Partial<Compensation>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.staffRef || !form.component || form.amount == null || !form.effectiveFrom) return;
    const now = new Date().toISOString();
    const staffName = staffProfiles.data?.find((s) => s.id === form.staffRef)?.name ?? form.staffName ?? form.staffRef!;
    save.mutate(
      {
        id: compensation?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: compensation?.createdOn ?? now,
        updatedOn: now,
        staffRef: form.staffRef!,
        staffName,
        component: form.component!,
        amount: Number(form.amount),
        effectiveFrom: form.effectiveFrom!,
      } as Compensation,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{compensation ? `Edit compensation — ${compensation.staffName}` : "Create compensation"}</DialogTitle>
          <DialogDescription>Manage salary components and allowances per staff (M13.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
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
            <Label>Component</Label>
            <Select value={form.component} onValueChange={(v) => set({ component: v as CompComponent })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{COMPONENTS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Amount</Label>
            <Input type="number" min={0} value={form.amount ?? 0} onChange={(e) => set({ amount: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Effective From</Label>
            <Input type="date" value={form.effectiveFrom ? form.effectiveFrom.slice(0, 10) : ""} onChange={(e) => set({ effectiveFrom: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.staffRef || !form.component || form.amount == null || !form.effectiveFrom}>
            <Plus className="h-4 w-4" /> {compensation ? "Save changes" : "Create compensation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
