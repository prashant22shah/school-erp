import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveSeparation, useStaffProfiles } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Separation, SeparationType, SeparationStatus } from "@/lib/types";

const TYPES: SeparationType[] = ["resignation", "retirement", "termination", "transfer"];
const STATUSES: SeparationStatus[] = ["pending", "approved", "completed", "cancelled"];

export function SeparationFormDialog({ open, onOpenChange, separation }: { open: boolean; onOpenChange: (o: boolean) => void; separation?: Separation }) {
  const save = useSaveSeparation();
  const staffProfiles = useStaffProfiles();
  const [form, setForm] = useState<Partial<Separation>>({});

  useEffect(() => {
    if (open) {
      setForm(
        separation ?? {
          staffRef: "",
          staffName: "",
          type: "resignation",
          lastWorkingDate: new Date().toISOString().slice(0, 10),
          status: "pending",
          reason: "",
        }
      );
    }
  }, [open, separation]);

  const set = (patch: Partial<Separation>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.staffRef || !form.type || !form.lastWorkingDate || !form.status || !form.reason) return;
    const now = new Date().toISOString();
    const staffName = staffProfiles.data?.find((s) => s.id === form.staffRef)?.name ?? form.staffName ?? form.staffRef!;
    save.mutate(
      {
        id: separation?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: separation?.createdOn ?? now,
        updatedOn: now,
        staffRef: form.staffRef!,
        staffName,
        type: form.type!,
        lastWorkingDate: form.lastWorkingDate!,
        status: form.status!,
        reason: form.reason!,
      } as Separation,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{separation ? `Edit separation — ${separation.staffName}` : "Create separation"}</DialogTitle>
          <DialogDescription>Process staff separations, transfers and exits (M13.10).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Staff</Label>
            <Select value={form.staffRef} onValueChange={(v) => {
              const name = staffProfiles.data?.find((s) => s.id === v)?.name ?? "";
              set({ staffRef: v, staffName: name });
            }}>
              <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
              <SelectContent>{(staffProfiles.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name} ({s.staffCode})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Staff Name</Label>
            <Input placeholder="Staff display name" value={form.staffName ?? ""} onChange={(e) => set({ staffName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as SeparationType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as SeparationStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Last Working Date</Label>
            <Input type="date" value={form.lastWorkingDate ? form.lastWorkingDate.slice(0, 10) : ""} onChange={(e) => set({ lastWorkingDate: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Textarea placeholder="Reason for separation" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.staffRef || !form.type || !form.lastWorkingDate || !form.status || !form.reason}>
            <Plus className="h-4 w-4" /> {separation ? "Save changes" : "Create separation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
