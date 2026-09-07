import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveHostelApplication } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { HostelApplication } from "@/lib/types";

const STATUSES: HostelApplication["status"][] = ["pending", "approved", "rejected", "waitlisted", "cancelled"];

export function HostelApplicationFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: HostelApplication }) {
  const save = useSaveHostelApplication();
  const [form, setForm] = useState<Partial<HostelApplication>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { applicationNo: "", studentRef: "", studentName: "", blockPreference: "", roomTypePreference: "", session: "", appliedOn: todayISO(), guardianConsent: false, status: "pending", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<HostelApplication>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.applicationNo || !form.studentName || !form.session) return;
    save.mutate(
      { ...(editing ?? { id: uid() }), ...form } as HostelApplication,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit application — ${editing.applicationNo}` : "Create hostel application"}</DialogTitle>
          <DialogDescription>Record a student hostel application with block and room preferences (M18.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Application No</Label>
            <Input placeholder="e.g. HA-2082-001" value={form.applicationNo ?? ""} onChange={(e) => set({ applicationNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student ref</Label>
            <Input placeholder="Student ID" value={form.studentRef ?? ""} onChange={(e) => set({ studentRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student name</Label>
            <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Block preference</Label>
            <Input placeholder="e.g. Block A — Boys" value={form.blockPreference ?? ""} onChange={(e) => set({ blockPreference: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Room type preference</Label>
            <Input placeholder="e.g. 4-Bed Standard" value={form.roomTypePreference ?? ""} onChange={(e) => set({ roomTypePreference: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Session</Label>
            <Input placeholder="e.g. 2082" value={form.session ?? ""} onChange={(e) => set({ session: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Applied on</Label>
            <Input type="date" value={form.appliedOn ?? ""} onChange={(e) => set({ appliedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Guardian consent</Label>
            <Select value={form.guardianConsent ? "yes" : "no"} onValueChange={(v) => set({ guardianConsent: v === "yes" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as HostelApplication["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.applicationNo || !form.studentName || !form.session}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
