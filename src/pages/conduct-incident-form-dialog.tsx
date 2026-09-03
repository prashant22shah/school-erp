import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveConductIncident, useSaveConductAction } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ConductIncident, ConductAction } from "@/lib/types";

const CATEGORIES = ["minor", "major", "serious", "critical"] as const;
const INCIDENT_STATUSES = ["reported", "investigating", "resolved", "escalated"] as const;
const ACTION_TYPES = ["warning", "suspension", "detention", "community_service", "parent_meeting", "expulsion"] as const;
const ACTION_STATUSES = ["issued", "serving", "completed", "appealed"] as const;

export function ConductIncidentFormDialog({ open, onOpenChange, conductIncident, conductAction }: { open: boolean; onOpenChange: (o: boolean) => void; conductIncident?: ConductIncident; conductAction?: ConductAction }) {
  const saveIncident = useSaveConductIncident();
  const saveAction = useSaveConductAction();
  const isAction = !!conductAction;
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (open) {
      if (conductAction) {
        setForm(conductAction);
      } else if (conductIncident) {
        setForm(conductIncident);
      } else {
        setForm({
          studentName: "", studentRef: "", incidentDate: new Date().toISOString().slice(0, 10),
          category: "minor", description: "", reportedBy: "", location: "",
          status: "reported",
        });
      }
    }
  }, [open, conductIncident, conductAction]);

  const set = (patch: Record<string, any>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName && !isAction) return;
    if (isAction && !form.incidentRef) return;
    const now = new Date().toISOString();
    if (isAction) {
      saveAction.mutate(
        {
          id: conductAction?.id ?? uid(),
          createdOn: conductAction?.createdOn ?? now,
          incidentRef: form.incidentRef!,
          actionType: (form as any).actionType || "warning",
          description: form.description || "",
          startDate: (form as any).startDate || now.slice(0, 10),
          endDate: (form as any).endDate || "",
          approvedBy: (form as any).approvedBy || "",
          status: (form as any).status || "issued",
        } as ConductAction,
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      saveIncident.mutate(
        {
          id: conductIncident?.id ?? uid(),
          createdOn: conductIncident?.createdOn ?? now,
          studentName: form.studentName!,
          studentRef: form.studentRef || "",
          incidentDate: (form as any).incidentDate || now.slice(0, 10),
          category: (form as any).category || "minor",
          description: form.description || "",
          reportedBy: (form as any).reportedBy || "",
          location: (form as any).location || "",
          status: (form as any).status || "reported",
        } as ConductIncident,
        { onSuccess: () => onOpenChange(false) }
      );
    }
  };

  const savePending = isAction ? saveAction.isPending : saveIncident.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isAction ? (conductAction ? "Edit disciplinary action" : "Create disciplinary action") : (conductIncident ? `Edit incident — ${conductIncident.studentName}` : "Create incident")}</DialogTitle>
          <DialogDescription>{isAction ? "Record a disciplinary action against an incident (M19.05)." : "Report a student conduct incident (M19.05)."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {isAction ? (
            <>
              <div className="space-y-1.5">
                <Label>Incident Ref</Label>
                <Input placeholder="e.g. INC-001" value={(form as any).incidentRef ?? ""} onChange={(e) => set({ incidentRef: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Action Type</Label>
                <Select value={(form as any).actionType} onValueChange={(v) => set({ actionType: v } as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ACTION_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe the action…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={(form as any).startDate ?? ""} onChange={(e) => set({ startDate: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={(form as any).endDate ?? ""} onChange={(e) => set({ endDate: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Approved By</Label>
                <Input placeholder="Approver name" value={(form as any).approvedBy ?? ""} onChange={(e) => set({ approvedBy: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={(form as any).status} onValueChange={(v) => set({ status: v } as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ACTION_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label>Student Name</Label>
                <Input placeholder="Full name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Student Ref</Label>
                <Input placeholder="e.g. STU-001" value={form.studentRef ?? ""} onChange={(e) => set({ studentRef: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Incident Date</Label>
                <Input type="date" value={(form as any).incidentDate ?? ""} onChange={(e) => set({ incidentDate: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={(form as any).category} onValueChange={(v) => set({ category: v } as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Reported By</Label>
                <Input placeholder="Staff / Teacher name" value={(form as any).reportedBy ?? ""} onChange={(e) => set({ reportedBy: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input placeholder="Where did it occur?" value={(form as any).location ?? ""} onChange={(e) => set({ location: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe the incident…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={(form as any).status} onValueChange={(v) => set({ status: v } as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{INCIDENT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={savePending || (!isAction && !form.studentName)}>
            <Plus className="h-4 w-4" /> {isAction ? (conductAction ? "Save changes" : "Create action") : (conductIncident ? "Save changes" : "Create incident")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
