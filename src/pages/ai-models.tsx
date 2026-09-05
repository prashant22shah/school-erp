import { useMemo, useState } from "react";
import { Brain, LineChart, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ModelVersionFormDialog } from "@/pages/model-version-form-dialog";
import { useModelVersions, useModelScores, useDeleteModelVersion, useDeleteModelScore } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { ModelVersion, ModelScore } from "@/lib/types";

const versionStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  training: "warning", ready: "info", deployed: "success", retired: "destructive",
};
const scoreStatusVariant: Record<string, "default" | "info" | "warning" | "success"> = {
  pending: "default", scored: "info", reviewed: "warning", actioned: "success",
};

export default function AiModelsPage() {
  const versionQuery = useModelVersions();
  const scoreQuery = useModelScores();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ModelVersion | ModelScore | undefined>();
  const [dialogType, setDialogType] = useState<"version" | "score">("version");

  const filteredVersion = useMemo(() => {
    let list = versionQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((v) => v.modelName.toLowerCase().includes(s) || v.type.toLowerCase().includes(s)); }
    return list;
  }, [versionQuery.data, q]);

  const filteredScore = useMemo(() => {
    let list = scoreQuery.data ?? [];
    if (q) { const ls = q.toLowerCase(); list = list.filter((sc) => sc.modelName.toLowerCase().includes(ls) || sc.entityType.toLowerCase().includes(ls)); }
    return list;
  }, [scoreQuery.data, q]);

  const totalVersion = versionQuery.data?.length ?? 0;
  const deployedVersion = (versionQuery.data ?? []).filter((v) => v.status === "deployed").length;
  const totalScore = scoreQuery.data?.length ?? 0;
  const actionedScore = (scoreQuery.data ?? []).filter((s) => s.status === "actioned").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Brain}
        title="Academic & Financial Analytics"
        titleNe="शैक्षिक तथा वित्तीय विश्लेषण"
        microModule="M24.05-06"
        description="Manage AI/ML model versions and scoring results for academic and financial analytics."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="modelVersions"><Button onClick={() => { setEditing(undefined); setDialogType("version"); setOpen(true); }}><Plus className="h-4 w-4" /> New Model Version</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Brain className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Model Versions</p><p className="text-lg font-bold">{totalVersion}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><LineChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Deployed</p><p className="text-lg font-bold">{deployedVersion}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><LineChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Scores</p><p className="text-lg font-bold">{totalScore}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Brain className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Actioned</p><p className="text-lg font-bold">{actionedScore}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search models…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="versions">
        <TabsList>
          <TabsTrigger value="versions">Model Versions</TabsTrigger>
          <TabsTrigger value="scores">Model Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="versions" className="mt-4">
          {versionQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Model Name</TableHead><TableHead>Type</TableHead><TableHead>Version</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredVersion.map((v) => (<TableRow key={v.id} className="group"><TableCell className="pl-5"><span className="font-medium">{v.modelName}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{v.type.replace("_", " ")}</Badge></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{v.version}</code></TableCell><TableCell><span className="text-sm">{v.description || "—"}</span></TableCell><TableCell><Badge variant={versionStatusVariant[v.status] ?? "secondary"} className="capitalize">{v.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="modelVersions" onEdit={() => { setEditing(v); setDialogType("version"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="scores" className="mt-4">
          {scoreQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Model</TableHead><TableHead>Entity Type</TableHead><TableHead>Entity Ref</TableHead><TableHead>Score</TableHead><TableHead>Confidence</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredScore.map((s) => (<TableRow key={s.id} className="group"><TableCell className="pl-5"><span className="font-medium">{s.modelName}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{s.entityType}</Badge></TableCell><TableCell><span className="text-sm">{s.entityRef}</span></TableCell><TableCell><span className="text-sm font-mono">{s.scoreValue.toFixed(2)}</span></TableCell><TableCell><span className="text-sm">{(s.confidence * 100).toFixed(0)}%</span></TableCell><TableCell><Badge variant={scoreStatusVariant[s.status] ?? "secondary"} className="capitalize">{s.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="modelScores" onEdit={() => { setEditing(s); setDialogType("score"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ModelVersionFormDialog open={open} onOpenChange={setOpen} editing={editing} dialogType={dialogType} />
    </div>
  );
}
