import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveResidenceIncident, useResidenceBlocks } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { ResidenceIncident, IncidentType } from "@/lib/types";

const INCIDENT_TYPES: IncidentType[] = ["discipline", "health", "safety", "damage", "theft", "other"];
const SEVERITIES: ResidenceIncident["severity"][] = ["minor", "moderate", "major"];
const STATUSES: ResidenceIncident["status"][] = ["reported", "investigating", "resolved", "closed"];

export function ResidenceIncidentFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: ResidenceIncident }) {
  const save = useSaveResidenceIncident();
  const blocks = useResidenceBlocks();
  const [form, setForm] = useState<Partial<ResidenceIncident>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { blockRef: "", reportedBy: "", incidentDate: todayISO(), type: "discipline", description: "", actionTaken: "", severity: "minor", status: "reported", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<ResidenceIncident>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.blockRef || !form.reportedBy || !form.description) return;
    save.mutate(
      { ...(editing ?? { id: uid() }), ...form } as ResidenceIncident,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit incident — ${editing.type}` : "Create residence incident"}</DialogTitle>
          <DialogDescription>Report an incident in a residence block (M18.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Block</Label>
            <Select value={form.blockRef} onValueChange={(v) => set({ blockRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select block" /></SelectTrigger>
              <SelectContent>{(blocks.data ?? []).map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Reported by</Label>
            <Input placeholder="Staff name" value={form.reportedBy ?? ""} onChange={(e) => set({ reportedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Incident date</Label>
            <Input type="date" value={form.incidentDate ?? ""} onChange={(e) => set({ incidentDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as IncidentType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{INCIDENT_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Severity</Label>
            <Select value={form.severity} onValueChange={(v) => set({ severity: v as ResidenceIncident["severity"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SEVERITIES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ResidenceIncident["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the incident…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Action taken</Label>
            <Textarea placeholder="Actions taken…" value={form.actionTaken ?? ""} onChange={(e) => set({ actionTaken: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.blockRef || !form.reportedBy || !form.description}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create incident"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
