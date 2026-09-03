import { useMemo, useState } from "react";
import { Route, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { TransportRouteFormDialog } from "@/pages/transport-route-form-dialog";
import { BusStopFormDialog } from "@/pages/bus-stop-form-dialog";
import { RouteScheduleFormDialog } from "@/pages/route-schedule-form-dialog";
import { useTransportRoutes, useBusStops, useRouteSchedules, useDeleteTransportRoute, useDeleteBusStop, useDeleteRouteSchedule } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { TransportRoute, BusStop, RouteSchedule } from "@/lib/types";

const routeStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success",
  inactive: "secondary",
  archived: "warning",
};

const stopStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success",
  inactive: "secondary",
};

const scheduleStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  active: "success",
  suspended: "warning",
  cancelled: "destructive",
};

const directionVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pickup: "info",
  drop: "warning",
  both: "secondary",
};

export default function TransportRoutesPage() {
  const routes = useTransportRoutes();
  const stops = useBusStops();
  const schedules = useRouteSchedules();
  const deleteRoute = useDeleteTransportRoute();
  const deleteStop = useDeleteBusStop();
  const deleteSchedule = useDeleteRouteSchedule();
  const [q, setQ] = useState("");
  const [routeOpen, setRouteOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | undefined>();
  const [stopOpen, setStopOpen] = useState(false);
  const [editingStop, setEditingStop] = useState<BusStop | undefined>();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<RouteSchedule | undefined>();

  const filteredRoutes = useMemo(() => {
    let list = routes.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.code.toLowerCase().includes(s) || r.name.toLowerCase().includes(s) || r.direction.toLowerCase().includes(s) || r.status.toLowerCase().includes(s) || (r.vehicleNo ?? "").toLowerCase().includes(s));
    }
    return list;
  }, [routes.data, q]);

  const filteredStops = useMemo(() => {
    let list = stops.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(s) || (b.routeName ?? "").toLowerCase().includes(s) || b.status.toLowerCase().includes(s));
    }
    return list;
  }, [stops.data, q]);

  const filteredSchedules = useMemo(() => {
    let list = schedules.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => (r.routeName ?? "").toLowerCase().includes(s) || r.dayPattern.toLowerCase().includes(s) || r.status.toLowerCase().includes(s));
    }
    return list;
  }, [schedules.data, q]);

  const activeRoutes = (routes.data ?? []).filter((r) => r.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Route}
        title="Routes, Stops & Schedules"
        titleNe="मार्ग, स्टप र तालिका"
        microModule="M17.02"
        description="Transport routes, bus stops and daily schedules."
        actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { setEditingRoute(undefined); setRouteOpen(true); }}><Plus className="h-4 w-4" /> New Route</Button><Button variant="outline" onClick={() => { setEditingStop(undefined); setStopOpen(true); }}><Plus className="h-4 w-4" /> New Stop</Button><Button onClick={() => { setEditingSchedule(undefined); setScheduleOpen(true); }}><Plus className="h-4 w-4" /> New Schedule</Button></div>}
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Route className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Routes</p><p className="text-lg font-bold">{routes.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Route className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Routes</p><p className="text-lg font-bold">{activeRoutes}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Route className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Bus Stops</p><p className="text-lg font-bold">{stops.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Route className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Schedules</p><p className="text-lg font-bold">{schedules.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search routes, stops or schedules…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="routes">
        <TabsList><TabsTrigger value="routes">Routes</TabsTrigger><TabsTrigger value="stops">Stops</TabsTrigger><TabsTrigger value="schedules">Schedules</TabsTrigger></TabsList>

        <TabsContent value="routes" className="mt-4">
          {routes.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Direction</TableHead><TableHead>Vehicle</TableHead><TableHead>Distance</TableHead><TableHead>Est. Mins</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRoutes.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.code}</code></TableCell><TableCell className="font-medium">{r.name}</TableCell><TableCell><Badge variant={directionVariant[r.direction] ?? "secondary"} className="capitalize">{r.direction}</Badge></TableCell><TableCell><span className="text-sm">{r.vehicleNo ?? "—"}</span></TableCell><TableCell><span className="text-sm font-mono">{r.totalDistanceKm} km</span></TableCell><TableCell><span className="text-sm font-mono">{r.estimatedMins} min</span></TableCell><TableCell><Badge variant={routeStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingRoute(r); setRouteOpen(true); }}><Pencil /> Edit route</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteRoute.mutate(r)}><Trash2 /> Delete route</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="stops" className="mt-4">
          {stops.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Stop Name</TableHead><TableHead>Route</TableHead><TableHead>Sequence</TableHead><TableHead>Arrival</TableHead><TableHead>Coordinates</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredStops.map((b) => (<TableRow key={b.id} className="group"><TableCell className="pl-5 font-medium">{b.name}</TableCell><TableCell><Badge variant="secondary">{b.routeName ?? b.routeId.slice(0, 8)}</Badge></TableCell><TableCell><span className="text-sm font-mono">{b.sequence}</span></TableCell><TableCell><span className="text-sm">{b.arrivalTime ?? "—"}</span></TableCell><TableCell><span className="text-xs text-muted-foreground">{b.latitude != null && b.longitude != null ? `${b.latitude.toFixed(3)}, ${b.longitude.toFixed(3)}` : "—"}</span></TableCell><TableCell><Badge variant={stopStatusVariant[b.status] ?? "secondary"} className="capitalize">{b.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingStop(b); setStopOpen(true); }}><Pencil /> Edit stop</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteStop.mutate(b)}><Trash2 /> Delete stop</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="schedules" className="mt-4">
          {schedules.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Route</TableHead><TableHead>Day Pattern</TableHead><TableHead>Departure</TableHead><TableHead>Arrival</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSchedules.map((s) => (<TableRow key={s.id} className="group"><TableCell className="pl-5"><Badge variant="secondary">{s.routeName ?? s.routeId.slice(0, 8)}</Badge></TableCell><TableCell><span className="text-sm">{s.dayPattern}</span></TableCell><TableCell><span className="text-sm font-mono">{s.departureTime}</span></TableCell><TableCell><span className="text-sm font-mono">{s.arrivalTime}</span></TableCell><TableCell><Badge variant={scheduleStatusVariant[s.status] ?? "secondary"} className="capitalize">{s.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingSchedule(s); setScheduleOpen(true); }}><Pencil /> Edit schedule</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteSchedule.mutate(s)}><Trash2 /> Delete schedule</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <TransportRouteFormDialog open={routeOpen} onOpenChange={setRouteOpen} transportRoute={editingRoute} />
      <BusStopFormDialog open={stopOpen} onOpenChange={setStopOpen} busStop={editingStop} />
      <RouteScheduleFormDialog open={scheduleOpen} onOpenChange={setScheduleOpen} routeSchedule={editingSchedule} />
    </div>
  );
}
