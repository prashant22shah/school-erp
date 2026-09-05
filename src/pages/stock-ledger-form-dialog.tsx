import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveStockLedger } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { StockLedger } from "@/lib/types";

export function StockLedgerFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: StockLedger }) {
  const save = useSaveStockLedger();
  const [form, setForm] = useState<Partial<StockLedger>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { itemName: "", storeRef: "", openingQty: 0, receivedQty: 0, issuedQty: 0, closingQty: 0, balanceValue: 0, period: "", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<StockLedger>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.itemName || !form.period) return;
    save.mutate({ ...(editing ?? { id: uid() }), ...form } as StockLedger, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit ledger — ${editing.itemName}` : "Create stock ledger"}</DialogTitle>
          <DialogDescription>Record stock movement totals for a period (M15.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Item name</Label>
            <Input placeholder="Item name" value={form.itemName ?? ""} onChange={(e) => set({ itemName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Store reference</Label>
            <Input placeholder="Store name or code" value={form.storeRef ?? ""} onChange={(e) => set({ storeRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Period</Label>
            <Input placeholder="e.g. 2081-01" value={form.period ?? ""} onChange={(e) => set({ period: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Opening qty</Label>
            <Input type="number" placeholder="0" value={form.openingQty ?? ""} onChange={(e) => set({ openingQty: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Received qty</Label>
            <Input type="number" placeholder="0" value={form.receivedQty ?? ""} onChange={(e) => set({ receivedQty: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Issued qty</Label>
            <Input type="number" placeholder="0" value={form.issuedQty ?? ""} onChange={(e) => set({ issuedQty: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Closing qty</Label>
            <Input type="number" placeholder="0" value={form.closingQty ?? ""} onChange={(e) => set({ closingQty: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Balance value (NPR)</Label>
            <Input type="number" placeholder="0" value={form.balanceValue ?? ""} onChange={(e) => set({ balanceValue: Number(e.target.value) })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.itemName || !form.period}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create ledger"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
