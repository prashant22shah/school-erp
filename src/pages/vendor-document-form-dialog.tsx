import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveVendorDocument, useVendors } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { VendorDocument } from "@/lib/types";

const DOC_TYPES: VendorDocument["type"][] = ["registration", "pan", "tax_clearance", "insurance", "bank_guarantee"];
const STATUSES: VendorDocument["status"][] = ["valid", "expired", "pending_renewal"];

export function VendorDocumentFormDialog({ open, onOpenChange, document }: { open: boolean; onOpenChange: (o: boolean) => void; document?: VendorDocument }) {
  const save = useSaveVendorDocument();
  const vendors = useVendors();
  const [form, setForm] = useState<Partial<VendorDocument>>({});

  useEffect(() => {
    if (open) {
      setForm(document ?? { type: "registration" as const, status: "valid" as const });
    }
  }, [open, document]);

  const set = (patch: Partial<VendorDocument>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.vendorRef || !form.type || !form.documentNo || !form.status) return;
    save.mutate(
      { ...(document ?? { id: uid(), createdOn: todayISO() }), ...form } as VendorDocument,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{document ? `Edit document — ${document.documentNo}` : "Create document"}</DialogTitle>
          <DialogDescription>Vendor compliance document (M14.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Vendor</Label>
            <Select value={form.vendorRef} onValueChange={(v) => set({ vendorRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
              <SelectContent>{vendors.data?.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Document Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as VendorDocument["type"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DOC_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Document No</Label>
            <Input placeholder="Certificate/License number" value={form.documentNo ?? ""} onChange={(e) => set({ documentNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as VendorDocument["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Issued Date</Label>
            <Input type="date" value={form.issuedDate ? form.issuedDate.slice(0, 10) : ""} onChange={(e) => set({ issuedDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Expiry Date</Label>
            <Input type="date" value={form.expiryDate ? form.expiryDate.slice(0, 10) : ""} onChange={(e) => set({ expiryDate: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.vendorRef || !form.type || !form.documentNo || !form.status}>
            <Plus className="h-4 w-4" /> {document ? "Save changes" : "Create document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
