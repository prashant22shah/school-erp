import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveFiscalYear } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { FiscalYear, FiscalYearStatus } from "@/lib/types";

const STATUSES: FiscalYearStatus[] = ["draft", "open", "closed", "locked"];

export function FiscalYearFormDialog({ open, onOpenChange, fiscalYear }: { open: boolean; onOpenChange: (o: boolean) => void; fiscalYear?: FiscalYear }) {
  const save = useSaveFiscalYear();
  const [form, setForm] = useState<Partial<FiscalYear>>({});

  useEffect(() => {
    if (open) {
      setForm(
        fiscalYear ?? {
          name: "",
          startDate: new Date().toISOString().slice(0, 10),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
          status: "draft",
        }
      );
    }
  }, [open, fiscalYear]);

  const set = (patch: Partial<FiscalYear>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.startDate || !form.endDate || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: fiscalYear?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: fiscalYear?.createdOn ?? now,
        updatedOn: now,
        name: form.name!,
        startDate: form.startDate!,
        endDate: form.endDate!,
        status: form.status!,
      } as FiscalYear,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{fiscalYear ? `Edit fiscal year — ${fiscalYear.name}` : "Create fiscal year"}</DialogTitle>
          <DialogDescription>Define fiscal year period and status (M12.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="e.g. FY 2082/83" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Start Date</Label>
            <Input type="date" value={form.startDate ? form.startDate.slice(0, 10) : ""} onChange={(e) => set({ startDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>End Date</Label>
            <Input type="date" value={form.endDate ? form.endDate.slice(0, 10) : ""} onChange={(e) => set({ endDate: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as FiscalYearStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.startDate || !form.endDate || !form.status}>
            <Plus className="h-4 w-4" /> {fiscalYear ? "Save changes" : "Create fiscal year"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
