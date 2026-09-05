import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveAssetCategory } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { AssetCategory, DepreciationMethod } from "@/lib/types";

const METHODS: DepreciationMethod[] = ["straight_line", "declining_balance", "units_of_production"];

export function AssetCategoryFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: AssetCategory }) {
  const save = useSaveAssetCategory();
  const [form, setForm] = useState<Partial<AssetCategory>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { code: "", name: "", depreciationMethod: "straight_line", defaultLife: 0, glAccount: "", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<AssetCategory>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name) return;
    save.mutate({ ...(editing ?? { id: uid() }), ...form } as AssetCategory, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit category — ${editing.name}` : "Create asset category"}</DialogTitle>
          <DialogDescription>Define an asset category with depreciation method defaults (M15.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. FUR, IT" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Category name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Depreciation method</Label>
            <Select value={form.depreciationMethod} onValueChange={(v) => set({ depreciationMethod: v as DepreciationMethod })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{METHODS.map((m) => <SelectItem key={m} value={m} className="capitalize">{m.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Default useful life (years)</Label>
            <Input type="number" placeholder="0" value={form.defaultLife ?? ""} onChange={(e) => set({ defaultLife: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>GL account</Label>
            <Input placeholder="e.g. 1500" value={form.glAccount ?? ""} onChange={(e) => set({ glAccount: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
