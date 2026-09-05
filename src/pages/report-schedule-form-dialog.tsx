import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveReportSchedule } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";

const FREQUENCY_OPTIONS = ["daily", "weekly", "monthly", "quarterly"] as const;
const FORMAT_OPTIONS = ["pdf", "excel", "csv"] as const;
const STATUS_OPTIONS = ["active", "paused", "completed", "failed"] as const;

export function ReportScheduleFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: any }) {
  const save = useSaveReportSchedule();
  const [form, setForm] = useState({ id: "", reportRef: "", reportName: "", frequency: "monthly", recipients: "", format: "pdf", lastRun: "", nextRun: "", status: "active", createdOn: "" });

  useEffect(() => {
    if (open) {
      if (editing) setForm(editing);
      else setForm({ id: uid(), reportRef: "", reportName: "", frequency: "monthly", recipients: "", format: "pdf", lastRun: "", nextRun: "", status: "active", createdOn: new Date().toISOString() });
    }
  }, [open, editing]);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Report Schedule" : "Create Report Schedule"}</DialogTitle>
          <DialogDescription>Schedule automated report generation and delivery (M24.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Report Name</Label>
            <Input placeholder="e.g. Monthly Attendance Report" value={form.reportName} onChange={(e) => set({ reportName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Report Ref</Label>
            <Input placeholder="e.g. RPT-001" value={form.reportRef} onChange={(e) => set({ reportRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Frequency</Label>
            <Select value={form.frequency} onValueChange={(v) => set({ frequency: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{FREQUENCY_OPTIONS.map((f) => <SelectItem key={f} value={f} className="capitalize">{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Format</Label>
            <Select value={form.format} onValueChange={(v) => set({ format: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{FORMAT_OPTIONS.map((f) => <SelectItem key={f} value={f} className="uppercase">{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Recipients</Label>
            <Input placeholder="e.g. admin@school.edu, principal@school.edu" value={form.recipients} onChange={(e) => set({ recipients: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Next Run</Label>
            <Input type="datetime-local" value={form.nextRun ? form.nextRun.slice(0, 16) : ""} onChange={(e) => set({ nextRun: e.target.value ? new Date(e.target.value).toISOString() : "" })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate(form as any, { onSuccess: () => onOpenChange(false) })} disabled={save.isPending || !form.reportName}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
