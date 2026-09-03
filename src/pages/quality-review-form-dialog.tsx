import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveQualityReview } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { QualityReview, ReviewScopeType, ReviewType, ReviewStatus } from "@/lib/types";

const SCOPE_TYPES: ReviewScopeType[] = ["school", "faculty", "subject", "affiliation"];
const REVIEW_TYPES: ReviewType[] = ["internal", "external", "affiliation", "moderation"];
const STATUSES: ReviewStatus[] = ["draft", "in_progress", "completed", "certified"];

export function QualityReviewFormDialog({ open, onOpenChange, review }: { open: boolean; onOpenChange: (o: boolean) => void; review?: QualityReview }) {
  const save = useSaveQualityReview();
  const [form, setForm] = useState<Partial<QualityReview>>({});

  useEffect(() => {
    if (open) {
      setForm(review ?? { scopeType: "school", scopeId: "", reviewType: "internal", cycle: "", status: "draft", findings: "" });
    }
  }, [open, review]);

  const set = (patch: Partial<QualityReview>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.scopeType || !form.scopeId || !form.reviewType || !form.cycle) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(review ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as QualityReview,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{review ? `Edit quality review — ${review.cycle}` : "Create quality review"}</DialogTitle>
          <DialogDescription>Create a quality review for a scope and cycle (M06.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Scope Type</Label>
            <Select value={form.scopeType} onValueChange={(v) => set({ scopeType: v as ReviewScopeType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SCOPE_TYPES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Scope ID</Label>
            <Input placeholder="e.g. SCH-001" value={form.scopeId ?? ""} onChange={(e) => set({ scopeId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Review Type</Label>
            <Select value={form.reviewType} onValueChange={(v) => set({ reviewType: v as ReviewType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{REVIEW_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Cycle</Label>
            <Input placeholder="e.g. 2025-Q2" value={form.cycle ?? ""} onChange={(e) => set({ cycle: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ReviewStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Findings</Label>
            <Input placeholder="Review findings…" value={form.findings ?? ""} onChange={(e) => set({ findings: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.scopeType || !form.scopeId || !form.reviewType || !form.cycle}>
            <Plus className="h-4 w-4" /> {review ? "Save changes" : "Create review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
