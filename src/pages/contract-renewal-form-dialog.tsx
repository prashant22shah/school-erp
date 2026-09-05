import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveContractRenewal, useContracts } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { ContractRenewal } from "@/lib/types";

const STATUSES: ContractRenewal["status"][] = ["pending", "approved", "rejected", "completed"];

export function ContractRenewalFormDialog({ open, onOpenChange, renewal }: { open: boolean; onOpenChange: (o: boolean) => void; renewal?: ContractRenewal }) {
  const save = useSaveContractRenewal();
  const contracts = useContracts();
  const [form, setForm] = useState<Partial<ContractRenewal>>({});

  useEffect(() => {
    if (open) {
      setForm(renewal ?? { contractRef: "", previousEndDate: "", newEndDate: "", revisedValue: 0, notes: "", status: "pending" as const });
    }
  }, [open, renewal]);

  const set = (patch: Partial<ContractRenewal>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.contractRef || !form.newEndDate || !form.status) return;
    save.mutate(
      { ...(renewal ?? { id: uid(), createdOn: todayISO() }), ...form } as ContractRenewal,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{renewal ? `Edit renewal — ${renewal.id}` : "Create renewal"}</DialogTitle>
          <DialogDescription>Contract renewal details (M14.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Contract</Label>
            <Select value={form.contractRef} onValueChange={(v) => set({ contractRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select contract" /></SelectTrigger>
              <SelectContent>{contracts.data?.map((c) => <SelectItem key={c.id} value={c.id}>{c.contractNo}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Previous End Date</Label>
            <Input type="date" value={form.previousEndDate ? form.previousEndDate.slice(0, 10) : ""} onChange={(e) => set({ previousEndDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>New End Date</Label>
            <Input type="date" value={form.newEndDate ? form.newEndDate.slice(0, 10) : ""} onChange={(e) => set({ newEndDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Revised Value (Rs)</Label>
            <Input type="number" min={0} value={form.revisedValue ?? 0} onChange={(e) => set({ revisedValue: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ContractRenewal["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Notes</Label>
            <Textarea placeholder="Renewal notes and terms" value={form.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.contractRef || !form.newEndDate || !form.status}>
            <Plus className="h-4 w-4" /> {renewal ? "Save changes" : "Create renewal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
