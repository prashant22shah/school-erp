import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSavePerformanceReview, useStaffProfiles } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { PerformanceReview, ReviewStatus2 } from "@/lib/types";

const STATUSES: ReviewStatus2[] = ["draft", "submitted", "approved", "acknowledged"];

export function PerformanceReviewFormDialog({ open, onOpenChange, review }: { open: boolean; onOpenChange: (o: boolean) => void; review?: PerformanceReview }) {
  const save = useSavePerformanceReview();
  const staffProfiles = useStaffProfiles();
  const [form, setForm] = useState<Partial<PerformanceReview>>({});

  useEffect(() => {
    if (open) {
      setForm(
        review ?? {
          staffRef: "",
          staffName: "",
          period: "",
          rating: 3,
          reviewer: "",
          status: "draft",
          remarks: "",
        }
      );
    }
  }, [open, review]);

  const set = (patch: Partial<PerformanceReview>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.staffRef || !form.period || form.rating == null || !form.reviewer || !form.status) return;
    const now = new Date().toISOString();
    const staffName = staffProfiles.data?.find((s) => s.id === form.staffRef)?.name ?? form.staffName ?? form.staffRef!;
    save.mutate(
      {
        id: review?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: review?.createdOn ?? now,
        updatedOn: now,
        staffRef: form.staffRef!,
        staffName,
        period: form.period!,
        rating: Number(form.rating),
        reviewer: form.reviewer!,
        status: form.status!,
        remarks: form.remarks,
      } as PerformanceReview,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{review ? `Edit review — ${review.staffName}` : "Create performance review"}</DialogTitle>
          <DialogDescription>Record staff performance appraisals by period (M13.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Staff</Label>
            <Select value={form.staffRef} onValueChange={(v) => {
              const name = staffProfiles.data?.find((s) => s.id === v)?.name ?? "";
              set({ staffRef: v, staffName: name });
            }}>
              <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
              <SelectContent>{(staffProfiles.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name} ({s.staffCode})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Staff Name</Label>
            <Input placeholder="Staff display name" value={form.staffName ?? ""} onChange={(e) => set({ staffName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Period</Label>
            <Input placeholder="e.g. FY 2082/83 - Q1" value={form.period ?? ""} onChange={(e) => set({ period: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Rating (1-5)</Label>
            <Input type="number" min={1} max={5} step={0.5} value={form.rating ?? 3} onChange={(e) => set({ rating: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Reviewer</Label>
            <Input placeholder="Reviewer name" value={form.reviewer ?? ""} onChange={(e) => set({ reviewer: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ReviewStatus2 })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Remarks</Label>
            <Textarea placeholder="Review remarks" value={form.remarks ?? ""} onChange={(e) => set({ remarks: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.staffRef || !form.period || form.rating == null || !form.reviewer || !form.status}>
            <Plus className="h-4 w-4" /> {review ? "Save changes" : "Create review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
