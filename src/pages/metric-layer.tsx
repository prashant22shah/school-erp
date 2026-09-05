import { useMemo, useState } from "react";
import { Binary, Layers, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { MetricDefinitionFormDialog } from "@/pages/metric-definition-form-dialog";
import { useMetricDefinitions, useSemanticDimensions, useReportAccessPolicies, useReportCatalogEntries, useDeleteMetricDefinition, useDeleteSemanticDimension, useDeleteReportAccessPolicy, useDeleteReportCatalogEntry } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { MetricDefinition, SemanticDimension, ReportAccessPolicy, ReportCatalogEntry } from "@/lib/types";

const metricStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  draft: "default", published: "success", archived: "info",
};
const accessStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  active: "success", inactive: "info",
};
const catalogStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  listed: "success", deprecated: "warning", retired: "destructive",
};

export default function MetricLayerPage() {
  const metricQuery = useMetricDefinitions();
  const dimQuery = useSemanticDimensions();
  const policyQuery = useReportAccessPolicies();
  const catalogQuery = useReportCatalogEntries();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MetricDefinition | SemanticDimension | ReportAccessPolicy | ReportCatalogEntry | undefined>();
  const [dialogType, setDialogType] = useState<"metric" | "dimension" | "policy" | "catalog">("metric");

  const filteredMetric = useMemo(() => {
    let list = metricQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => m.name.toLowerCase().includes(s) || m.code.toLowerCase().includes(s)); }
    return list;
  }, [metricQuery.data, q]);

  const filteredDim = useMemo(() => {
    let list = dimQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.name.toLowerCase().includes(s) || d.code.toLowerCase().includes(s)); }
    return list;
  }, [dimQuery.data, q]);

  const filteredPolicy = useMemo(() => {
    let list = policyQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.reportName.toLowerCase().includes(s) || p.roleName.toLowerCase().includes(s)); }
    return list;
  }, [policyQuery.data, q]);

  const filteredCatalog = useMemo(() => {
    let list = catalogQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.reportName.toLowerCase().includes(s) || c.ownerName.toLowerCase().includes(s)); }
    return list;
  }, [catalogQuery.data, q]);

  const totalMetric = metricQuery.data?.length ?? 0;
  const totalDim = dimQuery.data?.length ?? 0;
  const totalPolicy = policyQuery.data?.length ?? 0;
  const totalCatalog = catalogQuery.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Binary}
        title="Metric & Semantic Layer"
        titleNe="मेट्रिक र सिमान्टिक तह"
        microModule="M24.03"
        description="Manage metric definitions, semantic dimensions, access policies and catalog entries."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="metricDefinitions"><Button onClick={() => { setEditing(undefined); setDialogType("metric"); setOpen(true); }}><Plus className="h-4 w-4" /> New Metric</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Binary className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Metric Definitions</p><p className="text-lg font-bold">{totalMetric}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Layers className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Dimensions</p><p className="text-lg font-bold">{totalDim}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Binary className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Access Policies</p><p className="text-lg font-bold">{totalPolicy}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Layers className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Catalog Entries</p><p className="text-lg font-bold">{totalCatalog}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search metrics, dimensions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="metrics">
        <TabsList>
          <TabsTrigger value="metrics">Metric Definitions</TabsTrigger>
          <TabsTrigger value="dimensions">Semantic Dimensions</TabsTrigger>
          <TabsTrigger value="policies">Access Policies</TabsTrigger>
          <TabsTrigger value="catalog">Catalog Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="mt-4">
          {metricQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Aggregation</TableHead><TableHead>Frequency</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredMetric.map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{m.code}</code></TableCell><TableCell><span className="font-medium">{m.name}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{m.category}</Badge></TableCell><TableCell><span className="text-sm">{m.aggregationType}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{m.frequency}</Badge></TableCell><TableCell><Badge variant={metricStatusVariant[m.status] ?? "secondary"} className="capitalize">{m.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="metricDefinitions" onEdit={() => { setEditing(m); setDialogType("metric"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="dimensions" className="mt-4">
          {dimQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Source Field</TableHead><TableHead>Hierarchy</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredDim.map((d) => (<TableRow key={d.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{d.code}</code></TableCell><TableCell><span className="font-medium">{d.name}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{d.type}</Badge></TableCell><TableCell><span className="text-sm">{d.sourceField}</span></TableCell><TableCell><span className="text-sm">{d.hierarchyLevels || "—"}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="semanticDimensions" onEdit={() => { setEditing(d); setDialogType("dimension"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          {policyQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Report</TableHead><TableHead>Role</TableHead><TableHead>Access Level</TableHead><TableHead>Valid From</TableHead><TableHead>Valid To</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPolicy.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><span className="font-medium">{p.reportName}</span></TableCell><TableCell><span className="text-sm">{p.roleName}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{p.accessLevel}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(p.validFrom)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(p.validTo)}</span></TableCell><TableCell><Badge variant={accessStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="reportAccessPolicies" onEdit={() => { setEditing(p); setDialogType("policy"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="catalog" className="mt-4">
          {catalogQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Report</TableHead><TableHead>Version</TableHead><TableHead>Owner</TableHead><TableHead>Dependencies</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredCatalog.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><span className="font-medium">{c.reportName}</span></TableCell><TableCell><span className="text-sm">v{c.version}</span></TableCell><TableCell><span className="text-sm">{c.ownerName || c.ownerRef}</span></TableCell><TableCell><span className="text-sm">{c.dependencies || "—"}</span></TableCell><TableCell><Badge variant={catalogStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="reportCatalogEntries" onEdit={() => { setEditing(c); setDialogType("catalog"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <MetricDefinitionFormDialog open={open} onOpenChange={setOpen} editing={editing} dialogType={dialogType} />
    </div>
  );
}

function fmtDate(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
