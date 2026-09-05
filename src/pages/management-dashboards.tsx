import { useMemo, useState } from "react";
import { LayoutDashboard, PieChart, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { DashboardFormDialog } from "@/pages/dashboard-form-dialog";
import { useDashboards, useDashboardWidgets, useDeleteDashboard, useDeleteDashboardWidget } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { Dashboard, DashboardWidget } from "@/lib/types";

const dashStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  draft: "default", published: "success", archived: "info",
};

export default function ManagementDashboardsPage() {
  const dashQuery = useDashboards();
  const widgetQuery = useDashboardWidgets();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Dashboard | DashboardWidget | undefined>();
  const [dialogType, setDialogType] = useState<"dashboard" | "widget">("dashboard");

  const filteredDash = useMemo(() => {
    let list = dashQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.name.toLowerCase().includes(s) || d.code.toLowerCase().includes(s)); }
    return list;
  }, [dashQuery.data, q]);

  const filteredWidget = useMemo(() => {
    let list = widgetQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((w) => w.name.toLowerCase().includes(s) || w.dashboardName.toLowerCase().includes(s)); }
    return list;
  }, [widgetQuery.data, q]);

  const totalDash = dashQuery.data?.length ?? 0;
  const publishedDash = (dashQuery.data ?? []).filter((d) => d.status === "published").length;
  const totalWidget = widgetQuery.data?.length ?? 0;
  const activeWidget = (widgetQuery.data ?? []).filter((w) => w.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LayoutDashboard}
        title="Management Dashboards"
        titleNe="व्यवस्थापन ड्यासबोर्ड"
        microModule="M24.02"
        description="Create and manage dashboards and widgets for different personas."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="dashboards"><Button onClick={() => { setEditing(undefined); setDialogType("dashboard"); setOpen(true); }}><Plus className="h-4 w-4" /> New Dashboard</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><LayoutDashboard className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Dashboards</p><p className="text-lg font-bold">{totalDash}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><PieChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{publishedDash}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><PieChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Widgets</p><p className="text-lg font-bold">{totalWidget}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><LayoutDashboard className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Widgets</p><p className="text-lg font-bold">{activeWidget}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search dashboards…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="dashboards">
        <TabsList>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboards" className="mt-4">
          {dashQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Layout</TableHead><TableHead>Owner</TableHead><TableHead>Default</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredDash.map((d) => (<TableRow key={d.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{d.code}</code></TableCell><TableCell><span className="font-medium">{d.name}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{d.layout}</Badge></TableCell><TableCell><span className="text-sm">{d.ownerName || d.ownerRef}</span></TableCell><TableCell><Badge variant={d.isDefault ? "success" : "secondary"}>{d.isDefault ? "Yes" : "No"}</Badge></TableCell><TableCell><Badge variant={dashStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="dashboards" onEdit={() => { setEditing(d); setDialogType("dashboard"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="widgets" className="mt-4">
          {widgetQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Dashboard</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Size</TableHead><TableHead>Report</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredWidget.map((w) => (<TableRow key={w.id} className="group"><TableCell className="pl-5"><span className="text-sm">{w.dashboardName}</span></TableCell><TableCell><span className="font-medium">{w.name}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{w.type}</Badge></TableCell><TableCell><Badge variant="secondary" className="capitalize">{w.size}</Badge></TableCell><TableCell><span className="text-sm">{w.reportName || "—"}</span></TableCell><TableCell><Badge variant={w.status === "active" ? "success" : "secondary"} className="capitalize">{w.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="dashboardWidgets" onEdit={() => { setEditing(w); setDialogType("widget"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <DashboardFormDialog open={open} onOpenChange={setOpen} editing={editing} dialogType={dialogType} />
    </div>
  );
}
