import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader,DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveItem } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { Item } from "@/lib/types";

const STATUSES = ["active", "inactive", "discontinued"] as const;

export function ItemFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: Item }) {
  const save = useSaveItem();
  const [form, setForm] = useState<Partial<Item>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { code: "", name: "", category: "", unit: "", description: "", minStock: 0, maxStock: 0, reorderLevel: 0, unitCost: 0, status: "active", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<Item>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name) return;
    save.mutate({ ...(editing ?? { id: uid() }), ...form } as Item, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit item — ${editing.name}` : "Create item"}</DialogTitle>
          <DialogDescription>Define an inventory item with stock level thresholds (M15.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. ITM-001" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Item name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Input placeholder="e.g. Stationery" value={form.category ?? ""} onChange={(e) => set({ category: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Unit</Label>
            <Input placeholder="e.g. pcs, kg, litre" value={form.unit ?? ""} onChange={(e) => set({ unit: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Min stock</Label>
            <Input type="number" placeholder="0" value={form.minStock ?? ""} onChange={(e) => set({ minStock: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Max stock</Label>
            <Input type="number" placeholder="0" value={form.maxStock ?? ""} onChange={(e) => set({ maxStock: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Reorder level</Label>
            <Input type="number" placeholder="0" value={form.reorderLevel ?? ""} onChange={(e) => set({ reorderLevel: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Unit cost (NPR)</Label>
            <Input type="number" placeholder="0" value={form.unitCost ?? ""} onChange={(e) => set({ unitCost: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as Item["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Item description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
