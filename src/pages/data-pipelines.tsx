import { useMemo, useState } from "react";
import { Database, GitBranch, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { DataProductFormDialog } from "@/pages/data-product-form-dialog";
import { useDataProducts, usePipelineRuns, useDataQualityResults, useDeleteDataProduct, useDeletePipelineRun, useDeleteDataQualityResult } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { DataProduct, PipelineRun, DataQualityResult } from "@/lib/types";

const productStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  draft: "default", published: "success", archived: "info",
};
const runStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  queued: "default", running: "warning", completed: "success", failed: "destructive", cancelled: "info",
};
const qualityStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  pass: "success", warn: "warning", fail: "destructive",
};

export default function DataPipelinesPage() {
  const productQuery = useDataProducts();
  const runQuery = usePipelineRuns();
  const qualityQuery = useDataQualityResults();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DataProduct | PipelineRun | DataQualityResult | undefined>();
  const [dialogType, setDialogType] = useState<"product" | "run" | "quality">("product");

  const filteredProduct = useMemo(() => {
    let list = productQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.name.toLowerCase().includes(s) || p.code.toLowerCase().includes(s)); }
    return list;
  }, [productQuery.data, q]);

  const filteredRun = useMemo(() => {
    let list = runQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.pipelineName.toLowerCase().includes(s)); }
    return list;
  }, [runQuery.data, q]);

  const filteredQuality = useMemo(() => {
    let list = qualityQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.datasetName.toLowerCase().includes(s) || d.ruleName.toLowerCase().includes(s)); }
    return list;
  }, [qualityQuery.data, q]);

  const totalProduct = productQuery.data?.length ?? 0;
  const publishedProduct = (productQuery.data ?? []).filter((p) => p.status === "published").length;
  const totalRun = runQuery.data?.length ?? 0;
  const failedRun = (runQuery.data ?? []).filter((r) => r.status === "failed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Database}
        title="Data Warehouse & Pipelines"
        titleNe="डाटा वेयरहाउस तथा पाइपलाइन"
        microModule="M24.04"
        description="Manage data products, pipeline runs and data quality results."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="dataProducts"><Button onClick={() => { setEditing(undefined); setDialogType("product"); setOpen(true); }}><Plus className="h-4 w-4" /> New Data Product</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Database className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Data Products</p><p className="text-lg font-bold">{totalProduct}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><GitBranch className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{publishedProduct}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><GitBranch className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pipeline Runs</p><p className="text-lg font-bold">{totalRun}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Database className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Failed Runs</p><p className="text-lg font-bold">{failedRun}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search data products, pipelines…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Data Products</TabsTrigger>
          <TabsTrigger value="runs">Pipeline Runs</TabsTrigger>
          <TabsTrigger value="quality">Quality Results</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-4">
          {productQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Domain</TableHead><TableHead>Owner</TableHead><TableHead>SLA</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredProduct.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.code}</code></TableCell><TableCell><span className="font-medium">{p.name}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{p.domain}</Badge></TableCell><TableCell><span className="text-sm">{p.ownerName || p.ownerRef}</span></TableCell><TableCell><span className="text-sm">{p.sla || "—"}</span></TableCell><TableCell><Badge variant={productStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="dataProducts" onEdit={() => { setEditing(p); setDialogType("product"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="runs" className="mt-4">
          {runQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Pipeline</TableHead><TableHead>Type</TableHead><TableHead>Trigger</TableHead><TableHead>Rows Read</TableHead><TableHead>Duration</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRun.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><span className="font-medium">{r.pipelineName}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{r.type}</Badge></TableCell><TableCell><span className="text-sm">{r.trigger}</span></TableCell><TableCell><span className="text-sm">{r.rowsRead.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{r.durationMs ? `${(r.durationMs / 1000).toFixed(1)}s` : "—"}</span></TableCell><TableCell><Badge variant={runStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="pipelineRuns" onEdit={() => { setEditing(r); setDialogType("run"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="quality" className="mt-4">
          {qualityQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Dataset</TableHead><TableHead>Rule</TableHead><TableHead>Dimension</TableHead><TableHead>Score</TableHead><TableHead>Threshold</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredQuality.map((d) => (<TableRow key={d.id} className="group"><TableCell className="pl-5"><span className="font-medium">{d.datasetName}</span></TableCell><TableCell><span className="text-sm">{d.ruleName}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{d.dimension}</Badge></TableCell><TableCell><span className="text-sm">{d.score.toFixed(1)}%</span></TableCell><TableCell><span className="text-sm">{d.threshold.toFixed(1)}%</span></TableCell><TableCell><Badge variant={qualityStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="dataQualityResults" onEdit={() => { setEditing(d); setDialogType("quality"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <DataProductFormDialog open={open} onOpenChange={setOpen} editing={editing} dialogType={dialogType} />
    </div>
  );
}
