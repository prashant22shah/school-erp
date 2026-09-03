import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveUserIdentity } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { UserIdentity, IdentityStatus, IdentityType } from "@/lib/types";

const TYPES: IdentityType[] = ["staff", "student", "guardian", "vendor", "admin", "service_account"];
const STATUSES: IdentityStatus[] = ["active", "inactive", "locked", "suspended", "pending_activation", "archived"];

export function IdentityFormDialog({ open, onOpenChange, identity }: { open: boolean; onOpenChange: (o: boolean) => void; identity?: UserIdentity }) {
  const save = useSaveUserIdentity();
  const [form, setForm] = useState<Partial<UserIdentity>>({});

  useEffect(() => {
    if (open) {
      setForm(identity ?? {
        username: "", email: "", displayName: "", displayNameNe: "",
        type: "staff", status: "active", mfaEnabled: false, failedAttempts: 0,
        mustChangePassword: false, createdOn: todayISO(), updatedOn: todayISO(),
      });
    }
  }, [open, identity]);

  const set = (patch: Partial<UserIdentity>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.username || !form.email || !form.displayName) return;
    save.mutate(
      { ...(identity ?? { id: uid() }), ...form, updatedOn: todayISO() } as UserIdentity,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{identity ? `Edit identity — ${identity.username}` : "Create user identity"}</DialogTitle>
          <DialogDescription>User identity lifecycle — username is immutable after creation (M02.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Username (immutable)</Label>
            <Input placeholder="e.g. ram.bahadur" value={form.username ?? ""} disabled={!!identity} onChange={(e) => set({ username: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" placeholder="user@school.edu.np" value={form.email ?? ""} onChange={(e) => set({ email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Display name</Label>
            <Input placeholder="Full name" value={form.displayName ?? ""} onChange={(e) => set({ displayName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.displayNameNe ?? ""} onChange={(e) => set({ displayNameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input placeholder="+977-98XXXXXXXX" value={form.phone ?? ""} onChange={(e) => set({ phone: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Identity type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as IdentityType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as IdentityStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>MFA method</Label>
            <Select value={form.mfaMethod ?? ""} onValueChange={(v) => set({ mfaMethod: v as "totp" | "sms" | "email" })}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="totp">TOTP (Authenticator app)</SelectItem>
                <SelectItem value="sms">SMS OTP</SelectItem>
                <SelectItem value="email">Email OTP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={form.mfaEnabled ?? false} onCheckedChange={(v) => set({ mfaEnabled: v })} />
            <Label>MFA enabled</Label>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={form.mustChangePassword ?? false} onCheckedChange={(v) => set({ mustChangePassword: v })} />
            <Label>Must change password</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.username || !form.email}>
            <Plus className="h-4 w-4" /> {identity ? "Save changes" : "Create identity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
