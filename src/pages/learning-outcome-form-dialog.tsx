import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveLearningOutcome, useCurriculumMaps } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LearningOutcome } from "@/lib/types";

export function LearningOutcomeFormDialog({ open, onOpenChange, outcome }: { open: boolean; onOpenChange: (o: boolean) => void; outcome?: LearningOutcome }) {
  const save = useSaveLearningOutcome();
  const maps = useCurriculumMaps();
  const [form, setForm] = useState<Partial<LearningOutcome>>({});

  useEffect(() => {
    if (open) {
      setForm(outcome ?? { curriculumMapId: "", code: "", description: "" });
    }
  }, [open, outcome]);

  const set = (patch: Partial<LearningOutcome>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.curriculumMapId || !form.code) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(outcome ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as LearningOutcome,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{outcome ? `Edit learning outcome — ${outcome.code}` : "Create learning outcome"}</DialogTitle>
          <DialogDescription>Define a learning outcome for a curriculum map (M06.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Curriculum Map</Label>
            <Select value={form.curriculumMapId} onValueChange={(v) => set({ curriculumMapId: v })}>
              <SelectTrigger><SelectValue placeholder="Select map" /></SelectTrigger>
              <SelectContent>{(maps.data ?? []).map((m) => <SelectItem key={m.id} value={m.id}>{m.offeringRef} v{m.version}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. LO-01" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Learning outcome description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.curriculumMapId || !form.code}>
            <Plus className="h-4 w-4" /> {outcome ? "Save changes" : "Create outcome"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
