import { useMemo, useState } from "react";
import { Accessibility, FileText, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SupportNeedFormDialog } from "@/pages/support-need-form-dialog";
import { useSupportNeeds, useAccommodationPlans, useDeleteSupportNeed, useDeleteAccommodationPlan } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { SupportNeed, AccommodationPlan } from "@/lib/types";

const needStatusVariant: Record<string, "default" | "info" | "success"> = {
  identified: "default", active: "info", resolved: "success",
};

const planStatusVariant: Record<string, "default" | "info" | "warning" | "secondary"> = {
  draft: "secondary", approved: "info", active: "warning", expired: "default",
};

export default function SpecialEducationPage() {
  const needs = useSupportNeeds();
  const plans = useAccommodationPlans();
  const deleteNeed = useDeleteSupportNeed();
  const deletePlan = useDeleteAccommodationPlan();
  const [q, setQ] = useState("");
  const [needOpen, setNeedOpen] = useState(false);
  const [editingNeed, setEditingNeed] = useState<SupportNeed | undefined>();
  const [planOpen, setPlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AccommodationPlan | undefined>();

  const filteredNeeds = useMemo(() => {
    let list = needs.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((n) => n.studentName.toLowerCase().includes(s) || n.category.toLowerCase().includes(s)); }
    return list;
  }, [needs.data, q]);

  const filteredPlans = useMemo(() => {
    let list = plans.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.studentName.toLowerCase().includes(s) || p.approvedBy.toLowerCase().includes(s)); }
    return list;
  }, [plans.data, q]);

  const activeNeeds = (needs.data ?? []).filter((n) => n.status === "active").length;
  const activePlans = (plans.data ?? []).filter((p) => p.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Accessibility}
        title="Special Education & Accommodations"
        titleNe="विशेष शिक्षा तथा समायोजन"
        microModule="M19.04"
        description="Student support needs, accommodation plans and individualised education."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="supportNeeds"><Button variant="outline" onClick={() => { setEditingNeed(undefined); setNeedOpen(true); }}><Plus className="h-4 w-4" /> New Support Need</Button></CanCreate>
            <CanCreate resource="accommodationPlans"><Button onClick={() => { setEditingPlan(undefined); setPlanOpen(true); }}><Plus className="h-4 w-4" /> New Accommodation Plan</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-indigo-100 p-2 text-indigo-600"><Accessibility className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Support Needs</p><p className="text-lg font-bold">{needs.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Accessibility className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Needs</p><p className="text-lg font-bold">{activeNeeds}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Accommodation Plans</p><p className="text-lg font-bold">{plans.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Plans</p><p className="text-lg font-bold">{activePlans}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students, categories, approvers…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="needs">
        <TabsList>
          <TabsTrigger value="needs">Support Needs</TabsTrigger>
          <TabsTrigger value="plans">Accommodation Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="needs" className="mt-4">
          {needs.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Category</TableHead><TableHead>Description</TableHead><TableHead>Identified Date</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredNeeds.map((n) => (<TableRow key={n.id} className="group"><TableCell className="pl-5"><span className="font-medium">{n.studentName}</span><br /><span className="text-xs text-muted-foreground">{n.studentRef}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{n.category}</Badge></TableCell><TableCell><span className="text-sm line-clamp-1 max-w-[200px]">{n.description}</span></TableCell><TableCell><span className="text-sm">{fmtDate(n.identifiedDate)}</span></TableCell><TableCell><Badge variant={needStatusVariant[n.status] ?? "secondary"} className="capitalize">{n.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="supportNeeds" onEdit={() => { setEditingNeed(n); setNeedOpen(true); }} onDelete={() => deleteNeed.mutate(n)} editLabel="Edit need" deleteLabel="Delete need" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-4">
          {plans.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Valid From</TableHead><TableHead>Valid To</TableHead><TableHead>Adjustments</TableHead><TableHead>Approved By</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPlans.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><span className="font-medium">{p.studentName}</span><br /><span className="text-xs text-muted-foreground">{p.studentRef}</span></TableCell><TableCell><span className="text-sm">{fmtDate(p.validFrom)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(p.validTo)}</span></TableCell><TableCell><span className="text-sm line-clamp-1 max-w-[200px]">{p.adjustments}</span></TableCell><TableCell><span className="text-sm">{p.approvedBy}</span></TableCell><TableCell><Badge variant={planStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="accommodationPlans" onEdit={() => { setEditingPlan(p); setPlanOpen(true); }} onDelete={() => deletePlan.mutate(p)} editLabel="Edit plan" deleteLabel="Delete plan" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <SupportNeedFormDialog open={needOpen} onOpenChange={setNeedOpen} supportNeed={editingNeed} />
      <SupportNeedFormDialog open={planOpen} onOpenChange={setPlanOpen} accommodationPlan={editingPlan} />
    </div>
  );
}
