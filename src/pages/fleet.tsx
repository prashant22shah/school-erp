import { useMemo, useState } from "react";
import { Bus, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { VehicleFormDialog } from "@/pages/vehicle-form-dialog";
import { useVehicles, useDeleteVehicle } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { Vehicle } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  active: "success",
  maintenance: "warning",
  retired: "secondary",
  idle: "info",
};

const typeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  bus: "info",
  minibus: "success",
  van: "warning",
  car: "secondary",
};

function isExpiringSoon(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 30;
}

export default function FleetPage() {
  const query = useVehicles();
  const del = useDeleteVehicle();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (v) =>
          v.registrationNo.toLowerCase().includes(s) ||
          v.type.toLowerCase().includes(s) ||
          (v.driverName ?? "").toLowerCase().includes(s) ||
          v.status.toLowerCase().includes(s)
      );
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const active = (query.data ?? []).filter((v) => v.status === "active").length;
  const maintenance = (query.data ?? []).filter((v) => v.status === "maintenance").length;
  const expiring = (query.data ?? []).filter(
    (v) => isExpiringSoon(v.fitnessUntil) || isExpiringSoon(v.insuranceUntil) || isExpiringSoon(v.permitUntil) || isExpiringSoon(v.pollutionUntil)
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Bus}
        title="Fleet & Compliance"
        titleNe="फ्लीट तथा अनुपालन"
        microModule="M17.01"
        description="Vehicles, drivers and compliance documents — fitness, insurance, permit and pollution."
        actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Vehicle</Button>}
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Bus className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Vehicles</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Bus className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{active}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Bus className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Maintenance</p><p className="text-lg font-bold">{maintenance}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-red-100 p-2 text-red-600"><Bus className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Expiring (30d)</p><p className="text-lg font-bold">{expiring}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search vehicles…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Registration</TableHead><TableHead>Type</TableHead><TableHead>Capacity</TableHead><TableHead>Driver</TableHead><TableHead>Fitness Until</TableHead><TableHead>Insurance Until</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((v) => (<TableRow key={v.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{v.registrationNo}</code></TableCell><TableCell><Badge variant={typeVariant[v.type] ?? "secondary"} className="capitalize">{v.type}</Badge></TableCell><TableCell><span className="text-sm font-mono">{v.capacity}</span></TableCell><TableCell><div className="flex flex-col"><span className="text-sm font-medium">{v.driverName ?? "—"}</span><span className="text-xs text-muted-foreground">{v.driverContact ?? ""}</span></div></TableCell><TableCell><span className={`text-sm ${isExpiringSoon(v.fitnessUntil) ? "text-amber-600 font-medium" : ""}`}>{fmtDate(v.fitnessUntil)}</span></TableCell><TableCell><span className={`text-sm ${isExpiringSoon(v.insuranceUntil) ? "text-amber-600 font-medium" : ""}`}>{fmtDate(v.insuranceUntil)}</span></TableCell><TableCell><Badge variant={statusVariant[v.status] ?? "secondary"} className="capitalize">{v.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(v); setOpen(true); }}><Pencil /> Edit vehicle</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(v)}><Trash2 /> Delete vehicle</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <VehicleFormDialog open={open} onOpenChange={setOpen} vehicle={editing} />
    </div>
  );
}
