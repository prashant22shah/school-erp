import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveDisposal } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { Disposal } from "@/lib/types";

const METHODS = ["sale", "donation", "scrap", "trade_in"] as const;
const STATUSES = ["draft", "approved", "completed"] as const;

export function DisposalFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: Disposal }) {
  const save = useSaveDisposal();
  const [form, setForm] = useState<Partial<Disposal>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { assetName: "", disposalDate: todayISO(), disposalMethod: "sale", salePrice: 0, buyer: "", netBookValue: 0, gainLoss: 0, approvedBy: "", status: "draft", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<Disposal>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.assetName || !form.disposalDate) return;
    save.mutate({ ...(editing ?? { id: uid(), assetRef: "" }), ...form } as Disposal, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit disposal — ${editing.assetName}` : "Create disposal"}</DialogTitle>
          <DialogDescription>Record asset disposal by sale, donation, scrap or trade-in (M15.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Asset name</Label>
            <Input placeholder="Asset name" value={form.assetName ?? ""} onChange={(e) => set({ assetName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Disposal date</Label>
            <Input type="date" value={form.disposalDate ?? ""} onChange={(e) => set({ disposalDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Disposal method</Label>
            <Select value={form.disposalMethod} onValueChange={(v) => set({ disposalMethod: v as Disposal["disposalMethod"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{METHODS.map((m) => <SelectItem key={m} value={m} className="capitalize">{m.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Sale price (NPR)</Label>
            <Input type="number" placeholder="0" value={form.salePrice ?? ""} onChange={(e) => set({ salePrice: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Buyer</Label>
            <Input placeholder="Buyer / recipient" value={form.buyer ?? ""} onChange={(e) => set({ buyer: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Net book value (NPR)</Label>
            <Input type="number" placeholder="0" value={form.netBookValue ?? ""} onChange={(e) => set({ netBookValue: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Gain / Loss (NPR)</Label>
            <Input type="number" placeholder="0" value={form.gainLoss ?? ""} onChange={(e) => set({ gainLoss: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Approved by</Label>
            <Input placeholder="Approver name" value={form.approvedBy ?? ""} onChange={(e) => set({ approvedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as Disposal["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.assetName || !form.disposalDate}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create disposal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
