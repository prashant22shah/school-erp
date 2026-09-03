import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveGradeClass, useSchoolLevels } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { GradeClass } from "@/lib/types";

export function GradeClassFormDialog({ open, onOpenChange, gradeClass }: { open: boolean; onOpenChange: (o: boolean) => void; gradeClass?: GradeClass }) {
  const save = useSaveGradeClass();
  const levels = useSchoolLevels();
  const [form, setForm] = useState<Partial<GradeClass>>({});

  useEffect(() => {
    if (open) {
      setForm(gradeClass ?? { name: "", nameNe: "", code: "", levelId: "", levelName: "", sequence: 1, isActive: true });
    }
  }, [open, gradeClass]);

  const set = (patch: Partial<GradeClass>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.code || !form.levelId) return;
    const levelName = (levels.data ?? []).find((l) => l.id === form.levelId)?.name ?? "";
    save.mutate(
      { ...(gradeClass ?? { id: uid() }), ...form, levelName } as GradeClass,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{gradeClass ? `Edit grade/class — ${gradeClass.name}` : "Create grade/class"}</DialogTitle>
          <DialogDescription>Define a grade or class within a school level (M03.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Grade 1" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. G1" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>School level</Label>
            <Select value={form.levelId} onValueChange={(v) => set({ levelId: v })}>
              <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
              <SelectContent>{(levels.data ?? []).map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Sequence</Label>
            <Input type="number" min={1} value={form.sequence ?? 1} onChange={(e) => set({ sequence: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.code || !form.levelId}>
            <Plus className="h-4 w-4" /> {gradeClass ? "Save changes" : "Create grade/class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
