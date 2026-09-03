import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveRecruitment, usePositions } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Recruitment, RecruitmentStage } from "@/lib/types";

const STAGES: RecruitmentStage[] = ["applied", "shortlisted", "interviewed", "offered", "hired", "rejected"];

export function RecruitmentFormDialog({ open, onOpenChange, recruitment }: { open: boolean; onOpenChange: (o: boolean) => void; recruitment?: Recruitment }) {
  const save = useSaveRecruitment();
  const positions = usePositions();
  const [form, setForm] = useState<Partial<Recruitment>>({});

  useEffect(() => {
    if (open) {
      setForm(
        recruitment ?? {
          positionId: "",
          applicantName: "",
          stage: "applied",
          appliedOn: new Date().toISOString().slice(0, 10),
        }
      );
    }
  }, [open, recruitment]);

  const set = (patch: Partial<Recruitment>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.positionId || !form.applicantName || !form.stage || !form.appliedOn) return;
    const now = new Date().toISOString();
    const positionTitle = positions.data?.find((p) => p.id === form.positionId)?.title ?? recruitment?.positionTitle ?? "";
    save.mutate(
      {
        id: recruitment?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: recruitment?.createdOn ?? now,
        updatedOn: now,
        positionId: form.positionId!,
        positionTitle,
        applicantName: form.applicantName!,
        stage: form.stage!,
        appliedOn: form.appliedOn!,
      } as Recruitment,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{recruitment ? `Edit recruitment — ${recruitment.applicantName}` : "Create recruitment"}</DialogTitle>
          <DialogDescription>Track applicant pipeline per position (M13.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Position</Label>
            <Select value={form.positionId} onValueChange={(v) => set({ positionId: v })}>
              <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
              <SelectContent>{(positions.data ?? []).map((p) => <SelectItem key={p.id} value={p.id}>{p.title} — {p.department}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Applicant Name</Label>
            <Input placeholder="Applicant full name" value={form.applicantName ?? ""} onChange={(e) => set({ applicantName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Stage</Label>
            <Select value={form.stage} onValueChange={(v) => set({ stage: v as RecruitmentStage })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Applied On</Label>
            <Input type="date" value={form.appliedOn ? form.appliedOn.slice(0, 10) : ""} onChange={(e) => set({ appliedOn: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.positionId || !form.applicantName || !form.stage || !form.appliedOn}>
            <Plus className="h-4 w-4" /> {recruitment ? "Save changes" : "Create recruitment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
