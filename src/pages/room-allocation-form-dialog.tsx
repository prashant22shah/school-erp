import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveRoomAllocation } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { RoomAllocation } from "@/lib/types";

const STATUSES: RoomAllocation["status"][] = ["active", "vacated", "transferred", "terminated"];

export function RoomAllocationFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: RoomAllocation }) {
  const save = useSaveRoomAllocation();
  const [form, setForm] = useState<Partial<RoomAllocation>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { applicationRef: "", studentRef: "", studentName: "", blockRef: "", blockName: "", roomNo: "", bedNo: "", allocatedFrom: todayISO(), allocatedTo: "", feeAmount: 0, status: "active", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<RoomAllocation>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName || !form.blockName || !form.roomNo || !form.bedNo) return;
    save.mutate(
      { ...(editing ?? { id: uid() }), ...form } as RoomAllocation,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit allocation — ${editing.studentName}` : "Create room allocation"}</DialogTitle>
          <DialogDescription>Assign a student to a specific room and bed in a residence block (M18.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student name</Label>
            <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Block name</Label>
            <Input placeholder="e.g. Block A — Boys" value={form.blockName ?? ""} onChange={(e) => set({ blockName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Room No</Label>
            <Input placeholder="e.g. A-101" value={form.roomNo ?? ""} onChange={(e) => set({ roomNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Bed No</Label>
            <Input placeholder="e.g. B1" value={form.bedNo ?? ""} onChange={(e) => set({ bedNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Allocated from</Label>
            <Input type="date" value={form.allocatedFrom ?? ""} onChange={(e) => set({ allocatedFrom: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Allocated to</Label>
            <Input type="date" value={form.allocatedTo ?? ""} onChange={(e) => set({ allocatedTo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Fee amount (NPR/month)</Label>
            <Input type="number" placeholder="0" value={form.feeAmount ?? ""} onChange={(e) => set({ feeAmount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as RoomAllocation["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentName || !form.blockName || !form.roomNo || !form.bedNo}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create allocation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
