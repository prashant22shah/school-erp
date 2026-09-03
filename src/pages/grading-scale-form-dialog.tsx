import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSaveGradingScale } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { GradingScale, GradeEntry } from "@/lib/types";

const DEFAULT_GRADES: GradeEntry[] = [
  { letter: "A+", minMark: 90, maxMark: 100, gpa: 4.0, description: "Outstanding" },
  { letter: "A", minMark: 80, maxMark: 89, gpa: 3.6, description: "Excellent" },
  { letter: "B+", minMark: 70, maxMark: 79, gpa: 3.2, description: "Very Good" },
  { letter: "B", minMark: 60, maxMark: 69, gpa: 2.8, description: "Good" },
  { letter: "C+", minMark: 50, maxMark: 59, gpa: 2.4, description: "Above Average" },
  { letter: "C", minMark: 40, maxMark: 49, gpa: 2.0, description: "Average" },
  { letter: "D", minMark: 30, maxMark: 39, gpa: 1.6, description: "Below Average" },
  { letter: "NG", minMark: 0, maxMark: 29, gpa: 0.0, description: "Not Graded" },
];

export function GradingScaleFormDialog({ open, onOpenChange, scale }: { open: boolean; onOpenChange: (o: boolean) => void; scale?: GradingScale }) {
  const save = useSaveGradingScale();
  const [form, setForm] = useState<Partial<GradingScale>>({});
  const [gradesJson, setGradesJson] = useState("");

  useEffect(() => {
    if (open) {
      const initial = scale ?? { name: "", nameNe: "", description: "", grades: DEFAULT_GRADES, isActive: true, isDefault: false };
      setForm(initial);
      setGradesJson(JSON.stringify(initial.grades ?? DEFAULT_GRADES, null, 2));
    }
  }, [open, scale]);

  const set = (patch: Partial<GradingScale>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name) return;
    let grades: GradeEntry[];
    try { grades = JSON.parse(gradesJson); } catch { return; }
    save.mutate(
      { ...(scale ?? { id: uid() }), ...form, grades, tenantId: "tenant-default" } as GradingScale,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{scale ? `Edit grading scale — ${scale.name}` : "Create grading scale"}</DialogTitle>
          <DialogDescription>Define grade boundaries, GPA mapping and letter grades (M03.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. GPA 4.0 Scale" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Scale description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.isActive ?? true} onCheckedChange={(v) => set({ isActive: v })} />
            <Label>Active</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.isDefault ?? false} onCheckedChange={(v) => set({ isDefault: v })} />
            <Label>Default scale</Label>
          </div>
        </div>
        <div className="space-y-1.5 pt-2">
          <Label>Grades (JSON array)</Label>
          <textarea
            className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono text-xs"
            value={gradesJson}
            onChange={(e) => setGradesJson(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Array of {"{ letter, minMark, maxMark, gpa, description }"} objects.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name}>
            <Plus className="h-4 w-4" /> {scale ? "Save changes" : "Create scale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
