import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveRoomType, useResidenceBlocks } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { RoomType } from "@/lib/types";

const STATUSES: RoomType["status"][] = ["active", "inactive"];

export function RoomTypeFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: RoomType }) {
  const save = useSaveRoomType();
  const blocks = useResidenceBlocks();
  const [form, setForm] = useState<Partial<RoomType>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { code: "", name: "", blockRef: "", bedCount: 1, amenities: "", feePerMonth: 0, description: "", status: "active", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<RoomType>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name || !form.blockRef) return;
    save.mutate(
      { ...(editing ?? { id: uid() }), ...form } as RoomType,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit room type — ${editing.name}` : "Create room type"}</DialogTitle>
          <DialogDescription>Define a room type with bed count, amenities, and monthly fee (M18.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. 4BED-STD" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Room type name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Block</Label>
            <Select value={form.blockRef} onValueChange={(v) => set({ blockRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select block" /></SelectTrigger>
              <SelectContent>{(blocks.data ?? []).map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Bed count</Label>
            <Input type="number" placeholder="1" value={form.bedCount ?? ""} onChange={(e) => set({ bedCount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Fee per month (NPR)</Label>
            <Input type="number" placeholder="0" value={form.feePerMonth ?? ""} onChange={(e) => set({ feePerMonth: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as RoomType["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Amenities</Label>
            <Input placeholder="Fan, Study table, Almirah" value={form.amenities ?? ""} onChange={(e) => set({ amenities: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Room type description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name || !form.blockRef}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create room type"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
