import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveInvigilationDuty, useExams, useExamRooms } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { InvigilationDuty, InvigilationRole } from "@/lib/types";

const ROLES: InvigilationRole[] = ["chief", "assistant", "reliever"];

export function InvigilationDutyFormDialog({ open, onOpenChange, duty }: { open: boolean; onOpenChange: (o: boolean) => void; duty?: InvigilationDuty }) {
  const save = useSaveInvigilationDuty();
  const exams = useExams();
  const rooms = useExamRooms();
  const [form, setForm] = useState<Partial<InvigilationDuty>>({});

  useEffect(() => {
    if (open) setForm(duty ?? { examId: "", roomId: "", staffRef: "", staffName: "", role: "assistant" });
  }, [open, duty]);

  const set = (patch: Partial<InvigilationDuty>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.examId || !form.roomId || !form.staffRef || !form.staffName) return;
    const now = new Date().toISOString();
    const roomName = rooms.data?.find((r) => r.id === form.roomId)?.locationName ?? "";
    save.mutate(
      {
        ...(duty ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        roomName,
        updatedOn: now,
      } as InvigilationDuty,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{duty ? `Edit invigilation — ${duty.staffName}` : "Assign invigilation duty"}</DialogTitle>
          <DialogDescription>Assign staff invigilation duties per room (M08.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Exam</Label>
            <Select value={form.examId} onValueChange={(v) => set({ examId: v })}>
              <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
              <SelectContent>{(exams.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.code} — {e.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Room</Label>
            <Select value={form.roomId} onValueChange={(v) => set({ roomId: v })}>
              <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
              <SelectContent>{(rooms.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.locationName ?? r.locationRef}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Staff Ref</Label>
            <Select value={form.staffRef} onValueChange={(v) => {
              const names: Record<string,string> = { "uid-5": "Manoj Rai", "uid-2": "Ramesh Shrestha", "uid-4": "Suresh Thapa", "uid-3": "Laxmi Poudel" };
              set({ staffRef: v, staffName: names[v] ?? v });
            }}>
              <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="uid-5">Manoj Rai</SelectItem>
                <SelectItem value="uid-2">Ramesh Shrestha</SelectItem>
                <SelectItem value="uid-4">Suresh Thapa</SelectItem>
                <SelectItem value="uid-3">Laxmi Poudel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Staff Name</Label>
            <Input placeholder="Staff display name" value={form.staffName ?? ""} onChange={(e) => set({ staffName: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => set({ role: v as InvigilationRole })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.examId || !form.roomId || !form.staffRef || !form.staffName}>
            <Plus className="h-4 w-4" /> {duty ? "Save changes" : "Assign duty"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
