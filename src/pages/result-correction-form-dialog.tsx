import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveResultCorrection, useResultLines } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ResultCorrection, CorrectionType, CorrectionStatus2 } from "@/lib/types";

const TYPES: CorrectionType[] = ["retotal", "recheck", "grade_change", "data_fix"];
const STATUSES: CorrectionStatus2[] = ["pending", "approved", "rejected", "applied"];

export function ResultCorrectionFormDialog({ open, onOpenChange, correction }: { open: boolean; onOpenChange: (o: boolean) => void; correction?: ResultCorrection }) {
  const save = useSaveResultCorrection();
  const resultLines = useResultLines();
  const [form, setForm] = useState<Partial<ResultCorrection>>({});

  useEffect(() => {
    if (open) setForm(correction ?? { resultLineId: "", type: "retotal", reason: "", status: "pending", correctedBy: "" });
  }, [open, correction]);

  const set = (patch: Partial<ResultCorrection>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.resultLineId || !form.type || !form.reason || !form.status) return;
    const now = new Date().toISOString();
    const studentName = resultLines.data?.find((l) => l.id === form.resultLineId)?.studentName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(correction ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        studentName,
        updatedOn: now,
      } as ResultCorrection,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{correction ? `Edit correction — ${correction.studentName ?? correction.resultLineId}` : "Create result correction"}</DialogTitle>
          <DialogDescription>Retotal, recheck or data-fix for a result line (M09.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Result Line</Label>
            <Select value={form.resultLineId} onValueChange={(v) => set({ resultLineId: v })}>
              <SelectTrigger><SelectValue placeholder="Select line" /></SelectTrigger>
              <SelectContent>{(resultLines.data ?? []).map((l) => <SelectItem key={l.id} value={l.id}>{l.studentName} — {l.resultRunName ?? l.resultRunId}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as CorrectionType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Input placeholder="e.g. Totalling error — 12 marks missed" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CorrectionStatus2 })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Corrected By</Label>
            <Input placeholder="e.g. Manoj Rai" value={form.correctedBy ?? ""} onChange={(e) => set({ correctedBy: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.resultLineId || !form.type || !form.reason || !form.status}>
            <Plus className="h-4 w-4" /> {correction ? "Save changes" : "Create correction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
