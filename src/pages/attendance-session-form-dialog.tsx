import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveAttendanceSession, useSections } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { AttendanceSession, AttendanceSessionStatus } from "@/lib/types";

const STATUSES: AttendanceSessionStatus[] = ["scheduled", "open", "finalized", "cancelled"];

export function AttendanceSessionFormDialog({ open, onOpenChange, session }: { open: boolean; onOpenChange: (o: boolean) => void; session?: AttendanceSession }) {
  const save = useSaveAttendanceSession();
  const sections = useSections();
  const [form, setForm] = useState<Partial<AttendanceSession>>({});

  useEffect(() => {
    if (open) setForm(session ?? { sectionId: "", sectionName: "", sessionDate: "", localDate: "", status: "scheduled", scheduledStartAt: "", scheduledEndAt: "", periodNo: 1 });
  }, [open, session]);

  const set = (patch: Partial<AttendanceSession>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.sectionId || !form.sessionDate || !form.localDate || !form.scheduledStartAt || !form.scheduledEndAt) return;
    const now = new Date().toISOString();
    const sectionName = sections.data?.find((s) => s.id === form.sectionId)?.name ?? "";
    save.mutate(
      {
        ...(session ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        sectionName: sectionName || form.sectionName || "",
        updatedOn: now,
      } as AttendanceSession,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{session ? `Edit session — ${session.sessionDate}` : "Create attendance session"}</DialogTitle>
          <DialogDescription>Attendance-taking unit linked to section and period (M07.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Section</Label>
            <Select value={form.sectionId} onValueChange={(v) => set({ sectionId: v })}>
              <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
              <SelectContent>{(sections.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.gradeClassName} {s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as AttendanceSessionStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Session Date</Label>
            <Input type="date" value={form.sessionDate ?? ""} onChange={(e) => set({ sessionDate: e.target.value, localDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Period No</Label>
            <Input type="number" min={1} value={form.periodNo ?? 1} onChange={(e) => set({ periodNo: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Scheduled Start</Label>
            <Input type="datetime-local" value={form.scheduledStartAt ?? ""} onChange={(e) => set({ scheduledStartAt: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Scheduled End</Label>
            <Input type="datetime-local" value={form.scheduledEndAt ?? ""} onChange={(e) => set({ scheduledEndAt: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Local Date</Label>
            <Input type="date" value={form.localDate ?? ""} onChange={(e) => set({ localDate: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.sectionId || !form.sessionDate || !form.localDate || !form.scheduledStartAt || !form.scheduledEndAt}>
            <Plus className="h-4 w-4" /> {session ? "Save changes" : "Create session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
