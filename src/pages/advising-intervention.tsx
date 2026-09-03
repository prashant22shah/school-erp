import { useMemo, useState } from "react";
import { Users, Target, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { AdvisingAssignmentFormDialog } from "@/pages/advising-assignment-form-dialog";
import { useAdvisingAssignments, useInterventionPlans, useDeleteAdvisingAssignment, useDeleteInterventionPlan } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { AdvisingAssignment, InterventionPlan, InterventionAction } from "@/lib/types";

const advisingStatusVariant: Record<string, "default" | "info" | "success"> = {
  active: "info", completed: "success", transferred: "default",
};

const planStatusVariant: Record<string, "default" | "info" | "warning" | "secondary"> = {
  draft: "secondary", active: "info", completed: "warning", discontinued: "default",
};

const mockInterventionActions: InterventionAction[] = [
  { id: "ia1", planRef: "INT-001", actionType: "meeting", description: "Initial parent meeting to discuss intervention goals", dueDate: "2082-06-15", outcome: "Goals agreed and plan signed", status: "done", createdOn: "2082-06-10" },
  { id: "ia2", planRef: "INT-001", actionType: "assessment", description: "Learning assessment to establish baseline", dueDate: "2082-06-20", outcome: "", status: "done", createdOn: "2082-06-10" },
  { id: "ia3", planRef: "INT-002", actionType: "referral", description: "Refer to external specialist for evaluation", dueDate: "2082-07-01", outcome: "", status: "pending", createdOn: "2082-06-18" },
  { id: "ia4", planRef: "INT-001", actionType: "follow_up", description: "Monthly progress review with teachers", dueDate: "2082-07-15", outcome: "", status: "pending", createdOn: "2082-06-20" },
  { id: "ia5", planRef: "INT-002", actionType: "report", description: "Prepare progress report for review committee", dueDate: "2082-06-25", outcome: "", status: "overdue", createdOn: "2082-06-15" },
];

const interventionActionStatusVariant: Record<string, "default" | "info" | "warning"> = {
  pending: "default", done: "info", overdue: "warning",
};

export default function AdvisingInterventionPage() {
  const assignments = useAdvisingAssignments();
  const plans = useInterventionPlans();
  const deleteAssignment = useDeleteAdvisingAssignment();
  const deletePlan = useDeleteInterventionPlan();
  const [q, setQ] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [editingAssign, setEditingAssign] = useState<AdvisingAssignment | undefined>();
  const [planOpen, setPlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InterventionPlan | undefined>();

  const filteredAssignments = useMemo(() => {
    let list = assignments.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.studentName.toLowerCase().includes(s) || a.advisorName.toLowerCase().includes(s)); }
    return list;
  }, [assignments.data, q]);

  const filteredPlans = useMemo(() => {
    let list = plans.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.studentName.toLowerCase().includes(s) || p.ownerName.toLowerCase().includes(s)); }
    return list;
  }, [plans.data, q]);

  const activeAssignments = (assignments.data ?? []).filter((a) => a.status === "active").length;
  const activePlans = (plans.data ?? []).filter((p) => p.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Advising & Intervention"
        titleNe="सल्लाह तथा हस्तक्षेप"
        microModule="M19.07"
        description="Student advising assignments, intervention plans and action tracking."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="advisingAssignments"><Button variant="outline" onClick={() => { setEditingAssign(undefined); setAssignOpen(true); }}><Plus className="h-4 w-4" /> New Advising Assignment</Button></CanCreate>
            <CanCreate resource="interventionPlans"><Button onClick={() => { setEditingPlan(undefined); setPlanOpen(true); }}><Plus className="h-4 w-4" /> New Intervention Plan</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-cyan-100 p-2 text-cyan-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Advising Assignments</p><p className="text-lg font-bold">{assignments.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Assignments</p><p className="text-lg font-bold">{activeAssignments}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-purple-100 p-2 text-purple-600"><Target className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Intervention Plans</p><p className="text-lg font-bold">{plans.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Target className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Plans</p><p className="text-lg font-bold">{activePlans}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students, advisors, or owners…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">Advising Assignments</TabsTrigger>
          <TabsTrigger value="plans">Intervention Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-4">
          {assignments.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Advisor</TableHead><TableHead>Valid From</TableHead><TableHead>Valid To</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAssignments.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5"><span className="font-medium">{a.studentName}</span><br /><span className="text-xs text-muted-foreground">{a.studentRef}</span></TableCell><TableCell><span className="text-sm">{a.advisorName}</span><br /><span className="text-xs text-muted-foreground">{a.advisorRef}</span></TableCell><TableCell><span className="text-sm">{fmtDate(a.validFrom)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(a.validTo)}</span></TableCell><TableCell><Badge variant={advisingStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="advisingAssignments" onEdit={() => { setEditingAssign(a); setAssignOpen(true); }} onDelete={() => deleteAssignment.mutate(a)} editLabel="Edit assignment" deleteLabel="Delete assignment" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-4">
          {plans.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Reason</TableHead><TableHead>Owner</TableHead><TableHead>Target Date</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPlans.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><span className="font-medium">{p.studentName}</span><br /><span className="text-xs text-muted-foreground">{p.studentRef}</span></TableCell><TableCell><span className="text-sm line-clamp-1 max-w-[180px]">{p.reason}</span></TableCell><TableCell><span className="text-sm">{p.ownerName}</span></TableCell><TableCell><span className="text-sm">{fmtDate(p.targetDate)}</span></TableCell><TableCell><Badge variant={planStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="interventionPlans" onEdit={() => { setEditingPlan(p); setPlanOpen(true); }} onDelete={() => deletePlan.mutate(p)} editLabel="Edit plan" deleteLabel="Delete plan" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <Card className="animate-fade-up">
        <CardContent className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Intervention Actions</h3>
          <Table><TableHeader><TableRow><TableHead className="pl-5">Plan Ref</TableHead><TableHead>Action Type</TableHead><TableHead>Description</TableHead><TableHead>Due Date</TableHead><TableHead>Outcome</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{mockInterventionActions.map((ia) => (<TableRow key={ia.id}><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{ia.planRef}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{ia.actionType.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm line-clamp-1 max-w-[200px]">{ia.description}</span></TableCell><TableCell><span className="text-sm">{fmtDate(ia.dueDate)}</span></TableCell><TableCell><span className="text-sm">{ia.outcome || "—"}</span></TableCell><TableCell><Badge variant={interventionActionStatusVariant[ia.status] ?? "secondary"} className="capitalize">{ia.status}</Badge></TableCell></TableRow>))}</TableBody></Table>
        </CardContent>
      </Card>

      <AdvisingAssignmentFormDialog open={assignOpen} onOpenChange={setAssignOpen} advisingAssignment={editingAssign} />
      <AdvisingAssignmentFormDialog open={planOpen} onOpenChange={setPlanOpen} interventionPlan={editingPlan} />
    </div>
  );
}
