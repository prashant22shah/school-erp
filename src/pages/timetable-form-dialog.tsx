import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveTimetable, useAcademicYears, useCampuses } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Timetable, TimetableStatus } from "@/lib/types";

const STATUSES: TimetableStatus[] = ["draft", "approved", "published", "archived"];

export function TimetableFormDialog({ open, onOpenChange, timetable }: { open: boolean; onOpenChange: (o: boolean) => void; timetable?: Timetable }) {
  const save = useSaveTimetable();
  const years = useAcademicYears();
  const campuses = useCampuses();
  const [form, setForm] = useState<Partial<Timetable>>({});

  useEffect(() => {
    if (open) {
      setForm(timetable ?? { academicPeriodRef: "", campusId: "", version: 1, name: "", status: "draft" });
    }
  }, [open, timetable]);

  const set = (patch: Partial<Timetable>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.academicPeriodRef || !form.campusId || !form.name) return;
    const now = new Date().toISOString();
    const campusName = campuses.data?.find((c) => c.id === form.campusId)?.name ?? "";
    const periodName = years.data?.find((y) => y.id === form.academicPeriodRef)?.name ?? "";
    save.mutate(
      {
        ...(timetable ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        campusName,
        academicPeriodName: periodName,
        updatedOn: now,
      } as Timetable,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{timetable ? `Edit timetable — ${timetable.name}` : "Create timetable"}</DialogTitle>
          <DialogDescription>Versioned timetable header for a campus and academic period (M07.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Class 10 — Term 2 Timetable" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Version</Label>
            <Input type="number" min={1} value={form.version ?? 1} onChange={(e) => set({ version: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Academic Period</Label>
            <Select value={form.academicPeriodRef} onValueChange={(v) => set({ academicPeriodRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
              <SelectContent>{(years.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Campus</Label>
            <Select value={form.campusId} onValueChange={(v) => set({ campusId: v })}>
              <SelectTrigger><SelectValue placeholder="Select campus" /></SelectTrigger>
              <SelectContent>{(campuses.data ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as TimetableStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.academicPeriodRef || !form.campusId || !form.name}>
            <Plus className="h-4 w-4" /> {timetable ? "Save changes" : "Create timetable"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
