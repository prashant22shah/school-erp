import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveTimetableAssignment, useTimetables, useTimetableSlots, useSections, useCurriculumOfferings, useLocations } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { TimetableAssignment } from "@/lib/types";

export function TimetableAssignmentFormDialog({ open, onOpenChange, assignment }: { open: boolean; onOpenChange: (o: boolean) => void; assignment?: TimetableAssignment }) {
  const save = useSaveTimetableAssignment();
  const timetables = useTimetables();
  const slots = useTimetableSlots();
  const sections = useSections();
  const offerings = useCurriculumOfferings();
  const locations = useLocations();
  const [form, setForm] = useState<Partial<TimetableAssignment>>({});

  useEffect(() => {
    if (open) {
      setForm(
        assignment ?? {
          timetableId: "",
          slotId: "",
          sectionRef: "",
          sectionName: "",
          offeringRef: "",
          offeringName: "",
          staffRef: "",
          staffName: "",
          locationRef: "",
        }
      );
    }
  }, [open, assignment]);

  const set = (patch: Partial<TimetableAssignment>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.timetableId || !form.slotId || !form.sectionRef || !form.offeringRef || !form.staffRef) return;
    const sectionName = sections.data?.find((s) => s.id === form.sectionRef)?.name ?? "";
    const offeringName = offerings.data?.find((o) => o.id === form.offeringRef)?.subjectName ?? "";
    const slotLabel = (() => {
      const sl = slots.data?.find((s) => s.id === form.slotId);
      return sl ? `${sl.dayPattern} ${sl.startTime}-${sl.endTime}` : "";
    })();
    const locationName = locations.data?.find((l) => l.id === form.locationRef)?.name ?? "";
    const staffName = form.staffName ?? "";
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(assignment ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        sectionName: sectionName || (form.sectionName ?? ""),
        offeringName: offeringName || (form.offeringName ?? ""),
        slotLabel,
        locationName,
        staffName,
        updatedOn: now,
      } as TimetableAssignment,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{assignment ? `Edit assignment — ${assignment.sectionName}` : "Create timetable assignment"}</DialogTitle>
          <DialogDescription>Scheduled teaching event linking section, offering and staff (M07.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Timetable</Label>
            <Select value={form.timetableId} onValueChange={(v) => set({ timetableId: v })}>
              <SelectTrigger><SelectValue placeholder="Select timetable" /></SelectTrigger>
              <SelectContent>{(timetables.data ?? []).map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Slot</Label>
            <Select value={form.slotId} onValueChange={(v) => set({ slotId: v })}>
              <SelectTrigger><SelectValue placeholder="Select slot" /></SelectTrigger>
              <SelectContent>{(slots.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.dayPattern} {s.startTime}-{s.endTime}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Section</Label>
            <Select value={form.sectionRef} onValueChange={(v) => set({ sectionRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
              <SelectContent>{(sections.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.gradeClassName} {s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Offering</Label>
            <Select value={form.offeringRef} onValueChange={(v) => set({ offeringRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select offering" /></SelectTrigger>
              <SelectContent>{(offerings.data ?? []).map((o) => <SelectItem key={o.id} value={o.id}>{o.subjectName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Staff Ref</Label>
            <Select value={form.staffRef} onValueChange={(v) => {
              const names: Record<string,string> = { "uid-5": "Manoj Rai", "uid-2": "Ramesh Shrestha", "uid-3": "Laxmi Poudel" };
              set({ staffRef: v, staffName: names[v] ?? v });
            }}>
              <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="uid-5">Manoj Rai</SelectItem>
                <SelectItem value="uid-2">Ramesh Shrestha</SelectItem>
                <SelectItem value="uid-3">Laxmi Poudel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Staff Display Name</Label>
            <Input placeholder="Staff name" value={form.staffName ?? ""} onChange={(e) => set({ staffName: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Location (optional)</Label>
            <Select value={form.locationRef ?? ""} onValueChange={(v) => set({ locationRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
              <SelectContent>{(locations.data ?? []).map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.timetableId || !form.slotId || !form.sectionRef || !form.offeringRef || !form.staffRef}>
            <Plus className="h-4 w-4" /> {assignment ? "Save changes" : "Create assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


