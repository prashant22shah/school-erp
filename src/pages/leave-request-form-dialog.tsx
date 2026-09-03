import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveLeaveRequest, useStaffProfiles } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LeaveRequest, LeaveType, LeaveStatus } from "@/lib/types";

const LEAVE_TYPES: LeaveType[] = ["sick", "casual", "annual", "maternity", "unpaid"];
const STATUSES: LeaveStatus[] = ["pending", "approved", "rejected", "cancelled"];

export function LeaveRequestFormDialog({ open, onOpenChange, leaveRequest }: { open: boolean; onOpenChange: (o: boolean) => void; leaveRequest?: LeaveRequest }) {
  const save = useSaveLeaveRequest();
  const staffProfiles = useStaffProfiles();
  const [form, setForm] = useState<Partial<LeaveRequest>>({});

  useEffect(() => {
    if (open) {
      setForm(
        leaveRequest ?? {
          staffRef: "",
          staffName: "",
          leaveType: "casual",
          fromDate: new Date().toISOString().slice(0, 10),
          toDate: new Date().toISOString().slice(0, 10),
          days: 1,
          status: "pending",
          reason: "",
        }
      );
    }
  }, [open, leaveRequest]);

  const set = (patch: Partial<LeaveRequest>) => setForm((f) => ({ ...f, ...patch }));

  // auto compute days when dates change
  useEffect(() => {
    if (form.fromDate && form.toDate) {
      const from = new Date(form.fromDate);
      const to = new Date(form.toDate);
      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        const diff = Math.ceil((to.getTime() - from.getTime()) / 86400000) + 1;
        const days = diff > 0 ? diff : 1;
        if (days !== form.days) setForm((f) => ({ ...f, days }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.fromDate, form.toDate]);

  const submit = () => {
    if (!form.staffRef || !form.leaveType || !form.fromDate || !form.toDate || form.days == null || !form.status || !form.reason) return;
    const now = new Date().toISOString();
    const staffName = staffProfiles.data?.find((s) => s.id === form.staffRef)?.name ?? form.staffName ?? form.staffRef!;
    save.mutate(
      {
        id: leaveRequest?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: leaveRequest?.createdOn ?? now,
        updatedOn: now,
        staffRef: form.staffRef!,
        staffName,
        leaveType: form.leaveType!,
        fromDate: form.fromDate!,
        toDate: form.toDate!,
        days: Number(form.days),
        status: form.status!,
        reason: form.reason!,
      } as LeaveRequest,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{leaveRequest ? `Edit leave — ${leaveRequest.staffName}` : "Create leave request"}</DialogTitle>
          <DialogDescription>Submit and review staff leave requests (M13.04).</DialogDescription>
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
            <Label>Leave Type</Label>
            <Select value={form.leaveType} onValueChange={(v) => set({ leaveType: v as LeaveType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LEAVE_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as LeaveStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>From Date</Label>
            <Input type="date" value={form.fromDate ? form.fromDate.slice(0, 10) : ""} onChange={(e) => set({ fromDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>To Date</Label>
            <Input type="date" value={form.toDate ? form.toDate.slice(0, 10) : ""} onChange={(e) => set({ toDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Days</Label>
            <Input type="number" min={1} value={form.days ?? 1} onChange={(e) => set({ days: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Textarea placeholder="Reason for leave" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.staffRef || !form.leaveType || !form.fromDate || !form.toDate || !form.status || !form.reason}>
            <Plus className="h-4 w-4" /> {leaveRequest ? "Save changes" : "Create leave request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
