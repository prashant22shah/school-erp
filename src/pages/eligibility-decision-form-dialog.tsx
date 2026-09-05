import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveEligibilityDecision, useApplications } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { EligibilityDecision, EligibilityOutcome } from "@/lib/types";

const OUTCOMES: EligibilityOutcome[] = ["pending", "eligible", "not_eligible", "conditional", "manual_review"];

export function EligibilityDecisionFormDialog({ open, onOpenChange, decision }: { open: boolean; onOpenChange: (v: boolean) => void; decision?: EligibilityDecision }) {
  const save = useSaveEligibilityDecision();
  const applications = useApplications();
  const [form, setForm] = useState<Partial<EligibilityDecision>>({});

  useEffect(() => {
    if (open) {
      setForm(decision ?? { applicationId: "", applicationName: "", ruleName: "", outcome: "pending" as EligibilityOutcome, reason: "", decidedBy: "", decidedOn: todayISO(), remarks: "" });
    }
  }, [open, decision]);

  const set = (patch: Partial<EligibilityDecision>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.applicationId || !form.ruleName || !form.outcome || !form.decidedBy) return;
    const appName = (applications.data ?? []).find((a) => a.id === form.applicationId)?.studentName ?? form.applicationName ?? "";
    save.mutate(
      { ...(decision ?? { id: uid() }), ...form, applicationName: appName, tenantId: "tenant-default" } as EligibilityDecision,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{decision ? `Edit eligibility decision` : "Create eligibility decision"}</DialogTitle>
          <DialogDescription>Record eligibility check outcome for an application (M04.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Application</Label>
            <Select value={form.applicationId ?? ""} onValueChange={(v) => set({ applicationId: v })}>
              <SelectTrigger><SelectValue placeholder="Select application" /></SelectTrigger>
              <SelectContent>{(applications.data ?? []).map((a) => <SelectItem key={a.id} value={a.id}>{a.studentName ?? a.id}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Rule name</Label>
            <Input placeholder="Eligibility rule" value={form.ruleName ?? ""} onChange={(e) => set({ ruleName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Outcome</Label>
            <Select value={form.outcome} onValueChange={(v) => set({ outcome: v as EligibilityOutcome })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{OUTCOMES.map((o) => <SelectItem key={o} value={o} className="capitalize">{o.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Decided by</Label>
            <Input placeholder="Staff member" value={form.decidedBy ?? ""} onChange={(e) => set({ decidedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Decided on</Label>
            <Input type="date" value={form.decidedOn ?? ""} onChange={(e) => set({ decidedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Reason</Label>
            <Input placeholder="Decision reason" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Remarks</Label>
            <Textarea placeholder="Additional remarks" value={form.remarks ?? ""} onChange={(e) => set({ remarks: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.applicationId || !form.ruleName || !form.outcome || !form.decidedBy}>
            <Plus className="h-4 w-4" /> {decision ? "Save changes" : "Create decision"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
