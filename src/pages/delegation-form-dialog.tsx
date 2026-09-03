import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveDelegation, useUserIdentities } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { Delegation } from "@/lib/types";

export function DelegationFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const save = useSaveDelegation();
  const identities = useUserIdentities();
  const [form, setForm] = useState<Partial<Delegation>>({});

  useEffect(() => {
    if (open) setForm({ delegatorId: "", delegatorName: "", delegateId: "", delegateName: "", reason: "", scope: "", validFrom: todayISO(), validTo: "", status: "active", createdOn: todayISO() });
  }, [open]);

  const set = (patch: Partial<Delegation>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.delegatorId || !form.delegateId || !form.reason) return;
    const delegator = (identities.data ?? []).find((u) => u.id === form.delegatorId);
    const delegate = (identities.data ?? []).find((u) => u.id === form.delegateId);
    save.mutate({ id: uid(), ...form, delegatorName: delegator?.displayName ?? "", delegateName: delegate?.displayName ?? "" } as Delegation, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create delegation</DialogTitle>
          <DialogDescription>Delegate authority to another user for a limited period — e.g. during leave (M02.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Delegator (who is delegating)</Label>
            <Select value={form.delegatorId} onValueChange={(v) => set({ delegatorId: v })}>
              <SelectTrigger><SelectValue placeholder="Select delegator" /></SelectTrigger>
              <SelectContent>{(identities.data ?? []).map((u) => <SelectItem key={u.id} value={u.id}>{u.displayName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Delegate (who receives authority)</Label>
            <Select value={form.delegateId} onValueChange={(v) => set({ delegateId: v })}>
              <SelectTrigger><SelectValue placeholder="Select delegate" /></SelectTrigger>
              <SelectContent>{(identities.data ?? []).map((u) => <SelectItem key={u.id} value={u.id}>{u.displayName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Scope (permissions delegated)</Label>
            <Input placeholder="e.g. exams.approve, fees.approve" value={form.scope ?? ""} onChange={(e) => set({ scope: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Reason</Label>
            <Input placeholder="e.g. Annual leave — Dashain vacation" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Valid from</Label>
              <Input type="date" value={form.validFrom ?? ""} onChange={(e) => set({ validFrom: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Valid to</Label>
              <Input type="date" value={form.validTo ?? ""} onChange={(e) => set({ validTo: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.delegatorId || !form.delegateId || !form.reason}>
            <Plus className="h-4 w-4" /> Create delegation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
