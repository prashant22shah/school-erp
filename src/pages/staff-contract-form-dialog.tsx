import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveStaffContract, useStaffProfiles } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { StaffContract, ContractType, ContractStatus } from "@/lib/types";

const TYPES: ContractType[] = ["permanent", "contract", "probation", "temporary"];
const STATUSES: ContractStatus[] = ["active", "expired", "terminated"];

export function StaffContractFormDialog({ open, onOpenChange, contract }: { open: boolean; onOpenChange: (o: boolean) => void; contract?: StaffContract }) {
  const save = useSaveStaffContract();
  const staffProfiles = useStaffProfiles();
  const [form, setForm] = useState<Partial<StaffContract>>({});

  useEffect(() => {
    if (open) {
      setForm(
        contract ?? {
          staffRef: "",
          staffName: "",
          contractType: "permanent",
          startDate: new Date().toISOString().slice(0, 10),
          endDate: "",
          salary: 0,
          status: "active",
        }
      );
    }
  }, [open, contract]);

  const set = (patch: Partial<StaffContract>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.staffRef || !form.contractType || !form.startDate || form.salary == null || !form.status) return;
    const now = new Date().toISOString();
    const staffName = staffProfiles.data?.find((s) => s.id === form.staffRef)?.name ?? form.staffName ?? form.staffRef!;
    save.mutate(
      {
        id: contract?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: contract?.createdOn ?? now,
        updatedOn: now,
        staffRef: form.staffRef!,
        staffName,
        contractType: form.contractType!,
        startDate: form.startDate!,
        endDate: form.endDate || undefined,
        salary: Number(form.salary),
        status: form.status!,
      } as StaffContract,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{contract ? `Edit contract — ${contract.staffName}` : "Create staff contract"}</DialogTitle>
          <DialogDescription>Manage employment contracts and tenure (M13.10).</DialogDescription>
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
            <Label>Contract Type</Label>
            <Select value={form.contractType} onValueChange={(v) => set({ contractType: v as ContractType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ContractStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Start Date</Label>
            <Input type="date" value={form.startDate ? form.startDate.slice(0, 10) : ""} onChange={(e) => set({ startDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>End Date</Label>
            <Input type="date" value={form.endDate ? form.endDate.slice(0, 10) : ""} onChange={(e) => set({ endDate: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Salary</Label>
            <Input type="number" min={0} value={form.salary ?? 0} onChange={(e) => set({ salary: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.staffRef || !form.contractType || !form.startDate || form.salary == null || !form.status}>
            <Plus className="h-4 w-4" /> {contract ? "Save changes" : "Create contract"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
