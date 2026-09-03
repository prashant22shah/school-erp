import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveVendorBill } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { VendorBill, VendorBillStatus } from "@/lib/types";

const STATUSES: VendorBillStatus[] = ["draft", "approved", "paid", "overdue"];

export function VendorBillFormDialog({ open, onOpenChange, bill }: { open: boolean; onOpenChange: (o: boolean) => void; bill?: VendorBill }) {
  const save = useSaveVendorBill();
  const [form, setForm] = useState<Partial<VendorBill>>({});

  useEffect(() => {
    if (open) {
      setForm(
        bill ?? {
          vendorName: "",
          billNo: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
          billDate: new Date().toISOString().slice(0, 10),
          amount: 0,
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          status: "draft",
        }
      );
    }
  }, [open, bill]);

  const set = (patch: Partial<VendorBill>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.vendorName || !form.billNo || !form.billDate || form.amount == null || !form.dueDate || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: bill?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: bill?.createdOn ?? now,
        updatedOn: now,
        vendorName: form.vendorName!,
        billNo: form.billNo!,
        billDate: form.billDate!,
        amount: Number(form.amount),
        dueDate: form.dueDate!,
        status: form.status!,
      } as VendorBill,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{bill ? `Edit vendor bill — ${bill.billNo}` : "Create vendor bill"}</DialogTitle>
          <DialogDescription>Record payable to vendor (M12.14/M12.15).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Vendor Name</Label>
            <Input placeholder="e.g. ABC Supplies Pvt. Ltd." value={form.vendorName ?? ""} onChange={(e) => set({ vendorName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Bill No</Label>
            <Input placeholder="e.g. BILL-1001" value={form.billNo ?? ""} onChange={(e) => set({ billNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as VendorBillStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Bill Date</Label>
            <Input type="date" value={form.billDate ? form.billDate.slice(0, 10) : ""} onChange={(e) => set({ billDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Due Date</Label>
            <Input type="date" value={form.dueDate ? form.dueDate.slice(0, 10) : ""} onChange={(e) => set({ dueDate: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Amount</Label>
            <Input type="number" min={0} value={form.amount ?? 0} onChange={(e) => set({ amount: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.vendorName || !form.billNo || !form.billDate || !form.dueDate || !form.status}>
            <Plus className="h-4 w-4" /> {bill ? "Save changes" : "Create bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
