import { useMemo, useState } from "react";
import { Shield, AlertTriangle, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CounselingCaseFormDialog } from "@/pages/counseling-case-form-dialog";
import { useCounselingCases, useDeleteCounselingCase } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { CounselingCase, SafeguardingAction } from "@/lib/types";

const caseStatusVariant: Record<string, "default" | "info" | "warning" | "destructive"> = {
  open: "info", in_progress: "default", closed: "warning", escalated: "destructive",
};

const caseSeverityVariant: Record<string, "default" | "info" | "warning" | "destructive"> = {
  low: "default", medium: "info", high: "warning", critical: "destructive",
};

const safeguardingStatusVariant: Record<string, "default" | "info" | "warning" | "destructive"> = {
  pending: "default", in_progress: "info", completed: "warning", overdue: "destructive",
};

const mockSafeguardingActions: SafeguardingAction[] = [
  { id: "sa1", caseRef: "CASE-001", actionType: "referral", description: "Referred to external child protection services", dueDate: "2082-07-01", assignedTo: "Suman Karki", status: "completed", createdOn: "2082-06-15" },
  { id: "sa2", caseRef: "CASE-002", actionType: "safety_plan", description: "Developed safety plan for at-risk student", dueDate: "2082-07-10", assignedTo: "Rita Shrestha", status: "in_progress", createdOn: "2082-06-20" },
  { id: "sa3", caseRef: "CASE-001", actionType: "meeting", description: "Parent-teacher-administration meeting scheduled", dueDate: "2082-06-28", assignedTo: "Principal", status: "completed", createdOn: "2082-06-18" },
  { id: "sa4", caseRef: "CASE-003", actionType: "escalation", description: "Escalated to district education officer", dueDate: "2082-06-25", assignedTo: "Suman Karki", status: "overdue", createdOn: "2082-06-10" },
];

export default function CounselingSafeguardingPage() {
  const cases = useCounselingCases();
  const deleteCase = useDeleteCounselingCase();
  const [q, setQ] = useState("");
  const [caseOpen, setCaseOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<CounselingCase | undefined>();

  const filteredCases = useMemo(() => {
    let list = cases.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.studentName.toLowerCase().includes(s) || c.caseType.toLowerCase().includes(s) || c.assignedTo.toLowerCase().includes(s)); }
    return list;
  }, [cases.data, q]);

  const openCases = (cases.data ?? []).filter((c) => c.status === "open" || c.status === "in_progress").length;
  const escalatedCases = (cases.data ?? []).filter((c) => c.status === "escalated").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Shield}
        title="Counseling & Safeguarding"
        titleNe="परामर्श तथा सुरक्षा"
        microModule="M19.02 / M19.03"
        description="Counseling cases, safeguarding actions and case notes."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="counselingCases"><Button variant="outline" onClick={() => { setEditingCase(undefined); setCaseOpen(true); }}><Plus className="h-4 w-4" /> New Counseling Case</Button></CanCreate>
            <CanCreate resource="safeguardingActions"><Button onClick={() => { setEditingCase(undefined); setCaseOpen(true); }}><Plus className="h-4 w-4" /> New Safeguarding Action</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Shield className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Cases</p><p className="text-lg font-bold">{cases.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Shield className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open / In Progress</p><p className="text-lg font-bold">{openCases}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Escalated</p><p className="text-lg font-bold">{escalatedCases}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-rose-100 p-2 text-rose-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Safeguarding Actions</p><p className="text-lg font-bold">{mockSafeguardingActions.length}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cases by student, type, or assignee…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="cases">
        <TabsList>
          <TabsTrigger value="cases">Counseling Cases</TabsTrigger>
          <TabsTrigger value="safeguarding">Safeguarding Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="mt-4">
          {cases.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Type</TableHead><TableHead>Severity</TableHead><TableHead>Assigned To</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredCases.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><span className="font-medium">{c.studentName}</span><br /><span className="text-xs text-muted-foreground">{c.studentRef}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{c.caseType}</Badge></TableCell><TableCell><Badge variant={caseSeverityVariant[c.severity] ?? "secondary"} className="capitalize">{c.severity}</Badge></TableCell><TableCell><span className="text-sm">{c.assignedTo}</span></TableCell><TableCell><span className="text-sm line-clamp-1 max-w-[200px]">{c.description}</span></TableCell><TableCell><Badge variant={caseStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="counselingCases" onEdit={() => { setEditingCase(c); setCaseOpen(true); }} onDelete={() => deleteCase.mutate(c)} editLabel="Edit case" deleteLabel="Delete case" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="safeguarding" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Case Ref</TableHead><TableHead>Action Type</TableHead><TableHead>Description</TableHead><TableHead>Assigned To</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{mockSafeguardingActions.map((sa) => (<TableRow key={sa.id}><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{sa.caseRef}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{sa.actionType.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm line-clamp-1 max-w-[200px]">{sa.description}</span></TableCell><TableCell><span className="text-sm">{sa.assignedTo}</span></TableCell><TableCell><span className="text-sm">{fmtDate(sa.dueDate)}</span></TableCell><TableCell><Badge variant={safeguardingStatusVariant[sa.status] ?? "secondary"} className="capitalize">{sa.status.replace("_", " ")}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>

      <CounselingCaseFormDialog open={caseOpen} onOpenChange={setCaseOpen} counselingCase={editingCase} />
    </div>
  );
}
