import { useMemo, useState } from "react";
import { FileText, Copy, Search, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { DocumentTemplateFormDialog } from "@/pages/document-template-form-dialog";
import { useDocumentTemplates, useDocumentInstances, useDeleteDocumentTemplate, useDeleteDocumentInstance } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { DocumentTemplate, DocumentInstance } from "@/lib/types";

const tplStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  draft: "default", published: "success", archived: "info",
};

export default function DocumentTemplatesPage() {
  const tplQuery = useDocumentTemplates();
  const instQuery = useDocumentInstances();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DocumentTemplate | undefined>();

  const filteredTpl = useMemo(() => {
    let list = tplQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((t) => t.name.toLowerCase().includes(s) || t.code.toLowerCase().includes(s)); }
    return list;
  }, [tplQuery.data, q]);

  const filteredInst = useMemo(() => {
    let list = instQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.businessRef.toLowerCase().includes(s) || i.templateId.toLowerCase().includes(s)); }
    return list;
  }, [instQuery.data, q]);

  const totalTpl = tplQuery.data?.length ?? 0;
  const publishedTpl = (tplQuery.data ?? []).filter((t) => t.status === "published").length;
  const totalInst = instQuery.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Document Templates & Generation"
        titleNe="कागजात ढाँचा तथा उत्पादन"
        microModule="M23.06"
        description="Manage document templates and generated instances."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="documentTemplates"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Template</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Templates</p><p className="text-lg font-bold">{totalTpl}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{publishedTpl}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Copy className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Instances</p><p className="text-lg font-bold">{totalInst}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="instances">Document Instances</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-4">
          {tplQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Version</TableHead><TableHead>Locale</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredTpl.map((t) => (<TableRow key={t.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{t.code}</code></TableCell><TableCell><span className="font-medium">{t.name}</span></TableCell><TableCell><span className="text-sm">v{t.version}</span></TableCell><TableCell><Badge variant="secondary" className="uppercase">{t.locale}</Badge></TableCell><TableCell><Badge variant={tplStatusVariant[t.status] ?? "secondary"} className="capitalize">{t.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="documentTemplates" onEdit={() => { setEditing(t); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="instances" className="mt-4">
          {instQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Template</TableHead><TableHead>Business Ref</TableHead><TableHead>Object Ref</TableHead><TableHead>Content Hash</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredInst.map((i) => (<TableRow key={i.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{i.templateId}</code></TableCell><TableCell><span className="text-sm">{i.businessRef}</span></TableCell><TableCell><span className="text-sm">{i.objectRef}</span></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{i.contentHash.slice(0, 12)}…</code></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="documentInstances" onEdit={() => {}} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <DocumentTemplateFormDialog open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
