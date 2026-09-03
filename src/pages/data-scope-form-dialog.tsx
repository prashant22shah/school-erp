import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveDataScope, useUserIdentities, useCampuses, useOrgUnits } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { DataScope } from "@/lib/types";

export function DataScopeFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const save = useSaveDataScope();
  const identities = useUserIdentities();
  const campuses = useCampuses();
  const orgUnits = useOrgUnits();
  const [form, setForm] = useState<Partial<DataScope>>({});

  useEffect(() => {
    if (open) setForm({ userId: "", userName: "", scopeType: "campus", scopeId: "", scopeName: "", grantedBy: "Anish Karki", grantedOn: todayISO() });
  }, [open]);

  const set = (patch: Partial<DataScope>) => setForm((f) => ({ ...f, ...patch }));

  const scopeOptions = form.scopeType === "campus" ? (campuses.data ?? []).map((c) => ({ id: c.id, name: c.name })) :
                       form.scopeType === "org_unit" ? (orgUnits.data ?? []).map((o) => ({ id: o.id, name: o.name })) :
                       form.scopeType === "class_section" ? [{ id: "cs-10a", name: "Class 10 — Section A" }, { id: "cs-10b", name: "Class 10 — Section B" }, { id: "cs-12sci", name: "Class 12 — Science" }] : [];

  const submit = () => {
    if (!form.userId || !form.scopeId) return;
    const user = (identities.data ?? []).find((u) => u.id === form.userId);
    const scopeName = scopeOptions.find((s) => s.id === form.scopeId)?.name ?? "";
    save.mutate({ id: uid(), ...form, userName: user?.displayName ?? "", scopeName } as DataScope, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Grant data scope</DialogTitle>
          <DialogDescription>Restrict a user's data visibility to a specific campus, org unit or class section (M02.03).</DialogDescription>
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
            <Label>Scope type</Label>
            <Select value={form.scopeType} onValueChange={(v) => set({ scopeType: v as DataScope["scopeType"], scopeId: "" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="campus">Campus</SelectItem>
                <SelectItem value="org_unit">Org unit</SelectItem>
                <SelectItem value="class_section">Class section</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Scope</Label>
            <Select value={form.scopeId} onValueChange={(v) => set({ scopeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select scope" /></SelectTrigger>
              <SelectContent>{scopeOptions.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.userId || !form.scopeId}>
            <Plus className="h-4 w-4" /> Grant scope
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
