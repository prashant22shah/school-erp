import { useMemo, useState } from "react";
import { BookOpen, Layers, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SubjectCombinationRuleFormDialog } from "@/pages/subject-combination-rule-form-dialog";
import { useSubjectCombinationRules, useStudentSubjectPlans, useDeleteSubjectCombinationRule, useDeleteStudentSubjectPlan } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { SubjectCombinationRule, StudentSubjectPlan } from "@/lib/types";

const ruleStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success", inactive: "secondary",
};
const planStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", approved: "info", active: "success", completed: "default",
};

export default function SubjectCombinationsPage() {
  const rules = useSubjectCombinationRules();
  const plans = useStudentSubjectPlans();
  const deleteRule = useDeleteSubjectCombinationRule();
  const deletePlan = useDeleteStudentSubjectPlan();
  const [q, setQ] = useState("");
  const [ruleOpen, setRuleOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SubjectCombinationRule | undefined>();
  const [planOpen, setPlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudentSubjectPlan | undefined>();

  const filteredRules = useMemo(() => {
    let list = rules.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.board.toLowerCase().includes(s) || r.grade.toLowerCase().includes(s) || r.stream.toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [rules.data, q]);

  const filteredPlans = useMemo(() => {
    let list = plans.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.studentName.toLowerCase().includes(s) || p.stream.toLowerCase().includes(s) || p.subjects.toLowerCase().includes(s) || p.status.toLowerCase().includes(s)); }
    return list;
  }, [plans.data, q]);

  const activeRules = (rules.data ?? []).filter((r) => r.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title="Subject Combinations"
        titleNe="विषय संयोजन"
        microModule="M21.01"
        description="Manage streams, electives and subject combination rules for senior secondary students."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="subjectCombinationRules">
              <Button variant="outline" onClick={() => { setEditingRule(undefined); setRuleOpen(true); }}><Plus className="h-4 w-4" /> New Rule</Button>
            </CanCreate>
            <CanCreate resource="studentSubjectPlans">
              <Button onClick={() => { setEditingPlan(undefined); setPlanOpen(true); }}><Plus className="h-4 w-4" /> New Student Plan</Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Combination Rules</p><p className="text-lg font-bold">{rules.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Rules</p><p className="text-lg font-bold">{activeRules}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Layers className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Student Plans</p><p className="text-lg font-bold">{plans.data?.length ?? 0}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search rules or plans…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>

      <Tabs defaultValue="rules">
        <TabsList><TabsTrigger value="rules">Combination Rules</TabsTrigger><TabsTrigger value="plans">Student Plans</TabsTrigger></TabsList>

        <TabsContent value="rules" className="mt-4">
          {rules.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Board</TableHead><TableHead>Grade</TableHead><TableHead>Stream</TableHead><TableHead>Compulsory</TableHead><TableHead>Optional (Max)</TableHead><TableHead>Version</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRules.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.board}</TableCell><TableCell><Badge variant="secondary">{r.grade}</Badge></TableCell><TableCell>{r.stream}</TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{r.compulsorySubjects}</span></TableCell><TableCell><span className="text-sm">{r.optionalSubjects} <span className="text-muted-foreground">(max {r.maxOptional})</span></span></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">v{r.version}</code></TableCell><TableCell><Badge variant={ruleStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="subjectCombinationRules" onEdit={() => { setEditingRule(r); setRuleOpen(true); }} onDelete={() => deleteRule.mutate(r)} editLabel="Edit rule" deleteLabel="Delete rule" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-4">
          {plans.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Stream</TableHead><TableHead>Subjects</TableHead><TableHead>Valid From</TableHead><TableHead>Valid To</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPlans.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5 font-medium">{p.studentName}</TableCell><TableCell><Badge variant="secondary">{p.stream}</Badge></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{p.subjects}</span></TableCell><TableCell><span className="text-sm font-mono">{p.validFrom.slice(0, 10)}</span></TableCell><TableCell><span className="text-sm font-mono">{p.validTo ? p.validTo.slice(0, 10) : "—"}</span></TableCell><TableCell><Badge variant={planStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="studentSubjectPlans" onEdit={() => { setEditingPlan(p); setPlanOpen(true); }} onDelete={() => deletePlan.mutate(p)} editLabel="Edit plan" deleteLabel="Delete plan" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <SubjectCombinationRuleFormDialog open={ruleOpen} onOpenChange={setRuleOpen} rule={editingRule} />
    </div>
  );
}
