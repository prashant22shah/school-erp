import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveConversionCase } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { ConversionCase, ConversionState } from "@/lib/types";

const STATES: ConversionState[] = ["pending", "in_progress", "completed", "failed", "cancelled"];

export function ConversionCaseFormDialog({ open, onOpenChange, conversionCase }: { open: boolean; onOpenChange: (o: boolean) => void; conversionCase?: ConversionCase }) {
  const save = useSaveConversionCase();
  const [form, setForm] = useState<Partial<ConversionCase>>({});

  useEffect(() => {
    if (open) {
      setForm(conversionCase ?? { acceptanceId: "", acceptanceName: "", applicationId: "", studentName: "", state: "pending", admissionNo: "", startedOn: todayISO(), createdOn: todayISO() });
    }
  }, [open, conversionCase]);

  const set = (patch: Partial<ConversionCase>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.acceptanceId || !form.studentName) return;
    save.mutate(
      { ...(conversionCase ?? { id: uid() }), ...form, tenantId: "tenant-default" } as ConversionCase,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{conversionCase ? `Edit conversion — ${conversionCase.studentName}` : "Create conversion case"}</DialogTitle>
          <DialogDescription>Convert an accepted offer into a student enrolment (M04.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Acceptance ID</Label>
            <Input placeholder="Offer acceptance ID" value={form.acceptanceId ?? ""} onChange={(e) => set({ acceptanceId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Acceptance name</Label>
            <Input placeholder="Acceptance reference" value={form.acceptanceName ?? ""} onChange={(e) => set({ acceptanceName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Application ID</Label>
            <Input placeholder="Application ID" value={form.applicationId ?? ""} onChange={(e) => set({ applicationId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student name</Label>
            <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>State</Label>
            <Select value={form.state} onValueChange={(v) => set({ state: v as ConversionState })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Admission no.</Label>
            <Input placeholder="Admission number (optional)" value={form.admissionNo ?? ""} onChange={(e) => set({ admissionNo: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.acceptanceId || !form.studentName}>
            <Plus className="h-4 w-4" /> {conversionCase ? "Save changes" : "Create case"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
