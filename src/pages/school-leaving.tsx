import { useMemo, useState } from "react";
import { FileOutput, FileText, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SchoolExitCaseFormDialog } from "@/pages/school-exit-case-form-dialog";
import { useSchoolExitCases, useMigrationDocuments, useDeleteSchoolExitCase, useDeleteMigrationDocument } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { SchoolExitCase, MigrationDocument } from "@/lib/types";

const exitStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", submitted: "info", approved: "info", completed: "success",
};
const docStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "secondary", issued: "success", delivered: "info",
};

export default function SchoolLeavingPage() {
  const cases = useSchoolExitCases();
  const docs = useMigrationDocuments();
  const deleteCase = useDeleteSchoolExitCase();
  const deleteDoc = useDeleteMigrationDocument();
  const [q, setQ] = useState("");
  const [caseOpen, setCaseOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<SchoolExitCase | undefined>();

  const filteredCases = useMemo(() => {
    let list = cases.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.studentName.toLowerCase().includes(s) || c.leavingType.toLowerCase().includes(s) || c.reason.toLowerCase().includes(s) || c.status.toLowerCase().includes(s)); }
    return list;
  }, [cases.data, q]);

  const filteredDocs = useMemo(() => {
    let list = docs.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.documentType.toLowerCase().includes(s) || d.issuedBy.toLowerCase().includes(s) || d.documentNo.toLowerCase().includes(s) || d.status.toLowerCase().includes(s)); }
    return list;
  }, [docs.data, q]);

  const completed = (cases.data ?? []).filter((c) => c.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileOutput}
        title="School Leaving & Migration"
        titleNe="विद्यालय छोड्ने र स्थानान्तरण"
        microModule="M21.06"
        description="Manage school exit cases, transfers and migration documents."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="schoolExitCases">
              <Button variant="outline" onClick={() => { setEditingCase(undefined); setCaseOpen(true); }}><Plus className="h-4 w-4" /> New Exit Case</Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileOutput className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Exit Cases</p><p className="text-lg font-bold">{cases.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FileOutput className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completed}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Migration Docs</p><p className="text-lg font-bold">{docs.data?.length ?? 0}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search cases or documents…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>

      <Tabs defaultValue="cases">
        <TabsList><TabsTrigger value="cases">Exit Cases</TabsTrigger><TabsTrigger value="documents">Migration Documents</TabsTrigger></TabsList>

        <TabsContent value="cases" className="mt-4">
          {cases.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Type</TableHead><TableHead>Last Working Date</TableHead><TableHead>Reason</TableHead><TableHead>Clearance</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredCases.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5 font-medium">{c.studentName}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{c.leavingType}</Badge></TableCell><TableCell><span className="text-sm font-mono">{c.lastWorkingDate.slice(0, 10)}</span></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{c.reason}</span></TableCell><TableCell><Badge variant={c.clearanceStatus === "cleared" ? "success" : "secondary"} className="capitalize">{c.clearanceStatus}</Badge></TableCell><TableCell><Badge variant={exitStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="schoolExitCases" onEdit={() => { setEditingCase(c); setCaseOpen(true); }} onDelete={() => deleteCase.mutate(c)} editLabel="Edit case" deleteLabel="Delete case" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          {docs.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Exit Case Ref</TableHead><TableHead>Document Type</TableHead><TableHead>Document No.</TableHead><TableHead>Issued By</TableHead><TableHead>Issue Date</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredDocs.map((d) => (<TableRow key={d.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{d.exitCaseRef.slice(0, 8)}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{d.documentType.replace("_", " ")}</Badge></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{d.documentNo}</code></TableCell><TableCell>{d.issuedBy}</TableCell><TableCell><span className="text-sm font-mono">{d.issueDate.slice(0, 10)}</span></TableCell><TableCell><Badge variant={docStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="migrationDocuments" onEdit={() => {}} onDelete={() => deleteDoc.mutate(d)} editLabel="Edit document" deleteLabel="Delete document" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <SchoolExitCaseFormDialog open={caseOpen} onOpenChange={setCaseOpen} exitCase={editingCase} />
    </div>
  );
}
