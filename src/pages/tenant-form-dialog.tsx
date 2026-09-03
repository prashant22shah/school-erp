import { useEffect, useState } from "react";
import { Building, Plus } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveTenant } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { Tenant, TenantStatus, Edition, Environment } from "@/lib/types";

const MODULE_CATALOG = [
  "M04 CRM & Admissions", "M05 Student Info", "M06 Curriculum", "M07 Attendance",
  "M08 Examinations", "M09 Results & Records", "M10 LMS", "M12 Fees & Finance",
  "M13 HR & Payroll", "M16 Library", "M17 Transport",
];

const STATUSES: TenantStatus[] = ["trial", "active", "suspended", "read_only", "archived", "terminated"];
const EDITIONS: Edition[] = ["basic", "standard", "premium", "enterprise"];
const ENVS: Environment[] = ["sandbox", "training", "production"];

export function TenantFormDialog({ open, onOpenChange, tenant }: { open: boolean; onOpenChange: (o: boolean) => void; tenant?: Tenant }) {
  const save = useSaveTenant();
  const [form, setForm] = useState<Partial<Tenant>>({});
  const [modules, setModules] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setForm(
        tenant ?? {
          name: "", code: `TNT-${Math.floor(1050 + Math.random() * 900)}`, edition: "standard",
          status: "trial", environment: "sandbox", contactEmail: "", phone: "",
          createdOn: todayISO(), validFrom: todayISO(), userLimit: 50, storageLimitGb: 100,
          usage: { users: 0, students: 0, storageGb: 0, apiCallsK: 0 },
        }
      );
      setModules(tenant?.licensedModules ?? []);
    }
  }, [open, tenant]);

  const set = (patch: Partial<Tenant>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name) return;
    save.mutate(
      { ...(tenant ?? { id: uid() }), ...form, licensedModules: modules } as Tenant,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tenant ? `Edit tenant — ${tenant.code}` : "Create institution tenant"}</DialogTitle>
          <DialogDescription>
            Tenant code is immutable after creation. Entitlement and lifecycle changes are effective-dated (M01.01).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Tenant code (immutable)</Label>
            <Input value={form.code ?? ""} disabled={!!tenant} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Institution name</Label>
            <Input placeholder="e.g. Sunrise Public School" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="विद्यालयको नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Edition</Label>
            <Select value={form.edition} onValueChange={(v) => set({ edition: v as Edition })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{EDITIONS.map((e) => <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Environment</Label>
            <Select value={form.environment} onValueChange={(v) => set({ environment: v as Environment })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ENVS.map((e) => <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Lifecycle status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as TenantStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", "-")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Contact email</Label>
            <Input type="email" placeholder="admin@school.edu.np" value={form.contactEmail ?? ""} onChange={(e) => set({ contactEmail: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>User limit</Label>
            <Input type="number" value={form.userLimit ?? 0} onChange={(e) => set({ userLimit: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Storage limit (GB)</Label>
            <Input type="number" value={form.storageLimitGb ?? 0} onChange={(e) => set({ storageLimitGb: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Valid from</Label>
            <Input type="date" value={form.validFrom ?? ""} onChange={(e) => set({ validFrom: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Valid to</Label>
            <Input type="date" value={form.validTo ?? ""} onChange={(e) => set({ validTo: e.target.value })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5"><Building className="h-3.5 w-3.5" /> Licensed modules & entitlements</Label>
          <div className="flex flex-wrap gap-1.5 rounded-lg border border-dashed p-3">
            {MODULE_CATALOG.map((m) => {
              const on = modules.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModules((ms) => (on ? ms.filter((x) => x !== m) : [...ms, m]))}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                    on ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                  }`}
                >
                  {on ? "✓ " : "+ "}{m}
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name}>
            <Plus className="h-4 w-4" /> {tenant ? "Save changes" : "Create tenant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

