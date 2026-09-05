import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveQualityInspection } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { QualityInspection } from "@/lib/types";

const STATUSES: QualityInspection["status"][] = ["pending", "passed", "failed", "conditional"];

export function QualityInspectionFormDialog({ open, onOpenChange, inspection }: { open: boolean; onOpenChange: (o: boolean) => void; inspection?: QualityInspection }) {
  const save = useSaveQualityInspection();
  const [form, setForm] = useState<Partial<QualityInspection>>({});

  useEffect(() => {
    if (open) {
      setForm(inspection ?? { grnRef: "", inspectedBy: "", inspectionDate: "", itemsChecked: 0, itemsPassed: 0, itemsFailed: 0, notes: "", status: "pending" as const });
    }
  }, [open, inspection]);

  const set = (patch: Partial<QualityInspection>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.grnRef || !form.inspectedBy || !form.status) return;
    save.mutate(
      { ...(inspection ?? { id: uid(), createdOn: new Date().toISOString() }), ...form } as QualityInspection,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{inspection ? `Edit inspection — ${inspection.id}` : "Create inspection"}</DialogTitle>
          <DialogDescription>Quality inspection record (M14.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>GRN Reference</Label>
            <Input placeholder="GRN number" value={form.grnRef ?? ""} onChange={(e) => set({ grnRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Inspected By</Label>
            <Input placeholder="Inspector name" value={form.inspectedBy ?? ""} onChange={(e) => set({ inspectedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Inspection Date</Label>
            <Input type="date" value={form.inspectionDate ? form.inspectionDate.slice(0, 10) : ""} onChange={(e) => set({ inspectionDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Items Checked</Label>
            <Input type="number" min={0} value={form.itemsChecked ?? 0} onChange={(e) => set({ itemsChecked: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Items Passed</Label>
            <Input type="number" min={0} value={form.itemsPassed ?? 0} onChange={(e) => set({ itemsPassed: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Items Failed</Label>
            <Input type="number" min={0} value={form.itemsFailed ?? 0} onChange={(e) => set({ itemsFailed: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as QualityInspection["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Notes</Label>
            <Textarea placeholder="Inspection findings and notes" value={form.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.grnRef || !form.inspectedBy || !form.status}>
            <Plus className="h-4 w-4" /> {inspection ? "Save changes" : "Create inspection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
