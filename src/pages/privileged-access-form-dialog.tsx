import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavePrivilegedAccess, useUserIdentities } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { PrivilegedAccess, PrivilegeLevel } from "@/lib/types";

const LEVELS: PrivilegeLevel[] = ["standard", "elevated", "emergency", "break_glass"];
const RESOURCES = ["database.admin", "fees.bulk_waiver", "system.config", "reports.audit_trail", "student.bulk_import", "exam.results_override"];

export function PrivilegedAccessFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const save = useSavePrivilegedAccess();
  const identities = useUserIdentities();
  const [form, setForm] = useState<Partial<PrivilegedAccess>>({});

  useEffect(() => {
    if (open) setForm({ userId: "", userName: "", level: "elevated", resource: "", reason: "", requestedBy: "Anish Karki", requestedOn: todayISO(), validFrom: todayISO(), validTo: "", status: "pending", usedCount: 0 });
  }, [open]);

  const set = (patch: Partial<PrivilegedAccess>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.userId || !form.resource || !form.reason) return;
    const user = (identities.data ?? []).find((u) => u.id === form.userId);
    save.mutate({ id: uid(), ...form, userName: user?.displayName ?? "" } as PrivilegedAccess, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request privileged access</DialogTitle>
          <DialogDescription>Time-bound elevated or break-glass access with approval workflow (M02.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>User</Label>
            <Select value={form.userId} onValueChange={(v) => set({ userId: v })}>
              <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
              <SelectContent>{(identities.data ?? []).map((u) => <SelectItem key={u.id} value={u.id}>{u.displayName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Privilege level</Label>
            <Select value={form.level} onValueChange={(v) => set({ level: v as PrivilegeLevel })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LEVELS.map((l) => <SelectItem key={l} value={l}>{l.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Resource</Label>
            <Select value={form.resource} onValueChange={(v) => set({ resource: v })}>
              <SelectTrigger><SelectValue placeholder="Select resource" /></SelectTrigger>
              <SelectContent>{RESOURCES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Reason</Label>
            <Input placeholder="Why elevated access is needed…" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
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
          <div className="space-y-1.5">
            <Label>Max uses (optional)</Label>
            <Input type="number" placeholder="Unlimited if empty" value={form.maxUses ?? ""} onChange={(e) => set({ maxUses: e.target.value ? +e.target.value : undefined })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.userId || !form.resource || !form.reason}>
            <Plus className="h-4 w-4" /> Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
