import { useMemo, useState } from "react";
import { Archive, Shield, Search, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { RecordDeclarationFormDialog } from "@/pages/record-declaration-form-dialog";
import { useRecordDeclarations, useRetentionAssignments, useDeleteRecordDeclaration, useDeleteRetentionAssignment } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { RecordDeclaration, RetentionAssignment } from "@/lib/types";

const classificationVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  public: "success", internal: "info", confidential: "warning", restricted: "destructive",
};

export default function RecordsRetentionPage() {
  const recQuery = useRecordDeclarations();
  const retQuery = useRetentionAssignments();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RecordDeclaration | undefined>();

  const filteredRec = useMemo(() => {
    let list = recQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.documentId.toLowerCase().includes(s) || r.classification.toLowerCase().includes(s)); }
    return list;
  }, [recQuery.data, q]);

  const filteredRet = useMemo(() => {
    let list = retQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.recordId.toLowerCase().includes(s) || r.scheduleRef.toLowerCase().includes(s)); }
    return list;
  }, [retQuery.data, q]);

  const totalRec = recQuery.data?.length ?? 0;
  const confidentialRec = (recQuery.data ?? []).filter((r) => r.classification === "confidential" || r.classification === "restricted").length;
  const totalRet = retQuery.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Archive}
        title="Records, Retention & Legal Hold"
        titleNe="अभिलेख, संरक्षण तथा कानुनी होल्ड"
        microModule="M23.08"
        description="Manage record declarations, retention schedules and legal holds."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="recordDeclarations"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Declaration</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Archive className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Declarations</p><p className="text-lg font-bold">{totalRec}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Shield className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Confidential / Restricted</p><p className="text-lg font-bold">{confidentialRec}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Retention Assignments</p><p className="text-lg font-bold">{totalRet}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search records…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="declarations">
        <TabsList>
          <TabsTrigger value="declarations">Record Declarations</TabsTrigger>
          <TabsTrigger value="retention">Retention Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="declarations" className="mt-4">
          {recQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Document</TableHead><TableHead>Classification</TableHead><TableHead>Declared At</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRec.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.documentId}</code></TableCell><TableCell><Badge variant={classificationVariant[r.classification] ?? "secondary"} className="capitalize">{r.classification}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(r.declaredAt)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="recordDeclarations" onEdit={() => { setEditing(r); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="retention" className="mt-4">
          {retQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Record</TableHead><TableHead>Schedule</TableHead><TableHead>Disposition At</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRet.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.recordId}</code></TableCell><TableCell><span className="text-sm">{r.scheduleRef}</span></TableCell><TableCell><span className="text-sm">{fmtDate(r.dispositionAt)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="retentionAssignments" onEdit={() => {}} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <RecordDeclarationFormDialog open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
