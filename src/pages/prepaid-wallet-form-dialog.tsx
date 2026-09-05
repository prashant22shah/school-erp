import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavePrepaidWallet } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { PrepaidWallet } from "@/lib/types";

const STATUSES: PrepaidWallet["status"][] = ["active", "frozen", "closed"];

export function PrepaidWalletFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: PrepaidWallet }) {
  const save = useSavePrepaidWallet();
  const [form, setForm] = useState<Partial<PrepaidWallet>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { studentRef: "", studentName: "", balance: 0, totalTopUp: 0, totalSpent: 0, lastTransaction: todayISO(), status: "active", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<PrepaidWallet>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName) return;
    save.mutate(
      { ...(editing ?? { id: uid() }), ...form } as PrepaidWallet,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit wallet — ${editing.studentName}` : "Create prepaid wallet"}</DialogTitle>
          <DialogDescription>Set up a prepaid wallet for campus POS transactions (M18.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student name</Label>
            <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student ref</Label>
            <Input placeholder="Student ID" value={form.studentRef ?? ""} onChange={(e) => set({ studentRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Balance (NPR)</Label>
            <Input type="number" placeholder="0" value={form.balance ?? ""} onChange={(e) => set({ balance: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total top-up (NPR)</Label>
            <Input type="number" placeholder="0" value={form.totalTopUp ?? ""} onChange={(e) => set({ totalTopUp: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total spent (NPR)</Label>
            <Input type="number" placeholder="0" value={form.totalSpent ?? ""} onChange={(e) => set({ totalSpent: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Last transaction</Label>
            <Input type="date" value={form.lastTransaction ?? ""} onChange={(e) => set({ lastTransaction: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PrepaidWallet["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentName}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create wallet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
