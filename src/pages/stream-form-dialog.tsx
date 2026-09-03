import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveStream, useGradeClasses } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Stream } from "@/lib/types";

export function StreamFormDialog({ open, onOpenChange, stream }: { open: boolean; onOpenChange: (o: boolean) => void; stream?: Stream }) {
  const save = useSaveStream();
  const gradeClasses = useGradeClasses();
  const [form, setForm] = useState<Partial<Stream>>({});

  useEffect(() => {
    if (open) {
      setForm(stream ?? { name: "", nameNe: "", code: "", description: "", gradeClassId: "", gradeClassName: "", isActive: true });
    }
  }, [open, stream]);

  const set = (patch: Partial<Stream>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.code || !form.gradeClassId) return;
    const gradeClassName = (gradeClasses.data ?? []).find((g) => g.id === form.gradeClassId)?.name ?? "";
    save.mutate(
      { ...(stream ?? { id: uid() }), ...form, gradeClassName } as Stream,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{stream ? `Edit stream — ${stream.name}` : "Create stream"}</DialogTitle>
          <DialogDescription>Define a stream/track within a grade/class (M03.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Science" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. SCI" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Grade/class</Label>
            <Select value={form.gradeClassId} onValueChange={(v) => set({ gradeClassId: v })}>
              <SelectTrigger><SelectValue placeholder="Select grade/class" /></SelectTrigger>
              <SelectContent>{(gradeClasses.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Stream description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.code || !form.gradeClassId}>
            <Plus className="h-4 w-4" /> {stream ? "Save changes" : "Create stream"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
