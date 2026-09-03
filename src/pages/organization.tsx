import { useMemo, useState } from "react";
import {
  Network, Plus, Pencil, Trash2, ChevronDown, ChevronRight, Users, Info,
} from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useOrgUnits, useDeleteOrgUnit } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveOrgUnit } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { uid } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { OrgUnit, OrgUnitType } from "@/lib/types";

const TYPE_BADGE: Record<OrgUnitType, { label: string; cls: string }> = {
  academic: { label: "Academic", cls: "border-sky-200 bg-sky-50 text-sky-700" },
  administrative: { label: "Administrative", cls: "border-violet-200 bg-violet-50 text-violet-700" },
  support: { label: "Support", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
};

function OrgUnitForm({ open, onOpenChange, unit, units }: { open: boolean; onOpenChange: (o: boolean) => void; unit?: OrgUnit; units: OrgUnit[] }) {
  const save = useSaveOrgUnit();
  const [form, setForm] = useState<Partial<OrgUnit>>({});

  useMemo(() => {
    if (open) {
      setForm(
        unit ?? {
          name: "", nameNe: "", code: `ORG-${String(units.length + 1).padStart(2, "0")}`,
          type: "academic", parentId: null, head: "", headRole: "", staffCount: 0, status: "active",
        }
      );
    }
  }, [open, unit]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (patch: Partial<OrgUnit>) => setForm((f) => ({ ...f, ...patch }));
  const submit = () => {
    if (!form.name) return;
    save.mutate({ ...(unit ?? { id: uid() }), ...form } as OrgUnit, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{unit ? `Edit org unit — ${unit.name}` : "Add org unit"}</DialogTitle>
          <DialogDescription>Organizational structure preserves history; deletion is blocked once units are referenced.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Primary Department" />
          </div>
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5 font-nepali">
            <Label>Nepali name</Label>
            <Input value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} placeholder="विभागको नाम" />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as OrgUnitType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reports to (parent unit)</Label>
            <Select value={form.parentId ?? ""} onValueChange={(v) => set({ parentId: v || null })}>
              <SelectTrigger><SelectValue placeholder="Top level (no parent)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">— Top level —</SelectItem>
                {units.filter((u) => u.id !== unit?.id).map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Section head</Label>
            <Input value={form.head ?? ""} onChange={(e) => set({ head: e.target.value })} placeholder="Person's name" />
          </div>
          <div className="space-y-1.5">
            <Label>Head's role</Label>
            <Input value={form.headRole ?? ""} onChange={(e) => set({ headRole: e.target.value })} placeholder="e.g. Coordinator" />
          </div>
          <div className="space-y-1.5">
            <Label>Staff count</Label>
            <Input type="number" value={form.staffCount ?? 0} onChange={(e) => set({ staffCount: +e.target.value })} />
          </div>
          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
            <Label className="cursor-pointer">Active</Label>
            <Switch checked={form.status === "active"} onCheckedChange={(v) => set({ status: v ? "active" : "inactive" })} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name}>
            <Plus className="h-4 w-4" /> {unit ? "Save unit" : "Add unit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function OrgTree({
  units, parentId, depth, childrenCount, open,
  onToggle, onEdit, onDelete,
}: {
  units: OrgUnit[]; parentId: string | null; depth: number; childrenCount: Record<string, number>; open: Record<string, boolean>;
  onToggle: (id: string) => void; onEdit: (u: OrgUnit) => void; onDelete: (u: OrgUnit) => void;
}) {
  const nodes = units.filter((u) => u.parentId === parentId);
  if (nodes.length === 0) return null;
  return (
    <div className={cn("space-y-1.5", depth > 0 && "ml-5 border-l pl-3")}>
      {nodes.map((u) => {
        const kids = childrenCount[u.id] ?? 0;
        const expanded = !!open[u.id];
        const info = TYPE_BADGE[u.type];
        return (
          <div key={u.id}>
            <div className={cn(
              "group flex items-center gap-2 rounded-lg border bg-card px-3 py-2 transition-all hover:border-primary/40",
              u.status === "inactive" && "opacity-60"
            )}>
              {kids > 0 ? (
                <button onClick={() => onToggle(u.id)} className="rounded p-0.5 text-muted-foreground hover:bg-muted">
                  {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : (
                <span className="w-5 text-center"><Info className="h-3.5 w-3.5 text-muted-foreground/40" /></span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{u.name}</span>
                  {u.nameNe && <span className="font-nepali text-[11px] text-muted-foreground">{u.nameNe}</span>}
                  <Badge variant="outline" className={cn("text-[10px]", info.cls)}>{info.label}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{u.code}</Badge>
                  {u.status === "inactive" && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                </div>
                <p className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span><Users className="mr-1 inline h-3 w-3" />{u.head}</span>
                  {u.headRole && <span>{u.headRole}</span>}
                  <span>{u.staffCount} staff</span>
                </p>
              </div>
              <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(u)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(u)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            {expanded && <OrgTree units={units} parentId={u.id} depth={depth + 1} childrenCount={childrenCount} open={open} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />}
          </div>
        );
      })}
    </div>
  );
}
export default function Organization() {
  const org = useOrgUnits();
  const del = useDeleteOrgUnit();
  const units = org.data ?? [];
  const [open, setOpen] = useState<Record<string, boolean>>({ "org-lt": true, "org-aca": true, "org-adm": true });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<OrgUnit | undefined>();
  const [error, setError] = useState<string | null>(null);

  const childrenCount = units.reduce<Record<string, number>>((acc, u) => {
    if (u.parentId) acc[u.parentId] = (acc[u.parentId] ?? 0) + 1;
    return acc;
  }, {});

  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  const handleDelete = (u: OrgUnit) => {
    setError(null);
    del.mutate({ unit: u, children: childrenCount[u.id] ?? 0 }, { onError: (e) => setError((e as Error).message ?? "Delete failed") });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Network}
        title="School Organization Structure"
        titleNe="विद्यालय संरचना"
        microModule="M01.03"
        description="Org units, reporting lines, section heads and matrix ownership (subject department × campus)."
        actions={<CanCreate resource="orgUnits"><Button onClick={() => { setEditing(undefined); setDialogOpen(true); }}><Plus className="h-4 w-4" /> Add org unit</Button></CanCreate>}
      />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-fade-up">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 animate-fade-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Org chart — {units.length} units</CardTitle>
            <CardDescription>Collapsible hierarchy · click the chevron to expand sub-units</CardDescription>
          </CardHeader>
          <CardContent>
            {org.isLoading ? (
              <LoadingBlock />
            ) : (
              <OrgTree
                units={units} parentId={null} depth={0} childrenCount={childrenCount}
                open={open} onToggle={toggle} onEdit={(u) => { setEditing(u); setDialogOpen(true); }} onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>

        <Card className="animate-fade-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Unit summary</CardTitle>
            <CardDescription>Headcount by type of unit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["academic", "administrative", "support"] as OrgUnitType[]).map((t) => {
              const list = units.filter((u) => u.type === t);
              const info = TYPE_BADGE[t];
              return (
                <div key={t} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={info.cls}>{info.label}</Badge>
                    <span className="text-sm text-muted-foreground">{list.length} units</span>
                  </div>
                  <span className="text-lg font-bold">{list.reduce((s, u) => s + u.staffCount, 0)}</span>
                </div>
              );
            })}
            <div className="rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
              Matrix ownership (e.g. subject department + campus) is modelled by linking units to campuses and financial dimensions in the backend contract.
            </div>
          </CardContent>
        </Card>
      </div>

      <OrgUnitForm open={dialogOpen} onOpenChange={setDialogOpen} unit={editing} units={units} />
    </div>
  );
}