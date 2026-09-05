import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveContract } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Contract } from "@/lib/types";

const STATUSES: Contract["status"][] = ["draft", "active", "expired", "terminated"];

export function ContractFormDialog({ open, onOpenChange, contract }: { open: boolean; onOpenChange: (o: boolean) => void; contract?: Contract }) {
  const save = useSaveContract();
  const [form, setForm] = useState<Partial<Contract>>({});

  useEffect(() => {
    if (open) {
      setForm(contract ?? { contractNo: "", vendorRef: "", vendorName: "", title: "", startDate: "", endDate: "", value: 0, renewalTerms: "", status: "draft" as const });
    }
  }, [open, contract]);

  const set = (patch: Partial<Contract>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.contractNo || !form.vendorName || !form.title || !form.status) return;
    save.mutate(
      { ...(contract ?? { id: uid(), createdOn: new Date().toISOString() }), ...form } as Contract,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{contract ? `Edit contract — ${contract.contractNo}` : "Create contract"}</DialogTitle>
          <DialogDescription>Contract details (M14.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Contract No</Label>
            <Input placeholder="e.g. CTR-2026-001" value={form.contractNo ?? ""} onChange={(e) => set({ contractNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Vendor Name</Label>
            <Input placeholder="Vendor name" value={form.vendorName ?? ""} onChange={(e) => set({ vendorName: e.target.value })} />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Title</Label>
            <Input placeholder="Contract title" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Start Date</Label>
            <Input type="date" value={form.startDate ? form.startDate.slice(0, 10) : ""} onChange={(e) => set({ startDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>End Date</Label>
            <Input type="date" value={form.endDate ? form.endDate.slice(0, 10) : ""} onChange={(e) => set({ endDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Value (Rs)</Label>
            <Input type="number" min={0} value={form.value ?? 0} onChange={(e) => set({ value: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as Contract["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Renewal Terms</Label>
            <Textarea placeholder="Renewal terms and conditions" value={form.renewalTerms ?? ""} onChange={(e) => set({ renewalTerms: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.contractNo || !form.vendorName || !form.title || !form.status}>
            <Plus className="h-4 w-4" /> {contract ? "Save changes" : "Create contract"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
