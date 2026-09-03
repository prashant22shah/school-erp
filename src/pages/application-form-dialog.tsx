import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveApplication, useAcademicYears, useGradeClasses, useStreams } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { Application, ApplicationStatus, Gender } from "@/lib/types";

const GENDERS: Gender[] = ["male", "female", "other"];
const STATUSES: ApplicationStatus[] = ["draft", "submitted", "under_review", "eligible", "not_eligible", "admitted", "rejected", "withdrawn"];

export function ApplicationFormDialog({ open, onOpenChange, application }: { open: boolean; onOpenChange: (o: boolean) => void; application?: Application }) {
  const save = useSaveApplication();
  const years = useAcademicYears();
  const grades = useGradeClasses();
  const streams = useStreams();
  const [form, setForm] = useState<Partial<Application>>({});

  useEffect(() => {
    if (open) {
      setForm(application ?? {
        applicationNo: "", studentName: "", studentNameNe: "", dateOfBirth: "", dateOfBirthBs: "",
        gender: "male", guardianName: "", guardianPhone: "", guardianEmail: "", address: "",
        academicYearId: "", academicYearName: "", appliedGradeId: "", appliedGradeName: "",
        appliedStreamId: "", appliedStreamName: "", previousSchool: "", previousGrade: "",
        status: "draft", createdOn: todayISO(),
      });
    }
  }, [open, application]);

  const set = (patch: Partial<Application>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName || !form.guardianName || !form.guardianPhone || !form.academicYearId || !form.appliedGradeId) return;
    const yearName = (years.data ?? []).find((y) => y.id === form.academicYearId)?.name ?? form.academicYearName ?? "";
    const gradeName = (grades.data ?? []).find((g) => g.id === form.appliedGradeId)?.name ?? form.appliedGradeName ?? "";
    const streamName = form.appliedStreamId ? (streams.data ?? []).find((s) => s.id === form.appliedStreamId)?.name ?? "" : "";
    save.mutate(
      { ...(application ?? { id: uid(), applicationNo: `APP-${Date.now().toString(36).toUpperCase()}` }), ...form, academicYearName: yearName, appliedGradeName: gradeName, appliedStreamName: streamName, tenantId: "tenant-default" } as Application,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{application ? `Edit application — ${application.studentName}` : "Create application"}</DialogTitle>
          <DialogDescription>Submit a new student admission application (M04.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student name</Label>
            <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.studentNameNe ?? ""} onChange={(e) => set({ studentNameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Date of birth</Label>
            <Input type="date" value={form.dateOfBirth ?? ""} onChange={(e) => set({ dateOfBirth: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>DOB (BS)</Label>
            <Input placeholder="e.g. 2068-05-15" value={form.dateOfBirthBs ?? ""} onChange={(e) => set({ dateOfBirthBs: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => set({ gender: v as Gender })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{GENDERS.map((g) => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Guardian name</Label>
            <Input placeholder="Guardian name" value={form.guardianName ?? ""} onChange={(e) => set({ guardianName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Guardian phone</Label>
            <Input placeholder="Phone number" value={form.guardianPhone ?? ""} onChange={(e) => set({ guardianPhone: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Guardian email</Label>
            <Input type="email" placeholder="Email (optional)" value={form.guardianEmail ?? ""} onChange={(e) => set({ guardianEmail: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Academic year</Label>
            <Select value={form.academicYearId} onValueChange={(v) => set({ academicYearId: v })}>
              <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>{(years.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Applied grade</Label>
            <Select value={form.appliedGradeId} onValueChange={(v) => set({ appliedGradeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
              <SelectContent>{(grades.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Stream (optional)</Label>
            <Select value={form.appliedStreamId ?? ""} onValueChange={(v) => set({ appliedStreamId: v || undefined })}>
              <SelectTrigger><SelectValue placeholder="Select stream" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {(streams.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ApplicationStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Previous school</Label>
            <Input placeholder="Previous school" value={form.previousSchool ?? ""} onChange={(e) => set({ previousSchool: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Previous grade</Label>
            <Input placeholder="Previous grade" value={form.previousGrade ?? ""} onChange={(e) => set({ previousGrade: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Address</Label>
            <Input placeholder="Address" value={form.address ?? ""} onChange={(e) => set({ address: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentName || !form.guardianName || !form.guardianPhone || !form.academicYearId || !form.appliedGradeId}>
            <Plus className="h-4 w-4" /> {application ? "Save changes" : "Create application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
