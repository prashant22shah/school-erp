import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveSelectionScore, useSelectionEvents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { SelectionScore } from "@/lib/types";

export function SelectionScoreFormDialog({ open, onOpenChange, score }: { open: boolean; onOpenChange: (v: boolean) => void; score?: SelectionScore }) {
  const save = useSaveSelectionScore();
  const events = useSelectionEvents();
  const [form, setForm] = useState<Partial<SelectionScore>>({});

  useEffect(() => {
    if (open) {
      setForm(score ?? { selectionEventId: "", criterion: "", maxScore: 100, score: 0, remarks: "", evaluatedBy: "" });
    }
  }, [open, score]);

  const set = (patch: Partial<SelectionScore>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.selectionEventId || !form.criterion || !form.evaluatedBy) return;
    save.mutate(
      { ...(score ?? { id: uid() }), ...form, tenantId: "tenant-default" } as SelectionScore,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{score ? `Edit selection score` : "Create selection score"}</DialogTitle>
          <DialogDescription>Record a score for a selection event criterion (M04.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Selection event</Label>
            <Select value={form.selectionEventId ?? ""} onValueChange={(v) => set({ selectionEventId: v })}>
              <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
              <SelectContent>{(events.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.applicationName} — {e.type.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Criterion</Label>
            <Input placeholder="e.g. Written test, Interview" value={form.criterion ?? ""} onChange={(e) => set({ criterion: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Max score</Label>
            <Input type="number" placeholder="100" value={form.maxScore ?? ""} onChange={(e) => set({ maxScore: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Score</Label>
            <Input type="number" placeholder="0" value={form.score ?? ""} onChange={(e) => set({ score: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Evaluated by</Label>
            <Input placeholder="Evaluator name" value={form.evaluatedBy ?? ""} onChange={(e) => set({ evaluatedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Remarks</Label>
            <Input placeholder="Remarks" value={form.remarks ?? ""} onChange={(e) => set({ remarks: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.selectionEventId || !form.criterion || !form.evaluatedBy}>
            <Plus className="h-4 w-4" /> {score ? "Save changes" : "Create score"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
