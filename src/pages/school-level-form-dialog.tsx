import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveSchoolLevel } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { SchoolLevel, SchoolLevelCode } from "@/lib/types";

const CODES: SchoolLevelCode[] = ["ECED", "Basic", "Secondary", "Plus2"];

export function SchoolLevelFormDialog({ open, onOpenChange, level }: { open: boolean; onOpenChange: (o: boolean) => void; level?: SchoolLevel }) {
  const save = useSaveSchoolLevel();
  const [form, setForm] = useState<Partial<SchoolLevel>>({});

  useEffect(() => {
    if (open) setForm(level ?? { code: "Basic", name: "", description: "", sequence: 1, isActive: true });
  }, [open, level]);

  const set = (patch: Partial<SchoolLevel>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.code) return;
    save.mutate({ ...(level ?? { id: uid(), tenantId: "tenant-default" }), ...form } as SchoolLevel, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{level ? `Edit level — ${level.name}` : "Create school level"}</DialogTitle>
          <DialogDescription>ECED / Basic / Secondary / Plus2 level (M03.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Basic Education" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Select value={form.code} onValueChange={(v) => set({ code: v as SchoolLevelCode })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CODES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Sequence</Label>
            <Input type="number" value={form.sequence ?? 1} onChange={(e) => set({ sequence: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Age Range</Label>
            <Input placeholder="e.g. 6–13" value={form.ageRange ?? ""} onChange={(e) => set({ ageRange: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Description" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.isActive ?? true} onCheckedChange={(v) => set({ isActive: v })} />
            <Label>Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.code}><Plus className="h-4 w-4" /> {level ? "Save changes" : "Create level"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
