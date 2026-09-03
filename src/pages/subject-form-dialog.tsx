import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSubject, useSchoolLevels } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Subject, SubjectType } from "@/lib/types";

const TYPES: SubjectType[] = ["core", "elective", "practical", "extra"];

export function SubjectFormDialog({ open, onOpenChange, subject }: { open: boolean; onOpenChange: (o: boolean) => void; subject?: Subject }) {
  const save = useSaveSubject();
  const levels = useSchoolLevels();
  const [form, setForm] = useState<Partial<Subject>>({});

  useEffect(() => {
    if (open) {
      setForm(subject ?? { name: "", nameNe: "", code: "", description: "", type: "core", levelId: "", levelName: "", isActive: true });
    }
  }, [open, subject]);

  const set = (patch: Partial<Subject>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.code || !form.levelId) return;
    const levelName = (levels.data ?? []).find((l) => l.id === form.levelId)?.name ?? "";
    save.mutate(
      { ...(subject ?? { id: uid() }), ...form, levelName } as Subject,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{subject ? `Edit subject — ${subject.name}` : "Create subject"}</DialogTitle>
          <DialogDescription>Define a subject in the curriculum catalog (M03.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Mathematics" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. MATH" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as SubjectType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>School level</Label>
            <Select value={form.levelId} onValueChange={(v) => set({ levelId: v })}>
              <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
              <SelectContent>{(levels.data ?? []).map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Subject description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.code || !form.levelId}>
            <Plus className="h-4 w-4" /> {subject ? "Save changes" : "Create subject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
