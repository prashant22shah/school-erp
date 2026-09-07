import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveAssetTransfer } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { AssetTransfer } from "@/lib/types";

const STATUSES = ["draft", "approved", "completed"] as const;

export function AssetTransferFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: AssetTransfer }) {
  const save = useSaveAssetTransfer();
  const [form, setForm] = useState<Partial<AssetTransfer>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { assetRef: "", assetName: "", fromLocation: "", toLocation: "", fromCustodian: "", toCustodian: "", transferDate: todayISO(), reason: "", approvedBy: "", status: "draft", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<AssetTransfer>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.assetName || !form.toLocation) return;
    save.mutate({ ...(editing ?? { id: uid() }), ...form } as AssetTransfer, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit transfer — ${editing.assetName}` : "Create asset transfer"}</DialogTitle>
          <DialogDescription>Record movement of an asset between locations or custodians (M15.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Asset ref</Label>
            <Input placeholder="Asset ID" value={form.assetRef ?? ""} onChange={(e) => set({ assetRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Asset name</Label>
            <Input placeholder="Asset name" value={form.assetName ?? ""} onChange={(e) => set({ assetName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Transfer date</Label>
            <Input type="date" value={form.transferDate ?? ""} onChange={(e) => set({ transferDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>From location</Label>
            <Input placeholder="Current location" value={form.fromLocation ?? ""} onChange={(e) => set({ fromLocation: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>To location</Label>
            <Input placeholder="New location" value={form.toLocation ?? ""} onChange={(e) => set({ toLocation: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>From custodian</Label>
            <Input placeholder="Current custodian" value={form.fromCustodian ?? ""} onChange={(e) => set({ fromCustodian: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>To custodian</Label>
            <Input placeholder="New custodian" value={form.toCustodian ?? ""} onChange={(e) => set({ toCustodian: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Approved by</Label>
            <Input placeholder="Approver name" value={form.approvedBy ?? ""} onChange={(e) => set({ approvedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as AssetTransfer["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Textarea placeholder="Reason for transfer…" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.assetName || !form.toLocation}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
