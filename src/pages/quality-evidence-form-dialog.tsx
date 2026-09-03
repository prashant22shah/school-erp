import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveQualityEvidence, useQualityReviews } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { QualityEvidence } from "@/lib/types";

export function QualityEvidenceFormDialog({ open, onOpenChange, evidence }: { open: boolean; onOpenChange: (o: boolean) => void; evidence?: QualityEvidence }) {
  const save = useSaveQualityEvidence();
  const reviews = useQualityReviews();
  const [form, setForm] = useState<Partial<QualityEvidence>>({});

  useEffect(() => {
    if (open) {
      setForm(evidence ?? { reviewId: "", objectRef: "", objectType: "", description: "" });
    }
  }, [open, evidence]);

  const set = (patch: Partial<QualityEvidence>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.reviewId || !form.objectRef || !form.objectType || !form.description) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(evidence ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as QualityEvidence,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{evidence ? `Edit evidence — ${evidence.objectRef}` : "Create quality evidence"}</DialogTitle>
          <DialogDescription>Attach evidence to a quality review (M06.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Quality Review</Label>
            <Select value={form.reviewId} onValueChange={(v) => set({ reviewId: v })}>
              <SelectTrigger><SelectValue placeholder="Select review" /></SelectTrigger>
              <SelectContent>{(reviews.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.scopeType} - {r.cycle}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Object Ref</Label>
            <Input placeholder="e.g. PLAN-123" value={form.objectRef ?? ""} onChange={(e) => set({ objectRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Object Type</Label>
            <Input placeholder="e.g. lesson_plan" value={form.objectType ?? ""} onChange={(e) => set({ objectType: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Evidence description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.reviewId || !form.objectRef || !form.objectType || !form.description}>
            <Plus className="h-4 w-4" /> {evidence ? "Save changes" : "Create evidence"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
