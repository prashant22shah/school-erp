import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveContentPlanItem, useSyllabusPlans } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ContentPlanItem } from "@/lib/types";

export function ContentPlanItemFormDialog({ open, onOpenChange, item }: { open: boolean; onOpenChange: (o: boolean) => void; item?: ContentPlanItem }) {
  const save = useSaveContentPlanItem();
  const plans = useSyllabusPlans();
  const [form, setForm] = useState<Partial<ContentPlanItem>>({});

  useEffect(() => {
    if (open) {
      setForm(item ?? { syllabusPlanId: "", sequence: "1", topic: "", resources: "", assessmentMethod: "" });
    }
  }, [open, item]);

  const set = (patch: Partial<ContentPlanItem>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.syllabusPlanId || !form.topic) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(item ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as ContentPlanItem,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? `Edit content item — ${item.topic}` : "Create content item"}</DialogTitle>
          <DialogDescription>Add a topic to a syllabus plan with sequence and assessment method (M06.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Syllabus Plan</Label>
            <Select value={form.syllabusPlanId} onValueChange={(v) => set({ syllabusPlanId: v })}>
              <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
              <SelectContent>{(plans.data ?? []).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Sequence</Label>
            <Input placeholder="e.g. 1" value={form.sequence ?? ""} onChange={(e) => set({ sequence: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Topic</Label>
            <Input placeholder="e.g. Introduction to Algebra" value={form.topic ?? ""} onChange={(e) => set({ topic: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Resources</Label>
            <Input placeholder="e.g. Textbook, Lab kit" value={form.resources ?? ""} onChange={(e) => set({ resources: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Assessment Method</Label>
            <Input placeholder="e.g. Quiz, Assignment" value={form.assessmentMethod ?? ""} onChange={(e) => set({ assessmentMethod: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.syllabusPlanId || !form.topic}>
            <Plus className="h-4 w-4" /> {item ? "Save changes" : "Create item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
