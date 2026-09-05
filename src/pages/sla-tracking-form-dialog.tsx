import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSlaTracking } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { SLATracking } from "@/lib/types";

const STATUSES: SLATracking["status"][] = ["met", "at_risk", "breached"];

export function SlaTrackingFormDialog({ open, onOpenChange, sla }: { open: boolean; onOpenChange: (o: boolean) => void; sla?: SLATracking }) {
  const save = useSaveSlaTracking();
  const [form, setForm] = useState<Partial<SLATracking>>({});

  useEffect(() => {
    if (open) {
      setForm(sla ?? { vendorRef: "", contractRef: "", slaMetric: "", target: "", actual: "", period: "", status: "met" as const });
    }
  }, [open, sla]);

  const set = (patch: Partial<SLATracking>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.vendorRef || !form.slaMetric || !form.status) return;
    save.mutate(
      { ...(sla ?? { id: uid(), createdOn: new Date().toISOString() }), ...form } as SLATracking,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{sla ? `Edit SLA — ${sla.slaMetric}` : "Add SLA tracking"}</DialogTitle>
          <DialogDescription>Service level agreement tracking (M14.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Vendor Reference</Label>
            <Input placeholder="Vendor ID" value={form.vendorRef ?? ""} onChange={(e) => set({ vendorRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Contract Reference</Label>
            <Input placeholder="Contract ID" value={form.contractRef ?? ""} onChange={(e) => set({ contractRef: e.target.value })} />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>SLA Metric</Label>
            <Input placeholder="e.g. Delivery within 7 days" value={form.slaMetric ?? ""} onChange={(e) => set({ slaMetric: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Target</Label>
            <Input placeholder="Target value" value={form.target ?? ""} onChange={(e) => set({ target: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Actual</Label>
            <Input placeholder="Actual value" value={form.actual ?? ""} onChange={(e) => set({ actual: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Period</Label>
            <Input placeholder="e.g. Jan 2026" value={form.period ?? ""} onChange={(e) => set({ period: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as SLATracking["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.vendorRef || !form.slaMetric || !form.status}>
            <Plus className="h-4 w-4" /> {sla ? "Save changes" : "Add SLA"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
