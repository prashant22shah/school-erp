import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveAdvisingAssignment, useSaveInterventionPlan } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { AdvisingAssignment, InterventionPlan } from "@/lib/types";

const ADVISING_STATUSES = ["active", "completed", "transferred"] as const;
const PLAN_STATUSES = ["draft", "active", "completed", "discontinued"] as const;

export function AdvisingAssignmentFormDialog({ open, onOpenChange, advisingAssignment, interventionPlan }: { open: boolean; onOpenChange: (o: boolean) => void; advisingAssignment?: AdvisingAssignment; interventionPlan?: InterventionPlan }) {
  const saveAssignment = useSaveAdvisingAssignment();
  const savePlan = useSaveInterventionPlan();
  const isPlan = !!interventionPlan;
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (open) {
      if (interventionPlan) {
        setForm(interventionPlan);
      } else if (advisingAssignment) {
        setForm(advisingAssignment);
      } else {
        setForm({
          studentName: "", studentRef: "", advisorName: "", advisorRef: "",
          validFrom: new Date().toISOString().slice(0, 10), validTo: "",
          status: "active",
        });
      }
    }
  }, [open, advisingAssignment, interventionPlan]);

  const set = (patch: Record<string, any>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName) return;
    const now = new Date().toISOString();
    if (isPlan) {
      savePlan.mutate(
        {
          id: interventionPlan?.id ?? uid(),
          createdOn: interventionPlan?.createdOn ?? now,
          studentName: form.studentName!,
          studentRef: form.studentRef || "",
          reason: (form as any).reason || "",
          ownerName: (form as any).ownerName || "",
          targetDate: (form as any).targetDate || "",
          status: (form as any).status || "draft",
        } as InterventionPlan,
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      saveAssignment.mutate(
        {
          id: advisingAssignment?.id ?? uid(),
          createdOn: advisingAssignment?.createdOn ?? now,
          studentName: form.studentName!,
          studentRef: form.studentRef || "",
          advisorName: form.advisorName || "",
          advisorRef: form.advisorRef || "",
          validFrom: form.validFrom || now.slice(0, 10),
          validTo: form.validTo || "",
          status: form.status || "active",
        } as AdvisingAssignment,
        { onSuccess: () => onOpenChange(false) }
      );
    }
  };

  const savePending = isPlan ? savePlan.isPending : saveAssignment.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isPlan ? (interventionPlan ? `Edit intervention plan — ${interventionPlan.studentName}` : "Create intervention plan") : (advisingAssignment ? `Edit advising assignment — ${advisingAssignment.studentName}` : "Create advising assignment")}</DialogTitle>
          <DialogDescription>{isPlan ? "Define an intervention plan for a student (M19.07)." : "Assign an advisor to a student (M19.07)."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student Name</Label>
            <Input placeholder="Full name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student Ref</Label>
            <Input placeholder="e.g. STU-001" value={form.studentRef ?? ""} onChange={(e) => set({ studentRef: e.target.value })} />
          </div>
          {isPlan ? (
            <>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Reason</Label>
                <Textarea placeholder="Reason for intervention…" value={(form as any).reason ?? ""} onChange={(e) => set({ reason: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Owner Name</Label>
                <Input placeholder="Intervention owner" value={(form as any).ownerName ?? ""} onChange={(e) => set({ ownerName: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Target Date</Label>
                <Input type="date" value={(form as any).targetDate ?? ""} onChange={(e) => set({ targetDate: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={(form as any).status} onValueChange={(v) => set({ status: v } as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PLAN_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label>Advisor Name</Label>
                <Input placeholder="Advisor full name" value={form.advisorName ?? ""} onChange={(e) => set({ advisorName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Advisor Ref</Label>
                <Input placeholder="e.g. STF-001" value={form.advisorRef ?? ""} onChange={(e) => set({ advisorRef: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Valid From</Label>
                <Input type="date" value={form.validFrom ?? ""} onChange={(e) => set({ validFrom: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Valid To</Label>
                <Input type="date" value={form.validTo ?? ""} onChange={(e) => set({ validTo: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ADVISING_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={savePending || !form.studentName}>
            <Plus className="h-4 w-4" /> {isPlan ? (interventionPlan ? "Save changes" : "Create plan") : (advisingAssignment ? "Save changes" : "Create assignment")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
