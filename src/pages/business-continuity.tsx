import { useMemo, useState } from "react";
import { ShieldCheck, Activity, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ContinuityPlanFormDialog } from "@/pages/continuity-plan-form-dialog";
import { useContinuityPlans, useContinuityExercises, useDeleteContinuityPlan, useDeleteContinuityExercise } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { ContinuityPlan, ContinuityExercise } from "@/lib/types";

const planStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  draft: "default", active: "success", under_review: "warning", archived: "info",
};
const exerciseStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  planned: "info", in_progress: "warning", completed: "success", cancelled: "destructive",
};

export default function BusinessContinuityPage() {
  const planQuery = useContinuityPlans();
  const exerciseQuery = useContinuityExercises();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ContinuityPlan | ContinuityExercise | undefined>();

  const filteredPlans = useMemo(() => {
    let list = planQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.title.toLowerCase().includes(s) || p.planType.toLowerCase().includes(s)); }
    return list;
  }, [planQuery.data, q]);

  const filteredExercises = useMemo(() => {
    let list = exerciseQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.exerciseName.toLowerCase().includes(s) || e.planTitle.toLowerCase().includes(s)); }
    return list;
  }, [exerciseQuery.data, q]);

  const totalPlans = planQuery.data?.length ?? 0;
  const activePlans = (planQuery.data ?? []).filter((p) => p.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldCheck}
        title="Business Continuity"
        titleNe="व्यवसाय निरन्तरता"
        microModule="M22.07"
        description="Manage continuity plans, exercises and disaster preparedness."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="continuityPlans"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Continuity Plan</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ShieldCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Plans</p><p className="text-lg font-bold">{totalPlans}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Activity className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Plans</p><p className="text-lg font-bold">{activePlans}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ShieldCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Exercises</p><p className="text-lg font-bold">{exerciseQuery.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Activity className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed Exercises</p><p className="text-lg font-bold">{(exerciseQuery.data ?? []).filter((e) => e.status === "completed").length}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search plans, exercises…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Continuity Plans</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-4">
          {planQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Scenario</TableHead><TableHead>Version</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPlans.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><span className="font-medium">{p.title}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{p.planType.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm">v{p.version}</span></TableCell><TableCell><Badge variant={planStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="continuityPlans" onEdit={() => { setEditing(p); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="exercises" className="mt-4">
          {exerciseQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Plan</TableHead><TableHead>Occurred</TableHead><TableHead>Outcome</TableHead><TableHead>Description</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredExercises.map((e) => (<TableRow key={e.id} className="group"><TableCell className="pl-5"><span className="font-medium">{e.planTitle}</span></TableCell><TableCell><span className="text-sm">{fmtDate(e.scheduledDate)}</span></TableCell><TableCell><Badge variant={exerciseStatusVariant[e.status] ?? "secondary"} className="capitalize">{e.status.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm truncate max-w-[200px] block">{e.findings || e.exerciseName}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="continuityExercises" onEdit={() => { setEditing(e); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ContinuityPlanFormDialog open={open} onOpenChange={setOpen} editing={editing as ContinuityPlan} />
    </div>
  );
}
