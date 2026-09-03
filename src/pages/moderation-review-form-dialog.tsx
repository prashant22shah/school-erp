import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveModerationReview, useCurriculumOfferings } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ModerationReview, ModerationOutcome } from "@/lib/types";

const OUTCOMES: ModerationOutcome[] = ["agreed", "disagreed", "revised", "pending"];

export function ModerationReviewFormDialog({ open, onOpenChange, moderation }: { open: boolean; onOpenChange: (o: boolean) => void; moderation?: ModerationReview }) {
  const save = useSaveModerationReview();
  const offerings = useCurriculumOfferings();
  const [form, setForm] = useState<Partial<ModerationReview>>({});

  useEffect(() => {
    if (open) {
      setForm(moderation ?? { reviewId: "", subjectRef: "", subjectName: "", outcome: "pending", remarks: "", reviewerId: "", reviewerName: "", isAnonymous: false });
    }
  }, [open, moderation]);

  const set = (patch: Partial<ModerationReview>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.reviewId || !form.subjectRef || !form.reviewerId) return;
    const subjectName = (offerings.data ?? []).find((o) => o.id === form.subjectRef)?.subjectName ?? "";
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(moderation ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        subjectName,
        updatedOn: now,
      } as ModerationReview,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{moderation ? `Edit moderation review — ${moderation.subjectName}` : "Create moderation review"}</DialogTitle>
          <DialogDescription>Record a moderation review outcome (M06.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Review ID</Label>
            <Input placeholder="e.g. REV-001" value={form.reviewId ?? ""} onChange={(e) => set({ reviewId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select value={form.subjectRef} onValueChange={(v) => set({ subjectRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>{(offerings.data ?? []).map((o) => <SelectItem key={o.id} value={o.id}>{o.subjectName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Outcome</Label>
            <Select value={form.outcome} onValueChange={(v) => set({ outcome: v as ModerationOutcome })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{OUTCOMES.map((o) => <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Reviewer Name</Label>
            <Input placeholder="e.g. Sita Devi" value={form.reviewerName ?? ""} onChange={(e) => set({ reviewerName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Reviewer ID</Label>
            <Input placeholder="e.g. STAFF-005" value={form.reviewerId ?? ""} onChange={(e) => set({ reviewerId: e.target.value })} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={form.isAnonymous ?? false} onCheckedChange={(v) => set({ isAnonymous: v })} />
            <Label>Anonymous</Label>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Remarks</Label>
            <Input placeholder="Moderation remarks…" value={form.remarks ?? ""} onChange={(e) => set({ remarks: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.reviewId || !form.subjectRef || !form.reviewerId}>
            <Plus className="h-4 w-4" /> {moderation ? "Save changes" : "Create moderation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
