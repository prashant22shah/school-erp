import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSavePosition } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Position } from "@/lib/types";

export function PositionFormDialog({ open, onOpenChange, position }: { open: boolean; onOpenChange: (o: boolean) => void; position?: Position }) {
  const save = useSavePosition();
  const [form, setForm] = useState<Partial<Position>>({});

  useEffect(() => {
    if (open) {
      setForm(
        position ?? {
          title: "",
          department: "",
          grade: "",
          isVacant: false,
          headCount: 1,
        }
      );
    }
  }, [open, position]);

  const set = (patch: Partial<Position>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.title || !form.department || !form.grade || form.headCount == null) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: position?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: position?.createdOn ?? now,
        updatedOn: now,
        title: form.title!,
        department: form.department!,
        grade: form.grade!,
        isVacant: Boolean(form.isVacant),
        headCount: Number(form.headCount),
      } as Position,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{position ? `Edit position — ${position.title}` : "Create position"}</DialogTitle>
          <DialogDescription>Define organisational positions and vacancy status (M13.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Senior Teacher" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Input placeholder="e.g. Science" value={form.department ?? ""} onChange={(e) => set({ department: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Grade</Label>
            <Input placeholder="e.g. G7" value={form.grade ?? ""} onChange={(e) => set({ grade: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Head Count</Label>
            <Input type="number" min={0} value={form.headCount ?? 0} onChange={(e) => set({ headCount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Vacant</Label>
            <Select value={String(form.isVacant)} onValueChange={(v) => set({ isVacant: v === "true" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Vacant</SelectItem>
                <SelectItem value="false">Filled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch checked={!!form.isVacant} onCheckedChange={(v) => set({ isVacant: v })} />
            <span className="text-sm text-muted-foreground">{form.isVacant ? "Position is vacant" : "Position is filled"}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.title || !form.department || !form.grade}>
            <Plus className="h-4 w-4" /> {position ? "Save changes" : "Create position"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
