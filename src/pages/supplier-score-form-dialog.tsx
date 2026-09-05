import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveSupplierScore } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { SupplierScore } from "@/lib/types";

export function SupplierScoreFormDialog({ open, onOpenChange, score }: { open: boolean; onOpenChange: (o: boolean) => void; score?: SupplierScore }) {
  const save = useSaveSupplierScore();
  const [form, setForm] = useState<Partial<SupplierScore>>({});

  useEffect(() => {
    if (open) {
      setForm(score ?? { vendorRef: "", vendorName: "", period: "", qualityScore: 0, deliveryScore: 0, priceScore: 0, serviceScore: 0, overallScore: 0, rank: 0 });
    }
  }, [open, score]);

  const set = (patch: Partial<SupplierScore>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.vendorName || !form.period) return;
    const overall = Math.round(((form.qualityScore ?? 0) + (form.deliveryScore ?? 0) + (form.priceScore ?? 0) + (form.serviceScore ?? 0)) / 4);
    save.mutate(
      { ...(score ?? { id: uid(), createdOn: new Date().toISOString() }), ...form, overallScore: overall } as SupplierScore,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{score ? `Edit score — ${score.vendorName}` : "Add supplier score"}</DialogTitle>
          <DialogDescription>Supplier performance score (M14.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Vendor Name</Label>
            <Input placeholder="Vendor name" value={form.vendorName ?? ""} onChange={(e) => set({ vendorName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Period</Label>
            <Input placeholder="e.g. Q1 2026" value={form.period ?? ""} onChange={(e) => set({ period: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Quality Score (0-100)</Label>
            <Input type="number" min={0} max={100} value={form.qualityScore ?? 0} onChange={(e) => set({ qualityScore: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Delivery Score (0-100)</Label>
            <Input type="number" min={0} max={100} value={form.deliveryScore ?? 0} onChange={(e) => set({ deliveryScore: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Price Score (0-100)</Label>
            <Input type="number" min={0} max={100} value={form.priceScore ?? 0} onChange={(e) => set({ priceScore: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Service Score (0-100)</Label>
            <Input type="number" min={0} max={100} value={form.serviceScore ?? 0} onChange={(e) => set({ serviceScore: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Rank</Label>
            <Input type="number" min={1} value={form.rank ?? 0} onChange={(e) => set({ rank: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.vendorName || !form.period}>
            <Plus className="h-4 w-4" /> {score ? "Save changes" : "Add score"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
