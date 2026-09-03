import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveReviewAction, useQualityReviews } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ReviewAction, ReviewActionStatus } from "@/lib/types";

const STATUSES: ReviewActionStatus[] = ["draft", "open", "in_progress", "completed", "overdue"];

export function ReviewActionFormDialog({ open, onOpenChange, action }: { open: boolean; onOpenChange: (o: boolean) => void; action?: ReviewAction }) {
  const save = useSaveReviewAction();
  const reviews = useQualityReviews();
  const [form, setForm] = useState<Partial<ReviewAction>>({});

  useEffect(() => {
    if (open) {
      setForm(action ?? { reviewId: "", ownerRef: "", ownerName: "", dueDate: "", status: "draft", action: "" });
    }
  }, [open, action]);

  const set = (patch: Partial<ReviewAction>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.reviewId || !form.ownerRef || !form.ownerName || !form.dueDate || !form.action) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(action ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as ReviewAction,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{action ? `Edit review action — ${action.action}` : "Create review action"}</DialogTitle>
          <DialogDescription>Create an action item for a quality review (M06.06).</DialogDescription>
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
            <Label>Action</Label>
            <Input placeholder="e.g. Submit revised syllabus" value={form.action ?? ""} onChange={(e) => set({ action: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Owner Ref</Label>
            <Input placeholder="e.g. STAFF-001" value={form.ownerRef ?? ""} onChange={(e) => set({ ownerRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Owner Name</Label>
            <Input placeholder="e.g. Ram Sharma" value={form.ownerName ?? ""} onChange={(e) => set({ ownerName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Due Date</Label>
            <Input placeholder="e.g. 2025-05-10" value={form.dueDate ?? ""} onChange={(e) => set({ dueDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ReviewActionStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.reviewId || !form.ownerRef || !form.ownerName || !form.dueDate || !form.action}>
            <Plus className="h-4 w-4" /> {action ? "Save changes" : "Create action"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
