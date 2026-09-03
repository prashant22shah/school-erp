import { useMemo, useState } from "react";
import {
  MapPin, Plus, Pencil, Trash2, Building, Layers, DoorOpen, FlaskConical, Trees, QrCode,
  AccessibilityIcon, Share2, ShieldCheck, ChevronDown, ChevronRight,
} from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useLocations, useDeleteLocation } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useSaveLocation } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { uid, cn } from "@/lib/utils";
import type { LocationNode, LocationType, BookingPolicy } from "@/lib/types";

const TYPE_ICON: Record<LocationType, React.ComponentType<{ className?: string }>> = {
  site: Building, building: Layers, floor: Layers, room: DoorOpen, lab: FlaskConical, hall: DoorOpen, field: Trees,
};

const TYPE_LABEL: Record<LocationType, string> = {
  site: "Site", building: "Building", floor: "Floor", room: "Room", lab: "Lab", hall: "Hall", field: "Field",
};

const POLICY_BADGE: Record<BookingPolicy, { label: string; cls: string }> = {
  open: { label: "Open booking", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  approval: { label: "Approval", cls: "border-amber-200 bg-amber-50 text-amber-700" },
  restricted: { label: "Restricted", cls: "border-destructive/20 bg-destructive/5 text-destructive" },
  closed: { label: "Closed", cls: "border-slate-200 bg-slate-50 text-slate-600" },
};

const STATUS_BADGE: Record<LocationNode["status"], { label: string; cls: string }> = {
  available: { label: "Available", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  occupied: { label: "Occupied", cls: "border-sky-200 bg-sky-50 text-sky-700" },
  maintenance: { label: "Maintenance", cls: "border-amber-200 bg-amber-50 text-amber-700" },
};

function LocationForm({ open, onOpenChange, loc, locations }: { open: boolean; onOpenChange: (o: boolean) => void; loc?: LocationNode; locations: LocationNode[] }) {
  const save = useSaveLocation();
  const [form, setForm] = useState<Partial<LocationNode>>({});

  useMemo(() => {
    if (open) {
      setForm(
        loc ?? {
          name: "", code: `LOC-${Math.floor(100 + Math.random() * 900)}`, type: "room", parentId: null,
          capacity: 0, accessibility: true, equipment: [], safetyRating: 3, bookingPolicy: "open",
          barcode: `QR-${Math.floor(1000 + Math.random() * 9000)}`, shared: false, status: "available",
        }
      );
    }
  }, [open, loc]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (patch: Partial<LocationNode>) => setForm((f) => ({ ...f, ...patch }));

  const parentOptions = (l: LocationNode) => {
    if (l.type === "site") return [];
    if (l.type === "building") return locations.filter((x) => x.type === "site");
    if (l.type === "floor") return locations.filter((x) => x.type === "building" || x.type === "site");
    return locations.filter((x) => ["building", "floor", "site"].includes(x.type));
  };

  const submit = () => {
    if (!form.name) return;
    save.mutate({ ...(loc ?? { id: uid() }), ...form } as LocationNode, { onSuccess: () => onOpenChange(false) });
  };

  const canBook = !["site", "building", "floor"].includes(form.type ?? "room");
return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{loc ? `Edit — ${loc.name}` : "Add location / space"}</DialogTitle>
          <DialogDescription>Capacity and accessibility rules apply at the effective booking time (M01.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Physics Laboratory" />
          </div>
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as LocationType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(TYPE_LABEL) as LocationType[]).map((t) => <SelectItem key={t} value={t}>{TYPE_LABEL[t]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Contained in</Label>
            <Select value={form.parentId ?? ""} onValueChange={(v) => set({ parentId: v || null })}>
              <SelectTrigger><SelectValue placeholder="Top level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">— Top level —</SelectItem>
                {parentOptions(form as LocationNode).map((x) => <SelectItem key={x.id} value={x.id}>{x.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {canBook && (
            <>
              <div className="space-y-1.5">
                <Label>Capacity</Label>
                <Input type="number" value={form.capacity ?? 0} onChange={(e) => set({ capacity: +e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Booking policy</Label>
                <Select value={form.bookingPolicy} onValueChange={(v) => set({ bookingPolicy: v as BookingPolicy })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="approval">Approval required</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Safety rating</Label>
                <Select value={String(form.safetyRating ?? 3)} onValueChange={(v) => set({ safetyRating: +v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>{n} / 5</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => set({ status: v as LocationNode["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <Label>QR / barcode</Label>
            <Input value={form.barcode ?? ""} onChange={(e) => set({ barcode: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Input value={form.department ?? ""} onChange={(e) => set({ department: e.target.value })} placeholder="e.g. Science Stream" />
          </div>
          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
            <Label className="cursor-pointer">Accessibility</Label>
            <Switch checked={!!form.accessibility} onCheckedChange={(v) => set({ accessibility: v })} />
          </div>
          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
            <Label className="cursor-pointer">Shared room</Label>
            <Switch checked={!!form.shared} onCheckedChange={(v) => set({ shared: v })} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name}>
            <Plus className="h-4 w-4" /> {loc ? "Save changes" : "Add location"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default function Locations() {
  const locs = useLocations();
  const del = useDeleteLocation();
  const locations = locs.data ?? [];
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LocationNode | undefined>();
  const [error, setError] = useState<string | null>(null);

  const childrenCount = locations.reduce<Record<string, number>>((acc, l) => {
    if (l.parentId) acc[l.parentId] = (acc[l.parentId] ?? 0) + 1;
    return acc;
  }, {});

  const filtered = locations.filter((l) => {
    const matchesType = typeFilter === "all" || l.type === typeFilter;
    const s = q.toLowerCase();
    const matchesQ = !q || l.name.toLowerCase().includes(s) || l.code.toLowerCase().includes(s) || (l.department ?? "").toLowerCase().includes(s);
    return matchesType && matchesQ;
  });

  const types: { key: string; label: string }[] = [
    { key: "all", label: "All" }, { key: "site", label: "Sites" }, { key: "building", label: "Buildings" },
    { key: "floor", label: "Floors" }, { key: "room", label: "Rooms" }, { key: "lab", label: "Labs" },
    { key: "hall", label: "Halls" }, { key: "field", label: "Fields" },
  ];

  const handleDelete = (l: LocationNode) => {
    setError(null);
    del.mutate({ loc: l, children: childrenCount[l.id] ?? 0 }, { onError: (e) => setError((e as Error).message ?? "Delete failed") });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={MapPin}
        title="Facilities & Location Master"
        titleNe="स्थान तथा सुविधा"
        microModule="M01.04"
        description="Sites, buildings, floors, rooms, labs, halls and fields with capacity, accessibility, QR codes and booking policy."
        actions={<CanCreate resource="locations"><Button onClick={() => { setEditing(undefined); setDialogOpen(true); }}><Plus className="h-4 w-4" /> Add location</Button></CanCreate>}
      />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-fade-up">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <QrCode className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, code or department…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {types.map((t) => (
            <button
              key={t.key}
              onClick={() => setTypeFilter(t.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                typeFilter === t.key ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {locs.isLoading ? (
        <LoadingBlock />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((l) => {
            const Icon = TYPE_ICON[l.type];
            const pol = POLICY_BADGE[l.bookingPolicy];
            const st = STATUS_BADGE[l.status];
            const bookable = !["site", "building", "floor"].includes(l.type);
            return (
              <Card key={l.id} className="group animate-fade-up">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-tight">{l.name}</p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                          {TYPE_LABEL[l.type]} · {l.code}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={st.cls}>{st.label}</Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge variant="outline" className={pol.cls}>{pol.label}</Badge>
                    {bookable && l.capacity ? <Badge variant="secondary">{l.capacity} seats</Badge> : null}
                    {l.accessibility && (
                      <Badge variant="secondary" className="text-[10px]"><AccessibilityIcon className="h-3 w-3" /> Accessible</Badge>
                    )}
                    {l.shared && (
                      <Badge variant="secondary" className="text-[10px]"><Share2 className="h-3 w-3" /> Shared</Badge>
                    )}
                    {l.safetyRating ? (
                      <Badge variant="secondary" className="text-[10px]"><ShieldCheck className="h-3 w-3" /> Safety {l.safetyRating}/5</Badge>
                    ) : null}
                  </div>

                  {l.department && <p className="mt-2 text-xs text-muted-foreground">Dept: {l.department}</p>}

                  <div className="mt-3 flex items-center justify-between border-t pt-3">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <QrCode className="h-3.5 w-3.5" /> {l.barcode}
                    </span>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(l); setDialogOpen(true); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(l)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <Card className="sm:col-span-2 xl:col-span-4">
              <CardContent className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                No locations match your filters.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <LocationForm open={dialogOpen} onOpenChange={setDialogOpen} loc={editing} locations={locations} />
    </div>
  );
}