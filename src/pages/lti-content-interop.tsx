import { useMemo, useState } from "react";
import { Plug, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { LTIToolFormDialog } from "@/pages/lti-tool-form-dialog";
import { ContentImportFormDialog } from "@/pages/content-import-form-dialog";
import { useLTITools, useContentImports, useDeleteLTITool, useDeleteContentImport } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { LTITool, ContentImport } from "@/lib/types";

const ltiStatusVariant: Record<string, "success" | "secondary" | "warning"> = {
  active: "success", inactive: "secondary", pending_config: "warning",
};

const importStatusVariant: Record<string, "warning" | "info" | "success" | "destructive"> = {
  pending: "warning", processing: "info", completed: "success", failed: "destructive",
};

export default function LtiContentInteropPage() {
  const ltiTools = useLTITools();
  const imports = useContentImports();
  const deleteLTITool = useDeleteLTITool();
  const deleteImport = useDeleteContentImport();
  const [q, setQ] = useState("");
  const [ltiOpen, setLtiOpen] = useState(false);
  const [editingLti, setEditingLti] = useState<LTITool | undefined>();
  const [importOpen, setImportOpen] = useState(false);
  const [editingImport, setEditingImport] = useState<ContentImport | undefined>();

  const filteredTools = useMemo(() => {
    const list = ltiTools.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((t: LTITool) => t.name.toLowerCase().includes(s) || t.vendor.toLowerCase().includes(s));
  }, [ltiTools.data, q]);

  const filteredImports = useMemo(() => {
    const list = imports.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((i: ContentImport) => i.fileName.toLowerCase().includes(s) || i.sourceType.toLowerCase().includes(s));
  }, [imports.data, q]);

  const activeTools = (ltiTools.data ?? []).filter((t) => t.status === "active").length;
  const completedImports = (imports.data ?? []).filter((i) => i.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Plug}
        title="LTI & Interoperability"
        titleNe="LTI"
        microModule="M10.07"
        description="External tool integrations and content import pipelines."
        actions={<div className="flex gap-2"><CanCreate resource="ltiTools"><Button variant="outline" onClick={() => { setEditingLti(undefined); setLtiOpen(true); }}><Plus className="h-4 w-4" /> New LTI Tool</Button></CanCreate><CanCreate resource="ltiTools"><Button onClick={() => { setEditingImport(undefined); setImportOpen(true); }}><Plus className="h-4 w-4" /> New Import</Button></CanCreate></div>}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Plug className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">LTI Tools</p><p className="text-lg font-bold">{ltiTools.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Plug className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Tools</p><p className="text-lg font-bold">{activeTools}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Plug className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed Imports</p><p className="text-lg font-bold">{completedImports}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search tools or imports…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="tools">
        <TabsList><TabsTrigger value="tools">LTI Tools</TabsTrigger><TabsTrigger value="imports">Content Imports</TabsTrigger></TabsList>

        <TabsContent value="tools" className="mt-4">
          {ltiTools.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Vendor</TableHead><TableHead>Launch URL</TableHead><TableHead>Version</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredTools.map((t) => (
              <TableRow key={t.id} className="group">
                <TableCell className="pl-5 font-medium">{t.name}</TableCell>
                <TableCell className="text-sm">{t.vendor}</TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">{t.launchUrl}</TableCell>
                <TableCell><span className="text-sm font-mono">{t.version}</span></TableCell>
                <TableCell><Badge variant={ltiStatusVariant[t.status] ?? "secondary"} className="capitalize">{t.status.replace("_", " ")}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="ltiTools" onEdit={() => { setEditingLti(t); setLtiOpen(true); }} onDelete={() => deleteLTITool.mutate(t)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="imports" className="mt-4">
          {imports.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">File</TableHead><TableHead>Source Type</TableHead><TableHead>Imported By</TableHead><TableHead>Items</TableHead><TableHead>Errors</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredImports.map((i) => (
              <TableRow key={i.id} className="group">
                <TableCell className="pl-5 font-medium">{i.fileName}</TableCell>
                <TableCell><Badge variant="secondary" className="uppercase">{i.sourceType.replace("_", " ")}</Badge></TableCell>
                <TableCell className="text-sm">{i.importedBy}</TableCell>
                <TableCell><span className="text-sm font-mono">{i.itemCount}</span></TableCell>
                <TableCell className="text-sm max-w-[150px] truncate">{i.errors}</TableCell>
                <TableCell><Badge variant={importStatusVariant[i.status] ?? "secondary"} className="capitalize">{i.status}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="ltiTools" onEdit={() => { setEditingImport(i); setImportOpen(true); }} onDelete={() => deleteImport.mutate(i)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <LTIToolFormDialog open={ltiOpen} onOpenChange={setLtiOpen} editing={editingLti} />
      <ContentImportFormDialog open={importOpen} onOpenChange={setImportOpen} editing={editingImport} />
    </div>
  );
}
