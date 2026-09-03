import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSavePromotionRule, useGradeClasses } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { PromotionRule } from "@/lib/types";

export function PromotionRuleFormDialog({ open, onOpenChange, rule }: { open: boolean; onOpenChange: (o: boolean) => void; rule?: PromotionRule }) {
  const save = useSavePromotionRule();
  const gradeClasses = useGradeClasses();
  const [form, setForm] = useState<Partial<PromotionRule>>({});

  useEffect(() => {
    if (open) {
      setForm(rule ?? { name: "", nameNe: "", fromGradeId: "", fromGradeName: "", toGradeId: "", toGradeName: "", minGpa: 2.0, minAttendance: 75, maxBacklogs: 0, isActive: true });
    }
  }, [open, rule]);

  const set = (patch: Partial<PromotionRule>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.fromGradeId || !form.toGradeId) return;
    const fromGradeName = (gradeClasses.data ?? []).find((g) => g.id === form.fromGradeId)?.name ?? "";
    const toGradeName = (gradeClasses.data ?? []).find((g) => g.id === form.toGradeId)?.name ?? "";
    save.mutate(
      { ...(rule ?? { id: uid() }), ...form, fromGradeName, toGradeName, tenantId: "tenant-default" } as PromotionRule,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{rule ? `Edit promotion rule — ${rule.name}` : "Create promotion rule"}</DialogTitle>
          <DialogDescription>Define criteria for promoting students between grades (M03.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Grade 5 → Grade 6" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>From grade</Label>
            <Select value={form.fromGradeId} onValueChange={(v) => set({ fromGradeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
              <SelectContent>{(gradeClasses.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>To grade</Label>
            <Select value={form.toGradeId} onValueChange={(v) => set({ toGradeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
              <SelectContent>{(gradeClasses.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Minimum GPA</Label>
            <Input type="number" step="0.1" min={0} max={4} value={form.minGpa ?? 2.0} onChange={(e) => set({ minGpa: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Minimum attendance (%)</Label>
            <Input type="number" min={0} max={100} value={form.minAttendance ?? 75} onChange={(e) => set({ minAttendance: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Max backlogs allowed</Label>
            <Input type="number" min={0} value={form.maxBacklogs ?? 0} onChange={(e) => set({ maxBacklogs: +e.target.value })} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={form.isActive ?? true} onCheckedChange={(v) => set({ isActive: v })} />
            <Label>Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.fromGradeId || !form.toGradeId}>
            <Plus className="h-4 w-4" /> {rule ? "Save changes" : "Create rule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
