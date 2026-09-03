import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSubjectCombinationRule } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { SubjectCombinationRule } from "@/lib/types";

const STATUSES: ("active" | "inactive")[] = ["active", "inactive"];

export function SubjectCombinationRuleFormDialog({ open, onOpenChange, rule }: { open: boolean; onOpenChange: (o: boolean) => void; rule?: SubjectCombinationRule }) {
  const save = useSaveSubjectCombinationRule();
  const [form, setForm] = useState<Partial<SubjectCombinationRule>>({});

  useEffect(() => {
    if (open) setForm(rule ?? { board: "", grade: "", stream: "", compulsorySubjects: "", optionalSubjects: "", maxOptional: 2, version: 1, status: "active" });
  }, [open, rule]);

  const set = (patch: Partial<SubjectCombinationRule>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.board || !form.grade || !form.stream) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(rule ?? { id: uid(), createdOn: now }),
        ...form,
      } as SubjectCombinationRule,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{rule ? `Edit rule — ${rule.board} ${rule.grade}` : "Create combination rule"}</DialogTitle>
          <DialogDescription>Define subject combination rules for streams and electives (M21.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Board</Label>
            <Input placeholder="e.g. NEB" value={form.board ?? ""} onChange={(e) => set({ board: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Grade</Label>
            <Input placeholder="e.g. Grade 11" value={form.grade ?? ""} onChange={(e) => set({ grade: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Stream</Label>
            <Input placeholder="e.g. Science" value={form.stream ?? ""} onChange={(e) => set({ stream: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Max Optional Subjects</Label>
            <Input type="number" min={0} value={form.maxOptional ?? 2} onChange={(e) => set({ maxOptional: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Compulsory Subjects</Label>
            <Input placeholder="e.g. English, Nepali, Mathematics" value={form.compulsorySubjects ?? ""} onChange={(e) => set({ compulsorySubjects: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Optional Subjects</Label>
            <Input placeholder="e.g. Physics, Chemistry, Biology" value={form.optionalSubjects ?? ""} onChange={(e) => set({ optionalSubjects: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Version</Label>
            <Input type="number" min={1} value={form.version ?? 1} onChange={(e) => set({ version: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as "active" | "inactive" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.board || !form.grade || !form.stream}>
            <Plus className="h-4 w-4" /> {rule ? "Save changes" : "Create rule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
