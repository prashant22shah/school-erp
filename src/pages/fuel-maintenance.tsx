import { useMemo, useState } from "react";
import { Wrench, Search, Fuel, CalendarClock, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { VehicleMaintenanceFormDialog } from "@/pages/vehicle-maintenance-form-dialog";
import { useVehicleMaintenance, useDeleteVehicleMaintenance } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { VehicleMaintenance } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  scheduled: "info",
  in_progress: "warning",
  completed: "success",
  cancelled: "destructive",
};

const typeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  fuel: "info",
  service: "secondary",
  repair: "warning",
  inspection: "success",
  tyre: "purple",
  other: "default",
};

const mockParts = [
  { id: "p1", name: "Engine Oil (5W-30)", sku: "OIL-5W30-4L", stock: 24, minStock: 10, unitPrice: 2500, supplier: "Nepal Lubricants" },
  { id: "p2", name: "Oil Filter (NF-09)", sku: "FLT-OIL-09", stock: 18, minStock: 8, unitPrice: 650, supplier: "Auto Parts Nepal" },
  { id: "p3", name: "Air Filter (AF-1200)", sku: "FLT-AIR-12", stock: 12, minStock: 5, unitPrice: 800, supplier: "Auto Parts Nepal" },
  { id: "p4", name: "Brake Pad Set (Front)", sku: "BRK-FRONT-01", stock: 6, minStock: 4, unitPrice: 3200, supplier: "Heavy Vehicle Parts" },
  { id: "p5", name: "Diesel Fuel Filter", sku: "FLT-DIES-01", stock: 15, minStock: 6, unitPrice: 750, supplier: "Nepal Lubricants" },
  { id: "p6", name: "Coolant (Long Life)", sku: "CLN-COOL-5L", stock: 8, minStock: 5, unitPrice: 1800, supplier: "Nepal Lubricants" },
];

const partStockVariant: Record<string, "success" | "warning" | "destructive"> = {
  ok: "success",
  low: "warning",
  critical: "destructive",
};

export default function FuelMaintenancePage() {
  const query = useVehicleMaintenance();
  const del = useDeleteVehicleMaintenance();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VehicleMaintenance | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((m) => (m.vehicleNo ?? "").toLowerCase().includes(s) || m.type.toLowerCase().includes(s) || m.description.toLowerCase().includes(s) || m.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const fuelLogs = (query.data ?? []).filter((m) => m.type === "fuel").length;
  const scheduled = (query.data ?? []).filter((m) => m.status === "scheduled").length;
  const overdue = (query.data ?? []).filter((m) => m.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Wrench}
        title="Fuel & Maintenance"
        titleNe="इन्धन तथा मर्मत"
        microModule="M17.06"
        description="Vehicle fuel logs, maintenance scheduling and parts inventory."
        actions={
          <CanCreate resource="vehicleMaintenance"><Button onClick={() => { setEditing(undefined); setOpen(true); }}>
             New Record
          </Button></CanCreate>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Wrench className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Vehicles</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Fuel className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Fuel This Month</p><p className="text-lg font-bold">{fuelLogs}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CalendarClock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Scheduled Maintenance</p><p className="text-lg font-bold">{scheduled}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-red-100 p-2 text-red-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Overdue</p><p className="text-lg font-bold">{overdue}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by vehicle, type or status…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="fuel">
        <TabsList>
          <TabsTrigger value="fuel">Fuel Log</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
          <TabsTrigger value="parts">Parts & Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="fuel" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Vehicle</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead>Cost (NPR)</TableHead><TableHead>Odometer (km)</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.filter((m) => m.type === "fuel").map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{m.vehicleNo ?? m.vehicleId}</code></TableCell><TableCell><Badge variant={typeVariant[m.type] ?? "secondary"} className="capitalize">{m.type}</Badge></TableCell><TableCell><span className="text-sm">{m.description}</span></TableCell><TableCell><span className="text-sm font-mono">{m.cost.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono">{m.odometerKm?.toLocaleString() ?? "—"}</span></TableCell><TableCell><span className="text-sm">{m.performedOn ? fmtDate(m.performedOn) : "—"}</span></TableCell><TableCell><Badge variant={statusVariant[m.status] ?? "secondary"} className="capitalize">{m.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="vehicleMaintenance" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Vehicle</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead>Cost (NPR)</TableHead><TableHead>Performed</TableHead><TableHead>Next Due</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{m.vehicleNo ?? m.vehicleId}</code></TableCell><TableCell><Badge variant={typeVariant[m.type] ?? "secondary"} className="capitalize">{m.type}</Badge></TableCell><TableCell><span className="text-sm">{m.description}</span></TableCell><TableCell><span className="text-sm font-mono">{m.cost.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{m.performedOn ? fmtDate(m.performedOn) : "—"}</span></TableCell><TableCell><span className="text-sm">{m.nextDueOn ? fmtDate(m.nextDueOn) : "—"}</span></TableCell><TableCell><Badge variant={statusVariant[m.status] ?? "secondary"} className="capitalize">{m.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="vehicleMaintenance" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="parts" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Part Name</TableHead><TableHead>SKU</TableHead><TableHead>Stock</TableHead><TableHead>Min Stock</TableHead><TableHead>Unit Price (NPR)</TableHead><TableHead>Supplier</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{mockParts.map((p) => { const stockStatus = p.stock <= Math.ceil(p.minStock * 0.5) ? "critical" : p.stock <= p.minStock ? "low" : "ok"; return (<TableRow key={p.id}><TableCell className="pl-5"><span className="font-medium">{p.name}</span></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.sku}</code></TableCell><TableCell><span className="text-sm font-mono">{p.stock}</span></TableCell><TableCell><span className="text-sm font-mono">{p.minStock}</span></TableCell><TableCell><span className="text-sm font-mono">NPR {p.unitPrice.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{p.supplier}</span></TableCell><TableCell><Badge variant={partStockVariant[stockStatus]} className="capitalize">{stockStatus}</Badge></TableCell></TableRow>); })}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>

      <VehicleMaintenanceFormDialog open={open} onOpenChange={setOpen} vehicleMaintenance={editing} />
    </div>
  );
}
