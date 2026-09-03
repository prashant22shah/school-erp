import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveGuidanceProfile, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { GuidanceProfile } from "@/lib/types";

const STATUSES: GuidanceProfile["status"][] = ["active", "inactive"];

export function GuidanceProfileFormDialog({ open, onOpenChange, profile }: { open: boolean; onOpenChange: (o: boolean) => void; profile?: GuidanceProfile }) {
  const save = useSaveGuidanceProfile();
  const students = useStudents();
  const [form, setForm] = useState<Partial<GuidanceProfile>>({});

  useEffect(() => {
    if (open) setForm(profile ?? { studentRef: "", studentName: "", interests: "", careerGoals: "", aptitudeNotes: "", consentGiven: false, status: "active" });
  }, [open, profile]);

  const set = (patch: Partial<GuidanceProfile>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentRef) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(profile ?? { id: uid(), createdOn: now }),
        ...form,
        studentName,
      } as GuidanceProfile,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{profile ? `Edit profile — ${profile.studentName}` : "Create guidance profile"}</DialogTitle>
          <DialogDescription>Set up a student's career guidance profile (M21.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentRef} onValueChange={(v) => {
              const name = students.data?.find((s) => s.id === v)?.personName ?? "";
              set({ studentRef: v, studentName: name });
            }}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{(students.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.personName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as GuidanceProfile["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Interests</Label>
            <Input placeholder="e.g. Science, Technology, Medicine" value={form.interests ?? ""} onChange={(e) => set({ interests: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Career Goals</Label>
            <Input placeholder="e.g. Become a doctor" value={form.careerGoals ?? ""} onChange={(e) => set({ careerGoals: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Aptitude Notes</Label>
            <Input placeholder="e.g. Strong in mathematics, analytical thinking" value={form.aptitudeNotes ?? ""} onChange={(e) => set({ aptitudeNotes: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Consent Given</Label>
            <Select value={form.consentGiven ? "yes" : "no"} onValueChange={(v) => set({ consentGiven: v === "yes" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef}>
            <Plus className="h-4 w-4" /> {profile ? "Save changes" : "Create profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
