import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveTerm, useAcademicYears } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Term } from "@/lib/types";

const STATUSES = ["planned", "active", "completed"] as const;

export function TermFormDialog({ open, onOpenChange, term }: { open: boolean; onOpenChange: (o: boolean) => void; term?: Term }) {
  const save = useSaveTerm();
  const years = useAcademicYears();
  const [form, setForm] = useState<Partial<Term>>({});

  useEffect(() => {
    if (open) {
      setForm(term ?? { name: "", nameNe: "", academicYearId: "", academicYearName: "", startDate: "", endDate: "", sequence: 1, status: "planned" });
    }
  }, [open, term]);

  const set = (patch: Partial<Term>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.academicYearId || !form.startDate || !form.endDate) return;
    const yearName = (years.data ?? []).find((y) => y.id === form.academicYearId)?.name ?? "";
    save.mutate(
      { ...(term ?? { id: uid() }), ...form, academicYearName: yearName } as Term,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{term ? `Edit term — ${term.name}` : "Create term"}</DialogTitle>
          <DialogDescription>Define term/semester within an academic year (M03.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. First Term" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Academic year</Label>
            <Select value={form.academicYearId} onValueChange={(v) => set({ academicYearId: v })}>
              <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>{(years.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Sequence</Label>
            <Input type="number" min={1} value={form.sequence ?? 1} onChange={(e) => set({ sequence: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Start date</Label>
            <Input type="date" value={form.startDate ?? ""} onChange={(e) => set({ startDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>End date</Label>
            <Input type="date" value={form.endDate ?? ""} onChange={(e) => set({ endDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as Term["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.academicYearId || !form.startDate || !form.endDate}>
            <Plus className="h-4 w-4" /> {term ? "Save changes" : "Create term"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
