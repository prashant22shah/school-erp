import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveCompletionRule, useGradeClasses } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { CompletionRule } from "@/lib/types";

export function CompletionRuleFormDialog({ open, onOpenChange, rule }: { open: boolean; onOpenChange: (o: boolean) => void; rule?: CompletionRule }) {
  const save = useSaveCompletionRule();
  const grades = useGradeClasses();
  const [form, setForm] = useState<Partial<CompletionRule>>({});
  useEffect(() => {
    if (open) setForm(rule ?? { name: "", gradeClassId: "", gradeClassName: "", minGpa: 2.0, minCreditHours: 0, requirements: "", isActive: true });
  }, [open, rule]);
  const set = (patch: Partial<CompletionRule>) => setForm((f) => ({ ...f, ...patch }));
  const submit = () => {
    if (!form.name || !form.gradeClassId) return;
    const gradeName = grades.data?.find((g) => g.id === form.gradeClassId)?.name ?? "";
    save.mutate({ ...(rule ?? { id: uid(), tenantId: "tenant-default" }), ...form, gradeClassName: gradeName } as CompletionRule, { onSuccess: () => onOpenChange(false) });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{rule ? `Edit completion rule — ${rule.name}` : "Create completion rule"}</DialogTitle>
          <DialogDescription>Completion criteria for grade/class (M03.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2"><Label>Name</Label><Input placeholder="e.g. SEE Completion" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Grade/Class</Label><Select value={form.gradeClassId} onValueChange={(v) => set({ gradeClassId: v })}><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger><SelectContent>{(grades.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Min GPA</Label><Input type="number" step="0.1" value={form.minGpa ?? 0} onChange={(e) => set({ minGpa: +e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Min Credits</Label><Input type="number" value={form.minCreditHours ?? 0} onChange={(e) => set({ minCreditHours: +e.target.value })} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Requirements</Label><Input placeholder="Requirements" value={form.requirements ?? ""} onChange={(e) => set({ requirements: e.target.value })} /></div>
          <div className="flex items-center gap-2"><Switch checked={form.isActive ?? true} onCheckedChange={(v) => set({ isActive: v })} /><Label>Active</Label></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.gradeClassId}><Plus className="h-4 w-4" /> {rule ? "Save changes" : "Create rule"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
