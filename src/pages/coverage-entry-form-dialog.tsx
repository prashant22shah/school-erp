import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCoverageEntry, useLessonPlans } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { CoverageEntry } from "@/lib/types";

export function CoverageEntryFormDialog({ open, onOpenChange, entry }: { open: boolean; onOpenChange: (o: boolean) => void; entry?: CoverageEntry }) {
  const save = useSaveCoverageEntry();
  const plans = useLessonPlans();
  const [form, setForm] = useState<Partial<CoverageEntry>>({});

  useEffect(() => {
    if (open) {
      setForm(entry ?? { lessonPlanId: "", completedAt: "", notes: "" });
    }
  }, [open, entry]);

  const set = (patch: Partial<CoverageEntry>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.lessonPlanId || !form.completedAt) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(entry ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as CoverageEntry,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{entry ? `Edit coverage entry — ${entry.completedAt}` : "Create coverage entry"}</DialogTitle>
          <DialogDescription>Record lesson coverage completion (M06.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Lesson Plan</Label>
            <Select value={form.lessonPlanId} onValueChange={(v) => set({ lessonPlanId: v })}>
              <SelectTrigger><SelectValue placeholder="Select lesson plan" /></SelectTrigger>
              <SelectContent>{(plans.data ?? []).map((p) => <SelectItem key={p.id} value={p.id}>{p.localDate} - {p.objectives}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Completed At</Label>
            <Input placeholder="e.g. 2025-04-10" value={form.completedAt ?? ""} onChange={(e) => set({ completedAt: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes</Label>
            <Input placeholder="Coverage notes…" value={form.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.lessonPlanId || !form.completedAt}>
            <Plus className="h-4 w-4" /> {entry ? "Save changes" : "Create entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
