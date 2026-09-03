import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSection, useGradeClasses, useAcademicYears } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Section } from "@/lib/types";

export function SectionFormDialog({ open, onOpenChange, section }: { open: boolean; onOpenChange: (o: boolean) => void; section?: Section }) {
  const save = useSaveSection();
  const gradeClasses = useGradeClasses();
  const years = useAcademicYears();
  const [form, setForm] = useState<Partial<Section>>({});

  useEffect(() => {
    if (open) {
      setForm(section ?? { name: "", nameNe: "", gradeClassId: "", gradeClassName: "", academicYearId: "", academicYearName: "", capacity: 40, enrolled: 0, classTeacherName: "", roomNo: "", isActive: true });
    }
  }, [open, section]);

  const set = (patch: Partial<Section>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.gradeClassId || !form.academicYearId) return;
    const gradeClassName = (gradeClasses.data ?? []).find((g) => g.id === form.gradeClassId)?.name ?? "";
    const academicYearName = (years.data ?? []).find((y) => y.id === form.academicYearId)?.name ?? "";
    save.mutate(
      { ...(section ?? { id: uid() }), ...form, gradeClassName, academicYearName } as Section,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{section ? `Edit section — ${section.name}` : "Create section"}</DialogTitle>
          <DialogDescription>Define a class section with capacity and teacher assignment (M03.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Section A" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Grade/class</Label>
            <Select value={form.gradeClassId} onValueChange={(v) => set({ gradeClassId: v })}>
              <SelectTrigger><SelectValue placeholder="Select grade/class" /></SelectTrigger>
              <SelectContent>{(gradeClasses.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Academic year</Label>
            <Select value={form.academicYearId} onValueChange={(v) => set({ academicYearId: v })}>
              <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>{(years.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Capacity</Label>
            <Input type="number" min={1} value={form.capacity ?? 40} onChange={(e) => set({ capacity: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Room number</Label>
            <Input placeholder="e.g. 101" value={form.roomNo ?? ""} onChange={(e) => set({ roomNo: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Class teacher</Label>
            <Input placeholder="Teacher name" value={form.classTeacherName ?? ""} onChange={(e) => set({ classTeacherName: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.gradeClassId || !form.academicYearId}>
            <Plus className="h-4 w-4" /> {section ? "Save changes" : "Create section"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
