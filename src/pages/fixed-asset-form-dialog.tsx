import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveFixedAsset } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { FixedAsset } from "@/lib/types";

const STATUSES = ["active", "disposed", "transferred", "under_maintenance"] as const;

export function FixedAssetFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: FixedAsset }) {
  const save = useSaveFixedAsset();
  const [form, setForm] = useState<Partial<FixedAsset>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { assetCode: "", name: "", category: "", purchaseDate: "", purchaseCost: 0, salvageValue: 0, usefulLife: 0, location: "", custodian: "", serialNo: "", status: "active", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<FixedAsset>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.assetCode || !form.name) return;
    save.mutate({ ...(editing ?? { id: uid() }), ...form } as FixedAsset, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit asset — ${editing.name}` : "Create fixed asset"}</DialogTitle>
          <DialogDescription>Register a fixed asset with depreciation parameters (M15.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Asset code</Label>
            <Input placeholder="e.g. FA-001" value={form.assetCode ?? ""} onChange={(e) => set({ assetCode: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Asset name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Input placeholder="e.g. Furniture, IT Equipment" value={form.category ?? ""} onChange={(e) => set({ category: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Serial no</Label>
            <Input placeholder="Serial number" value={form.serialNo ?? ""} onChange={(e) => set({ serialNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Purchase date</Label>
            <Input type="date" value={form.purchaseDate ?? ""} onChange={(e) => set({ purchaseDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Purchase cost (NPR)</Label>
            <Input type="number" placeholder="0" value={form.purchaseCost ?? ""} onChange={(e) => set({ purchaseCost: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Salvage value (NPR)</Label>
            <Input type="number" placeholder="0" value={form.salvageValue ?? ""} onChange={(e) => set({ salvageValue: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Useful life (years)</Label>
            <Input type="number" placeholder="0" value={form.usefulLife ?? ""} onChange={(e) => set({ usefulLife: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input placeholder="Building / room" value={form.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Custodian</Label>
            <Input placeholder="Responsible person" value={form.custodian ?? ""} onChange={(e) => set({ custodian: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as FixedAsset["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.assetCode || !form.name}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
