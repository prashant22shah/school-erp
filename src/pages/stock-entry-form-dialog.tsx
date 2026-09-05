import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveStockEntry } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { StockEntry, StockEntryType } from "@/lib/types";

const TYPES: StockEntryType[] = ["receipt", "issue", "transfer", "adjustment", "return"];
const STATUSES = ["draft", "posted", "cancelled"] as const;

export function StockEntryFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: StockEntry }) {
  const save = useSaveStockEntry();
  const [form, setForm] = useState<Partial<StockEntry>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { entryNo: "", storeRef: "", itemName: "", type: "receipt", quantity: 0, unitCost: 0, reference: "", enteredBy: "", entryDate: todayISO(), status: "draft", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<StockEntry>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.entryNo || !form.itemName) return;
    save.mutate({ ...(editing ?? { id: uid() }), ...form } as StockEntry, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit stock entry — ${editing.entryNo}` : "Create stock entry"}</DialogTitle>
          <DialogDescription>Record a stock receipt, issue, transfer, adjustment or return (M15.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Entry no</Label>
            <Input placeholder="e.g. SE-2081-001" value={form.entryNo ?? ""} onChange={(e) => set({ entryNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Store reference</Label>
            <Input placeholder="Store name or code" value={form.storeRef ?? ""} onChange={(e) => set({ storeRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Item name</Label>
            <Input placeholder="Item name" value={form.itemName ?? ""} onChange={(e) => set({ itemName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as StockEntryType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Quantity</Label>
            <Input type="number" placeholder="0" value={form.quantity ?? ""} onChange={(e) => set({ quantity: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Unit cost (NPR)</Label>
            <Input type="number" placeholder="0" value={form.unitCost ?? ""} onChange={(e) => set({ unitCost: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Reference</Label>
            <Input placeholder="PO number, memo, etc." value={form.reference ?? ""} onChange={(e) => set({ reference: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Entered by</Label>
            <Input placeholder="Staff name" value={form.enteredBy ?? ""} onChange={(e) => set({ enteredBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Entry date</Label>
            <Input type="date" value={form.entryDate ?? ""} onChange={(e) => set({ entryDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as StockEntry["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.entryNo || !form.itemName}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
