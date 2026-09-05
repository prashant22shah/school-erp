import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveRollCall, useResidenceBlocks } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { RollCall } from "@/lib/types";

const STATUSES: RollCall["status"][] = ["draft", "submitted"];

export function RollCallFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: RollCall }) {
  const save = useSaveRollCall();
  const blocks = useResidenceBlocks();
  const [form, setForm] = useState<Partial<RollCall>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { blockRef: "", date: todayISO(), takenBy: "", presentCount: 0, absentCount: 0, lateCount: 0, notes: "", status: "draft", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<RollCall>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.blockRef || !form.date || !form.takenBy) return;
    save.mutate(
      { ...(editing ?? { id: uid() }), ...form } as RollCall,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit roll call — ${editing.date}` : "Create roll call"}</DialogTitle>
          <DialogDescription>Record a residence block roll call with attendance counts (M18.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Block</Label>
            <Select value={form.blockRef} onValueChange={(v) => set({ blockRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select block" /></SelectTrigger>
              <SelectContent>{(blocks.data ?? []).map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={form.date ?? ""} onChange={(e) => set({ date: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Taken by</Label>
            <Input placeholder="Staff name" value={form.takenBy ?? ""} onChange={(e) => set({ takenBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as RollCall["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Present count</Label>
            <Input type="number" placeholder="0" value={form.presentCount ?? ""} onChange={(e) => set({ presentCount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Absent count</Label>
            <Input type="number" placeholder="0" value={form.absentCount ?? ""} onChange={(e) => set({ absentCount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Late count</Label>
            <Input type="number" placeholder="0" value={form.lateCount ?? ""} onChange={(e) => set({ lateCount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes…" value={form.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.blockRef || !form.date || !form.takenBy}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create roll call"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
