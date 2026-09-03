import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveCreditNote, useInvoices } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { CreditNote, CreditNoteStatus } from "@/lib/types";

const STATUSES: CreditNoteStatus[] = ["draft", "approved", "applied", "rejected"];

export function CreditNoteFormDialog({ open, onOpenChange, creditNote }: { open: boolean; onOpenChange: (o: boolean) => void; creditNote?: CreditNote }) {
  const save = useSaveCreditNote();
  const invoices = useInvoices();
  const [form, setForm] = useState<Partial<CreditNote>>({});

  useEffect(() => {
    if (open) {
      setForm(
        creditNote ?? {
          invoiceId: "",
          amount: 0,
          reason: "",
          status: "draft",
        }
      );
    }
  }, [open, creditNote]);

  const set = (patch: Partial<CreditNote>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.invoiceId || form.amount == null || !form.reason || !form.status) return;
    const now = new Date().toISOString();
    const inv = invoices.data?.find((i) => i.id === form.invoiceId);
    save.mutate(
      {
        id: creditNote?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: creditNote?.createdOn ?? now,
        updatedOn: now,
        invoiceId: form.invoiceId!,
        invoiceNo: inv?.invoiceNo ?? form.invoiceNo,
        amount: Number(form.amount),
        reason: form.reason!,
        status: form.status!,
      } as CreditNote,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{creditNote ? `Edit credit note — ${creditNote.invoiceNo ?? creditNote.invoiceId.slice(0, 8)}` : "Create credit note"}</DialogTitle>
          <DialogDescription>Issue adjustment against an invoice (M12.12).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Invoice</Label>
            <Select value={form.invoiceId} onValueChange={(v) => set({ invoiceId: v })}>
              <SelectTrigger><SelectValue placeholder="Select invoice" /></SelectTrigger>
              <SelectContent>{(invoices.data ?? []).map((inv) => <SelectItem key={inv.id} value={inv.id}>{inv.invoiceNo} — {inv.studentName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Amount</Label>
            <Input type="number" min={0} value={form.amount ?? 0} onChange={(e) => set({ amount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CreditNoteStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Textarea placeholder="Reason for credit…" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.invoiceId || !form.reason || !form.status}>
            <Plus className="h-4 w-4" /> {creditNote ? "Save changes" : "Create credit note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
