import { useMemo, useState } from "react";
import { Zap, Droplets, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { UtilityMeterFormDialog } from "@/pages/utility-meter-form-dialog";
import { useUtilityMeters, useMeterReadings, useDeleteUtilityMeter, useDeleteMeterReading } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { UtilityMeter, MeterReading } from "@/lib/types";

const utilityTypeVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  electricity: "warning", water: "info", gas: "destructive", internet: "default", telephone: "default", sewage: "info",
};

export default function UtilitiesSustainabilityPage() {
  const meterQuery = useUtilityMeters();
  const readingQuery = useMeterReadings();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UtilityMeter | MeterReading | undefined>();

  const filteredMeters = useMemo(() => {
    let list = meterQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => m.meterNo.toLowerCase().includes(s) || m.location.toLowerCase().includes(s)); }
    return list;
  }, [meterQuery.data, q]);

  const filteredReadings = useMemo(() => {
    let list = readingQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.meterNo.toLowerCase().includes(s) || r.readByName.toLowerCase().includes(s)); }
    return list;
  }, [readingQuery.data, q]);

  const totalMeters = meterQuery.data?.length ?? 0;
  const activeMeters = (meterQuery.data ?? []).filter((m) => m.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Zap}
        title="Utilities & Sustainability"
        titleNe="उपयोगिता तथा दिगोपन"
        microModule="M22.06"
        description="Track utility meters, consumption readings and sustainability metrics."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="utilityMeters"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Utility Meter</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Zap className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Meters</p><p className="text-lg font-bold">{totalMeters}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Droplets className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Meters</p><p className="text-lg font-bold">{activeMeters}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Zap className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Readings</p><p className="text-lg font-bold">{readingQuery.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Droplets className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Recent Readings</p><p className="text-lg font-bold">{(readingQuery.data ?? []).filter((r) => { const d = new Date(r.readingDate); const now = new Date(); return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000; }).length}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search meters, readings…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="meters">
        <TabsList>
          <TabsTrigger value="meters">Utility Meters</TabsTrigger>
          <TabsTrigger value="readings">Meter Readings</TabsTrigger>
        </TabsList>

        <TabsContent value="meters" className="mt-4">
          {meterQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Location</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredMeters.map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5"><span className="font-medium">{m.meterNo}</span></TableCell><TableCell><span className="text-sm">{m.location}</span></TableCell><TableCell><Badge variant={utilityTypeVariant[m.utilityType] ?? "secondary"} className="capitalize">{m.utilityType}</Badge></TableCell><TableCell><Badge variant={m.status === "active" ? "success" : m.status === "faulty" ? "destructive" : "default"} className="capitalize">{m.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="utilityMeters" onEdit={() => { setEditing(m); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="readings" className="mt-4">
          {readingQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Meter</TableHead><TableHead>Captured</TableHead><TableHead>Value</TableHead><TableHead>Source</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredReadings.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.meterNo}</code></TableCell><TableCell><span className="text-sm">{fmtDate(r.readingDate)}</span></TableCell><TableCell><span className="text-sm">{r.readingValue.toLocaleString()} {r.utilityType === "electricity" ? "kWh" : r.utilityType === "water" ? "L" : "m³"}</span></TableCell><TableCell><Badge variant="secondary">{r.readBy || "—"}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="meterReadings" onEdit={() => { setEditing(r); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <UtilityMeterFormDialog open={open} onOpenChange={setOpen} editing={editing as UtilityMeter} />
    </div>
  );
}
