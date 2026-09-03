import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveLibraryHolding } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LibraryHolding, HoldingCondition, HoldingStatusM16 } from "@/lib/types";

const CONDITIONS: HoldingCondition[] = ["new", "good", "worn", "damaged", "lost", "withdrawn"];
const STATUSES: HoldingStatusM16[] = ["available", "issued", "reserved", "maintenance", "lost"];

export function LibraryHoldingFormDialog({ open, onOpenChange, holding }: { open: boolean; onOpenChange: (o: boolean) => void; holding?: LibraryHolding | null }) {
  const save = useSaveLibraryHolding();
  const [form, setForm] = useState<Partial<LibraryHolding>>({});

  useEffect(() => {
    if (open) {
      setForm(
        holding ?? {
          resourceId: "",
          copyNo: "",
          barcode: "",
          location: "",
          condition: "good",
          status: "available",
          acquiredOn: new Date().toISOString().slice(0, 10),
        }
      );
    }
  }, [open, holding]);

  const set = (patch: Partial<LibraryHolding>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.resourceId || !form.copyNo || !form.barcode || !form.location || !form.condition || !form.status || !form.acquiredOn) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: holding?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: holding?.createdOn ?? now,
        updatedOn: now,
        resourceId: form.resourceId!,
        resourceTitle: form.resourceTitle || undefined,
        copyNo: form.copyNo!,
        barcode: form.barcode!,
        location: form.location!,
        condition: form.condition!,
        status: form.status!,
        acquiredOn: form.acquiredOn!,
      } as LibraryHolding,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{holding ? `Edit holding — ${holding.barcode}` : "Create library holding"}</DialogTitle>
          <DialogDescription>Copies, holdings and shelving (M16.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Resource ID</Label>
            <Input placeholder="e.g. lr-1" value={form.resourceId ?? ""} onChange={(e) => set({ resourceId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Copy No</Label>
            <Input placeholder="e.g. C-003" value={form.copyNo ?? ""} onChange={(e) => set({ copyNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Barcode</Label>
            <Input placeholder="e.g. BC-100003" value={form.barcode ?? ""} onChange={(e) => set({ barcode: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input placeholder="e.g. A-01-03" value={form.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Condition</Label>
            <Select value={form.condition} onValueChange={(v) => set({ condition: v as HoldingCondition })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CONDITIONS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as HoldingStatusM16 })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Acquired On</Label>
            <Input type="date" value={form.acquiredOn ? form.acquiredOn.slice(0, 10) : ""} onChange={(e) => set({ acquiredOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Resource Title (optional)</Label>
            <Input placeholder="Title for display" value={form.resourceTitle ?? ""} onChange={(e) => set({ resourceTitle: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.resourceId || !form.copyNo || !form.barcode || !form.location || !form.condition || !form.status || !form.acquiredOn}>
            <Plus className="h-4 w-4" /> {holding ? "Save changes" : "Create holding"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
