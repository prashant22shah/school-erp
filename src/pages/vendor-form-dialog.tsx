import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveVendor } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Vendor } from "@/lib/types";

const STATUSES: Vendor["status"][] = ["active", "inactive", "blacklisted"];

export function VendorFormDialog({ open, onOpenChange, vendor }: { open: boolean; onOpenChange: (o: boolean) => void; vendor?: Vendor }) {
  const save = useSaveVendor();
  const [form, setForm] = useState<Partial<Vendor>>({});

  useEffect(() => {
    if (open) {
      setForm(vendor ?? { name: "", code: "", category: "", contactPerson: "", email: "", phone: "", address: "", panNo: "", bankDetails: "", rating: 0, status: "active" as const });
    }
  }, [open, vendor]);

  const set = (patch: Partial<Vendor>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.code || !form.status) return;
    save.mutate(
      { ...(vendor ?? { id: uid(), createdOn: new Date().toISOString() }), ...form } as Vendor,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{vendor ? `Edit vendor — ${vendor.name}` : "Create vendor"}</DialogTitle>
          <DialogDescription>Vendor master details (M14.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Vendor Name</Label>
            <Input placeholder="Company name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. VND-001" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Input placeholder="e.g. stationery, equipment" value={form.category ?? ""} onChange={(e) => set({ category: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Contact Person</Label>
            <Input placeholder="Full name" value={form.contactPerson ?? ""} onChange={(e) => set({ contactPerson: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" placeholder="email@example.com" value={form.email ?? ""} onChange={(e) => set({ email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input placeholder="9841xxxxxx" value={form.phone ?? ""} onChange={(e) => set({ phone: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>PAN No</Label>
            <Input placeholder="PAN number" value={form.panNo ?? ""} onChange={(e) => set({ panNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Rating (1-5)</Label>
            <Input type="number" min={1} max={5} value={form.rating ?? 0} onChange={(e) => set({ rating: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as Vendor["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Address</Label>
            <Textarea placeholder="Full address" value={form.address ?? ""} onChange={(e) => set({ address: e.target.value })} />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Bank Details</Label>
            <Textarea placeholder="Bank name, account number, branch" value={form.bankDetails ?? ""} onChange={(e) => set({ bankDetails: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.code || !form.status}>
            <Plus className="h-4 w-4" /> {vendor ? "Save changes" : "Create vendor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
