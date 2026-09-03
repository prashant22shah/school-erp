import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveTimeAdjustment, useTimeEntries } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { TimeAdjustment, CorrectionStatus } from "@/lib/types";

const STATUSES: CorrectionStatus[] = ["draft", "pending", "approved", "rejected"];

export function TimeAdjustmentFormDialog({ open, onOpenChange, adjustment }: { open: boolean; onOpenChange: (o: boolean) => void; adjustment?: TimeAdjustment }) {
  const save = useSaveTimeAdjustment();
  const entries = useTimeEntries();
  const [form, setForm] = useState<Partial<TimeAdjustment>>({});

  useEffect(() => {
    if (open) setForm(adjustment ?? { timeEntryId: "", reason: "", approval: "", status: "draft" });
  }, [open, adjustment]);

  const set = (patch: Partial<TimeAdjustment>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.timeEntryId || !form.reason) return;
    const now = new Date().toISOString();
    const staffName = entries.data?.find((e) => e.id === form.timeEntryId)?.staffName ?? "";
    save.mutate(
      {
        ...(adjustment ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        staffName,
        updatedOn: now,
      } as TimeAdjustment,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{adjustment ? `Edit adjustment — ${adjustment.timeEntryId}` : "Create time adjustment"}</DialogTitle>
          <DialogDescription>Approved time correction with approval trail (M07.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Time Entry</Label>
            <Select value={form.timeEntryId} onValueChange={(v) => set({ timeEntryId: v })}>
              <SelectTrigger><SelectValue placeholder="Select entry" /></SelectTrigger>
              <SelectContent>{(entries.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.staffName} — {e.occurredAt}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Input placeholder="Reason for adjustment" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Approval</Label>
            <Input placeholder="Approved by" value={form.approval ?? ""} onChange={(e) => set({ approval: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CorrectionStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.timeEntryId || !form.reason}>
            <Plus className="h-4 w-4" /> {adjustment ? "Save changes" : "Create adjustment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
