import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveStaffProfile } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { StaffProfile, StaffStatus } from "@/lib/types";

const STATUSES: StaffStatus[] = ["active", "on_leave", "suspended", "resigned", "retired"];

export function StaffProfileFormDialog({ open, onOpenChange, staffProfile }: { open: boolean; onOpenChange: (o: boolean) => void; staffProfile?: StaffProfile }) {
  const save = useSaveStaffProfile();
  const [form, setForm] = useState<Partial<StaffProfile>>({});

  useEffect(() => {
    if (open) {
      setForm(
        staffProfile ?? {
          staffCode: "",
          name: "",
          department: "",
          designation: "",
          joinDate: new Date().toISOString().slice(0, 10),
          status: "active",
        }
      );
    }
  }, [open, staffProfile]);

  const set = (patch: Partial<StaffProfile>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.staffCode || !form.name || !form.department || !form.designation || !form.joinDate || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: staffProfile?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: staffProfile?.createdOn ?? now,
        updatedOn: now,
        staffCode: form.staffCode!,
        name: form.name!,
        department: form.department!,
        designation: form.designation!,
        joinDate: form.joinDate!,
        status: form.status!,
      } as StaffProfile,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{staffProfile ? `Edit staff — ${staffProfile.name}` : "Create staff profile"}</DialogTitle>
          <DialogDescription>Manage staff master profile and employment details (M13.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Staff Code</Label>
            <Input placeholder="e.g. EMP-001" value={form.staffCode ?? ""} onChange={(e) => set({ staffCode: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as StaffStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="Full name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Input placeholder="e.g. Academic" value={form.department ?? ""} onChange={(e) => set({ department: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Designation</Label>
            <Input placeholder="e.g. Teacher" value={form.designation ?? ""} onChange={(e) => set({ designation: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Join Date</Label>
            <Input type="date" value={form.joinDate ? form.joinDate.slice(0, 10) : ""} onChange={(e) => set({ joinDate: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.staffCode || !form.name || !form.department || !form.designation || !form.joinDate || !form.status}>
            <Plus className="h-4 w-4" /> {staffProfile ? "Save changes" : "Create staff profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
