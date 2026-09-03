import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavePayment, useInvoices } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Payment, PaymentMethod, PaymentStatus } from "@/lib/types";

const METHODS: PaymentMethod[] = ["cash", "bank", "online", "wallet"];
const STATUSES: PaymentStatus[] = ["pending", "completed", "failed", "refunded"];

export function PaymentFormDialog({ open, onOpenChange, payment }: { open: boolean; onOpenChange: (o: boolean) => void; payment?: Payment }) {
  const save = useSavePayment();
  const invoices = useInvoices();
  const [form, setForm] = useState<Partial<Payment>>({});

  useEffect(() => {
    if (open) {
      setForm(
        payment ?? {
          invoiceId: "",
          amount: 0,
          method: "cash",
          paidOn: new Date().toISOString().slice(0, 10),
          status: "pending",
          reference: "",
        }
      );
    }
  }, [open, payment]);

  const set = (patch: Partial<Payment>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.invoiceId || form.amount == null || !form.method || !form.paidOn || !form.status) return;
    const now = new Date().toISOString();
    const inv = invoices.data?.find((i) => i.id === form.invoiceId);
    save.mutate(
      {
        id: payment?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: payment?.createdOn ?? now,
        updatedOn: now,
        invoiceId: form.invoiceId!,
        invoiceNo: inv?.invoiceNo ?? form.invoiceNo,
        studentName: inv?.studentName ?? form.studentName,
        amount: Number(form.amount),
        method: form.method!,
        paidOn: form.paidOn!,
        status: form.status!,
        reference: form.reference || undefined,
      } as Payment,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{payment ? `Edit payment — ${payment.invoiceNo ?? payment.invoiceId.slice(0, 8)}` : "Create payment"}</DialogTitle>
          <DialogDescription>Record collection against an invoice (M12.10/M12.11).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Invoice</Label>
            <Select value={form.invoiceId} onValueChange={(v) => set({ invoiceId: v })}>
              <SelectTrigger><SelectValue placeholder="Select invoice" /></SelectTrigger>
              <SelectContent>{(invoices.data ?? []).map((inv) => <SelectItem key={inv.id} value={inv.id}>{inv.invoiceNo} — {inv.studentName} ({inv.amount})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Amount</Label>
            <Input type="number" min={0} value={form.amount ?? 0} onChange={(e) => set({ amount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Method</Label>
            <Select value={form.method} onValueChange={(v) => set({ method: v as PaymentMethod })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{METHODS.map((m) => <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Paid On</Label>
            <Input type="date" value={form.paidOn ? form.paidOn.slice(0, 10) : ""} onChange={(e) => set({ paidOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PaymentStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reference (optional)</Label>
            <Input placeholder="e.g. TXN-12345" value={form.reference ?? ""} onChange={(e) => set({ reference: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.invoiceId || !form.method || !form.paidOn || !form.status}>
            <Plus className="h-4 w-4" /> {payment ? "Save changes" : "Create payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
