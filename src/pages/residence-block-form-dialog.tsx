import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveResidenceBlock } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { ResidenceBlock, BlockType } from "@/lib/types";

const BLOCK_TYPES: BlockType[] = ["boys", "girls", "mixed", "staff"];
const STATUSES: ResidenceBlock["status"][] = ["active", "under_maintenance", "closed"];

export function ResidenceBlockFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: ResidenceBlock }) {
  const save = useSaveResidenceBlock();
  const [form, setForm] = useState<Partial<ResidenceBlock>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { code: "", name: "", type: "boys", floors: 1, totalRooms: 0, totalBeds: 0, occupiedBeds: 0, warden: "", status: "active", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<ResidenceBlock>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name) return;
    save.mutate(
      { ...(editing ?? { id: uid() }), ...form } as ResidenceBlock,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit block — ${editing.name}` : "Create residence block"}</DialogTitle>
          <DialogDescription>Define a hostel/residence block with room and bed capacity (M18.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. BLK-A" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Block name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as BlockType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{BLOCK_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Floors</Label>
            <Input type="number" placeholder="0" value={form.floors ?? ""} onChange={(e) => set({ floors: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total rooms</Label>
            <Input type="number" placeholder="0" value={form.totalRooms ?? ""} onChange={(e) => set({ totalRooms: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total beds</Label>
            <Input type="number" placeholder="0" value={form.totalBeds ?? ""} onChange={(e) => set({ totalBeds: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Occupied beds</Label>
            <Input type="number" placeholder="0" value={form.occupiedBeds ?? ""} onChange={(e) => set({ occupiedBeds: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Warden</Label>
            <Input placeholder="Warden name" value={form.warden ?? ""} onChange={(e) => set({ warden: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ResidenceBlock["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create block"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
