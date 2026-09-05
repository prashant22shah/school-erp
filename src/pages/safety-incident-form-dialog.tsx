import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveSafetyIncident } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { SafetyIncident } from "@/lib/types";

const TYPES = ["injury", "illness", "fire", "flood", "structural", "chemical", "electrical", "security", "environmental", "other"] as const;
const SEVERITIES = ["minor", "moderate", "major", "critical"] as const;

export function SafetyIncidentFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: SafetyIncident }) {
  const save = useSaveSafetyIncident();
  const [form, setForm] = useState<Partial<SafetyIncident>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          incidentNo: "", title: "", description: "",
          category: "other", severity: "moderate", location: "",
          reportedBy: "", occurredOn: "",
          witnesses: "", injuredPersons: "",
          immediateActions: "", rootCause: "",
          status: "reported",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<SafetyIncident>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.location || !form.category || !form.severity || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: editing?.id ?? uid(),
        createdOn: editing?.createdOn ?? now,
        incidentNo: editing?.incidentNo || `SI-${Date.now()}`,
        title: form.title || "",
        description: form.description || "",
        category: form.category!,
        severity: form.severity!,
        location: form.location!,
        reportedBy: form.reportedBy || "",
        reportedByName: form.reportedByName || form.reportedBy || "",
        reportedOn: editing?.reportedOn || now,
        occurredOn: form.occurredOn || now,
        witnesses: form.witnesses || "",
        injuredPersons: form.injuredPersons || "",
        immediateActions: form.immediateActions || "",
        rootCause: form.rootCause || "",
        status: form.status!,
      } as SafetyIncident,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Safety Incident" : "Report Safety Incident"}</DialogTitle>
          <DialogDescription>Record a campus safety incident (M22.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input placeholder="Where it occurred" value={form.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.category} onValueChange={(v) => set({ category: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Severity</Label>
            <Select value={form.severity} onValueChange={(v) => set({ severity: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SEVERITIES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Occurred At</Label>
            <Input type="datetime-local" value={form.occurredOn ?? ""} onChange={(e) => set({ occurredOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Reported By</Label>
            <Input placeholder="Staff name" value={form.reportedBy ?? ""} onChange={(e) => set({ reportedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the incident…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.location || !form.category || !form.severity || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Incident"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
