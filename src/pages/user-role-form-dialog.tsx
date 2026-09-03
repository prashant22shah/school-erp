import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveUserRole, useRoles, useUserIdentities, useCampuses, useOrgUnits } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

export function UserRoleFormDialog({ open, onOpenChange, userRole }: { open: boolean; onOpenChange: (o: boolean) => void; userRole?: UserRole }) {
  const save = useSaveUserRole();
  const roles = useRoles();
  const identities = useUserIdentities();
  const campuses = useCampuses();
  const orgUnits = useOrgUnits();
  const [form, setForm] = useState<Partial<UserRole>>({});

  useEffect(() => {
    if (open) {
      setForm(userRole ?? { userId: "", userName: "", roleId: "", roleName: "", scope: "tenant", assignedBy: "Anish Karki", assignedOn: todayISO(), validFrom: todayISO(), isActive: true });
    }
  }, [open, userRole]);

  const set = (patch: Partial<UserRole>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.userId || !form.roleId) return;
    const user = (identities.data ?? []).find((u) => u.id === form.userId);
    const role = (roles.data ?? []).find((r) => r.id === form.roleId);
    const scopeName = form.scope === "campus" ? (campuses.data ?? []).find((c) => c.id === form.scopeId)?.name :
                      form.scope === "org_unit" ? (orgUnits.data ?? []).find((o) => o.id === form.scopeId)?.name : undefined;
    save.mutate(
      { ...(userRole ?? { id: uid() }), ...form, userName: user?.displayName ?? "", roleName: role?.name ?? "", scopeName } as UserRole,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{userRole ? "Edit role assignment" : "Assign role to user"}</DialogTitle>
          <DialogDescription>Map a user to a role with optional campus or org-unit scope (M02.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>User</Label>
            <Select value={form.userId} onValueChange={(v) => set({ userId: v })}>
              <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
              <SelectContent>{(identities.data ?? []).map((u) => <SelectItem key={u.id} value={u.id}>{u.displayName} ({u.username})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={form.roleId} onValueChange={(v) => set({ roleId: v })}>
              <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>{(roles.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.name} ({r.code})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Scope</Label>
            <Select value={form.scope} onValueChange={(v) => set({ scope: v as "tenant" | "campus" | "org_unit" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant">Tenant (all campuses)</SelectItem>
                <SelectItem value="campus">Campus</SelectItem>
                <SelectItem value="org_unit">Org unit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.scope === "campus" && (
            <div className="space-y-1.5">
              <Label>Campus</Label>
              <Select value={form.scopeId ?? ""} onValueChange={(v) => set({ scopeId: v })}>
                <SelectTrigger><SelectValue placeholder="Select campus" /></SelectTrigger>
                <SelectContent>{(campuses.data ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          {form.scope === "org_unit" && (
            <div className="space-y-1.5">
              <Label>Org unit</Label>
              <Select value={form.scopeId ?? ""} onValueChange={(v) => set({ scopeId: v })}>
                <SelectTrigger><SelectValue placeholder="Select org unit" /></SelectTrigger>
                <SelectContent>{(orgUnits.data ?? []).map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Valid from</Label>
              <Input type="date" value={form.validFrom ?? ""} onChange={(e) => set({ validFrom: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Valid to (optional)</Label>
              <Input type="date" value={form.validTo ?? ""} onChange={(e) => set({ validTo: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.userId || !form.roleId}>
            <Plus className="h-4 w-4" /> {userRole ? "Save" : "Assign role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
