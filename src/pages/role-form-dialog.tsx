import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useSaveRole } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { Role, Permission, PermissionEffect } from "@/lib/types";

const RESOURCES = ["*", "students", "fees", "exams", "attendance", "staff", "reports", "admissions", "results", "transport", "library"];
const ACTIONS = ["*", "read", "write", "approve", "delete", "export"];

export function RoleFormDialog({ open, onOpenChange, role }: { open: boolean; onOpenChange: (o: boolean) => void; role?: Role }) {
  const save = useSaveRole();
  const [form, setForm] = useState<Partial<Role>>({});
  const [perms, setPerms] = useState<Permission[]>([]);
  const [newPerm, setNewPerm] = useState<{ resource: string; action: string; effect: PermissionEffect }>({ resource: "students", action: "read", effect: "allow" });

  useEffect(() => {
    if (open) {
      setForm(role ?? { code: "", name: "", nameNe: "", description: "", isSystem: false, isDefault: false, priority: 50, createdOn: todayISO() });
      setPerms(role?.permissions ?? []);
    }
  }, [open, role]);

  const set = (patch: Partial<Role>) => setForm((f) => ({ ...f, ...patch }));

  const addPerm = () => {
    setPerms((p) => [...p, { id: uid(), ...newPerm }]);
  };
  const removePerm = (id: string) => setPerms((p) => p.filter((x) => x.id !== id));

  const submit = () => {
    if (!form.code || !form.name) return;
    save.mutate(
      { ...(role ?? { id: uid() }), ...form, permissions: perms, tenantId: "tenant-default" } as Role,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role ? `Edit role — ${role.code}` : "Create role"}</DialogTitle>
          <DialogDescription>Define role code, name and permission set. System roles cannot be deleted (M02.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Role code (immutable)</Label>
            <Input placeholder="e.g. HEAD_TEACHER" value={form.code ?? ""} disabled={!!role} onChange={(e) => set({ code: e.target.value.toUpperCase() })} />
          </div>
          <div className="space-y-1.5">
            <Label>Role name</Label>
            <Input placeholder="e.g. Head Teacher" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Priority (higher = evaluated first)</Label>
            <Input type="number" value={form.priority ?? 50} onChange={(e) => set({ priority: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="What this role can do…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.isDefault ?? false} onCheckedChange={(v) => set({ isDefault: v })} />
            <Label>Default role for new users</Label>
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-3 pt-2">
          <Label className="text-sm font-semibold">Permissions</Label>
          <div className="flex flex-wrap gap-1.5">
            {perms.map((p) => (
              <Badge key={p.id} variant={p.effect === "deny" ? "destructive" : "secondary"} className="gap-1 cursor-pointer" onClick={() => removePerm(p.id)}>
                {p.resource}:{p.action} <Trash2 className="h-3 w-3" />
              </Badge>
            ))}
            {perms.length === 0 && <span className="text-xs text-muted-foreground">No permissions added yet</span>}
          </div>
          <div className="flex items-end gap-2">
            <div className="space-y-1 flex-1">
              <Label className="text-xs">Resource</Label>
              <Select value={newPerm.resource} onValueChange={(v) => setNewPerm((p) => ({ ...p, resource: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{RESOURCES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1 flex-1">
              <Label className="text-xs">Action</Label>
              <Select value={newPerm.action} onValueChange={(v) => setNewPerm((p) => ({ ...p, action: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ACTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Effect</Label>
              <Select value={newPerm.effect} onValueChange={(v) => setNewPerm((p) => ({ ...p, effect: v as PermissionEffect }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addPerm}><Plus className="h-3 w-3" /></Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name}>
            <Plus className="h-4 w-4" /> {role ? "Save changes" : "Create role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
