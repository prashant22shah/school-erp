import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveDutyRule, useRoles } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { DutyRule } from "@/lib/types";

export function DutyRuleFormDialog({ open, onOpenChange, rule }: { open: boolean; onOpenChange: (o: boolean) => void; rule?: DutyRule }) {
  const save = useSaveDutyRule();
  const roles = useRoles();
  const [form, setForm] = useState<Partial<DutyRule>>({});

  useEffect(() => {
    if (open) setForm(rule ?? { name: "", description: "", conflictingRoles: ["", ""], enforcement: "strict", isActive: true, createdBy: "Anish Karki", createdOn: todayISO() });
  }, [open, rule]);

  const set = (patch: Partial<DutyRule>) => setForm((f) => ({ ...f, ...patch }));
  const setRoleA = (v: string) => setForm((f) => ({ ...f, conflictingRoles: [v, f.conflictingRoles?.[1] ?? ""] as [string, string] }));
  const setRoleB = (v: string) => setForm((f) => ({ ...f, conflictingRoles: [f.conflictingRoles?.[0] ?? "", v] as [string, string] }));

  const submit = () => {
    if (!form.name || !form.conflictingRoles?.[0] || !form.conflictingRoles?.[1]) return;
    save.mutate({ ...(rule ?? { id: uid() }), ...form, tenantId: "tenant-default" } as DutyRule, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit SoD rule" : "Create segregation of duties rule"}</DialogTitle>
          <DialogDescription>Define two conflicting roles that cannot coexist on the same user (M02.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Rule name</Label>
            <Input placeholder="e.g. Maker-Checker Separation" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input placeholder="What conflict this rule prevents…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Conflicting role A</Label>
              <Select value={form.conflictingRoles?.[0] ?? ""} onValueChange={setRoleA}>
                <SelectTrigger><SelectValue placeholder="Role A" /></SelectTrigger>
                <SelectContent>{(roles.data ?? []).map((r) => <SelectItem key={r.code} value={r.code}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Conflicting role B</Label>
              <Select value={form.conflictingRoles?.[1] ?? ""} onValueChange={setRoleB}>
                <SelectTrigger><SelectValue placeholder="Role B" /></SelectTrigger>
                <SelectContent>{(roles.data ?? []).map((r) => <SelectItem key={r.code} value={r.code}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Enforcement level</Label>
            <Select value={form.enforcement} onValueChange={(v) => set({ enforcement: v as DutyRule["enforcement"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="strict">Strict — block assignment</SelectItem>
                <SelectItem value="warning">Warning — allow with alert</SelectItem>
                <SelectItem value="advisory">Advisory — log only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Exception note (optional)</Label>
            <Input placeholder="Any approved exception…" value={form.exceptionNote ?? ""} onChange={(e) => set({ exceptionNote: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.isActive ?? true} onCheckedChange={(v) => set({ isActive: v })} />
            <Label>Rule active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name}>
            <Plus className="h-4 w-4" /> {rule ? "Save" : "Create rule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
