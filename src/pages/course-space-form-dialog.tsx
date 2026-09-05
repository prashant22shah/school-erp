import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCourseSpace } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { CourseSpace, CourseSpaceStatus } from "@/lib/types";

const STATUSES: CourseSpaceStatus[] = ["draft", "active", "archived"];

export function CourseSpaceFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: CourseSpace }) {
  const save = useSaveCourseSpace();
  const [form, setForm] = useState<Partial<CourseSpace>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          code: "", name: "", subjectRef: "", subjectName: "",
          teacherRef: "", teacherName: "", gradeRef: "", gradeName: "",
          term: "", maxEnrollment: 40, enrolledCount: 0, status: "draft",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<CourseSpace>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        maxEnrollment: Number(form.maxEnrollment),
        enrolledCount: Number(form.enrolledCount),
        updatedOn: now,
      } as CourseSpace,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit course — ${editing.name}` : "Create course space"}</DialogTitle>
          <DialogDescription>Define a course space with subject, teacher and enrollment cap (M10.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. CS-MATH-10" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CourseSpaceStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="e.g. Mathematics Grade 10" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Subject Name</Label>
            <Input placeholder="e.g. Mathematics" value={form.subjectName ?? ""} onChange={(e) => set({ subjectName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Teacher Name</Label>
            <Input placeholder="e.g. Mr. Sharma" value={form.teacherName ?? ""} onChange={(e) => set({ teacherName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Grade Name</Label>
            <Input placeholder="e.g. Grade 10" value={form.gradeName ?? ""} onChange={(e) => set({ gradeName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Term</Label>
            <Input placeholder="e.g. 2082 T1" value={form.term ?? ""} onChange={(e) => set({ term: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Max Enrollment</Label>
            <Input type="number" min={0} value={form.maxEnrollment ?? 40} onChange={(e) => set({ maxEnrollment: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Enrolled Count</Label>
            <Input type="number" min={0} value={form.enrolledCount ?? 0} onChange={(e) => set({ enrolledCount: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create course space"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
