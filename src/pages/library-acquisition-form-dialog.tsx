import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveLibraryAcquisition } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LibraryAcquisition, AcquisitionStatus, AcquisitionSource } from "@/lib/types";

const STATUSES: AcquisitionStatus[] = ["draft", "ordered", "received", "cataloged", "cancelled"];
const SOURCES: AcquisitionSource[] = ["purchase", "donation", "exchange", "subscription"];

export function LibraryAcquisitionFormDialog({ open, onOpenChange, acquisition }: { open: boolean; onOpenChange: (o: boolean) => void; acquisition?: LibraryAcquisition | null }) {
  const save = useSaveLibraryAcquisition();
  const [form, setForm] = useState<Partial<LibraryAcquisition>>({});

  useEffect(() => {
    if (open) {
      setForm(
        acquisition ?? {
          title: "",
          vendorName: "",
          orderNo: "",
          source: "purchase",
          quantity: 1,
          unitCost: 0,
          status: "draft",
          orderedOn: new Date().toISOString().slice(0, 10),
          receivedOn: "",
        }
      );
    }
  }, [open, acquisition]);

  const set = (patch: Partial<LibraryAcquisition>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.title || !form.vendorName || !form.orderNo || !form.source || form.quantity == null || form.unitCost == null || !form.status || !form.orderedOn) return;
    const now = new Date().toISOString();
    const totalCost = Number(form.quantity ?? 0) * Number(form.unitCost ?? 0);
    save.mutate(
      {
        id: acquisition?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: acquisition?.createdOn ?? now,
        updatedOn: now,
        resourceId: form.resourceId || undefined,
        title: form.title!,
        vendorName: form.vendorName!,
        orderNo: form.orderNo!,
        source: form.source!,
        quantity: Number(form.quantity!),
        unitCost: Number(form.unitCost!),
        totalCost,
        status: form.status!,
        orderedOn: form.orderedOn!,
        receivedOn: form.receivedOn || undefined,
      } as LibraryAcquisition,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{acquisition ? `Edit acquisition — ${acquisition.orderNo}` : "Create acquisition"}</DialogTitle>
          <DialogDescription>Acquisition and serials orders (M16.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input placeholder="Resource title to acquire" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Vendor Name</Label>
            <Input placeholder="e.g. Himalayan Books" value={form.vendorName ?? ""} onChange={(e) => set({ vendorName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Order No</Label>
            <Input placeholder="e.g. PO-LIB-2025-013" value={form.orderNo ?? ""} onChange={(e) => set({ orderNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Source</Label>
            <Select value={form.source} onValueChange={(v) => set({ source: v as AcquisitionSource })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SOURCES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as AcquisitionStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Quantity</Label>
            <Input type="number" placeholder="1" value={form.quantity ?? ""} onChange={(e) => set({ quantity: Number(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1.5">
            <Label>Unit Cost (NPR)</Label>
            <Input type="number" placeholder="0" value={form.unitCost ?? ""} onChange={(e) => set({ unitCost: Number(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total Cost (auto)</Label>
            <Input value={String((Number(form.quantity ?? 0) * Number(form.unitCost ?? 0)))} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Ordered On</Label>
            <Input type="date" value={form.orderedOn ? form.orderedOn.slice(0, 10) : ""} onChange={(e) => set({ orderedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Received On (optional)</Label>
            <Input type="date" value={form.receivedOn ? form.receivedOn.slice(0, 10) : ""} onChange={(e) => set({ receivedOn: e.target.value || undefined })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Resource ID (optional, if cataloged)</Label>
            <Input placeholder="e.g. lr-5" value={form.resourceId ?? ""} onChange={(e) => set({ resourceId: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.title || !form.vendorName || !form.orderNo || !form.source || form.quantity == null || form.unitCost == null || !form.status || !form.orderedOn}>
            <Plus className="h-4 w-4" /> {acquisition ? "Save changes" : "Create acquisition"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
