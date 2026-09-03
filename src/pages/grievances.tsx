import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { GrievanceFormDialog } from "@/pages/grievance-form-dialog";
import { useGrievances, useDeleteGrievance } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Grievance, GrievanceOutcome } from "@/lib/types";

const grievanceStatusVariant: Record<string, "default" | "info" | "warning" | "destructive" | "secondary"> = {
  filed: "default", acknowledged: "info", investigating: "warning", resolved: "success", appealed: "destructive", closed: "secondary",
};

const outcomeStatusVariant: Record<string, "default" | "info" | "warning"> = {
  issued: "default", accepted: "info", appealed: "warning",
};

const mockOutcomes: GrievanceOutcome[] = [
  { id: "go1", grievanceRef: "GRV-001", decision: "Complaint upheld — scheduling error corrected", remedy: "Timetable adjusted for affected students", issuedDate: "2082-06-20", issuedBy: "Vice Principal", status: "accepted", createdOn: "2082-06-20" },
  { id: "go2", grievanceRef: "GRV-002", decision: "Complaint partially upheld", remedy: "Additional support provided to complainant", issuedDate: "2082-06-22", issuedBy: "Principal", status: "issued", createdOn: "2082-06-22" },
  { id: "go3", grievanceRef: "GRV-003", decision: "Complaint not upheld — policy followed correctly", remedy: "No remedy required", issuedDate: "2082-06-25", issuedBy: "Discipline Committee", status: "appealed", createdOn: "2082-06-25" },
];

export default function GrievancesPage() {
  const grievances = useGrievances();
  const deleteGrievance = useDeleteGrievance();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Grievance | undefined>();

  const filtered = useMemo(() => {
    let list = grievances.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((g) => g.complainantName.toLowerCase().includes(s) || g.category.toLowerCase().includes(s) || g.assignedTo.toLowerCase().includes(s)); }
    return list;
  }, [grievances.data, q]);

  const filedCount = (grievances.data ?? []).filter((g) => g.status === "filed").length;
  const resolvedCount = (grievances.data ?? []).filter((g) => g.status === "resolved" || g.status === "closed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={AlertCircle}
        title="Grievance & Complaint"
        titleNe="शिकायत तथा अभियोग"
        microModule="M19.06"
        description="Student and parent grievances, outcomes and resolution tracking."
        actions={
          <CanCreate resource="grievances"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Grievance</Button></CanCreate>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-orange-100 p-2 text-orange-600"><AlertCircle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Grievances</p><p className="text-lg font-bold">{grievances.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertCircle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Filed / Pending</p><p className="text-lg font-bold">{filedCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Resolved</p><p className="text-lg font-bold">{resolvedCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CheckCircle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Outcomes</p><p className="text-lg font-bold">{mockOutcomes.length}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search grievances by name, category, or assignee…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="grievances">
        <TabsList>
          <TabsTrigger value="grievances">Grievances</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        </TabsList>

        <TabsContent value="grievances" className="mt-4">
          {grievances.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Complainant</TableHead><TableHead>Type</TableHead><TableHead>Category</TableHead><TableHead>Received</TableHead><TableHead>Assigned To</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((g) => (<TableRow key={g.id} className="group"><TableCell className="pl-5"><span className="font-medium">{g.complainantName}</span><br /><Badge variant="secondary" className="mt-1 text-xs capitalize">{g.complainantType}</Badge></TableCell><TableCell><span className="text-sm capitalize">{g.complainantType}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{g.category}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(g.receivedDate)}</span></TableCell><TableCell><span className="text-sm">{g.assignedTo}</span></TableCell><TableCell><span className="text-sm line-clamp-1 max-w-[180px]">{g.description}</span></TableCell><TableCell><Badge variant={grievanceStatusVariant[g.status] ?? "secondary"} className="capitalize">{g.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="grievances" onEdit={() => { setEditing(g); setOpen(true); }} onDelete={() => deleteGrievance.mutate(g)} editLabel="Edit grievance" deleteLabel="Delete grievance" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="outcomes" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Grievance Ref</TableHead><TableHead>Decision</TableHead><TableHead>Remedy</TableHead><TableHead>Issued Date</TableHead><TableHead>Issued By</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{mockOutcomes.map((o) => (<TableRow key={o.id}><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{o.grievanceRef}</code></TableCell><TableCell><span className="text-sm">{o.decision}</span></TableCell><TableCell><span className="text-sm">{o.remedy}</span></TableCell><TableCell><span className="text-sm">{fmtDate(o.issuedDate)}</span></TableCell><TableCell><span className="text-sm">{o.issuedBy}</span></TableCell><TableCell><Badge variant={outcomeStatusVariant[o.status] ?? "secondary"} className="capitalize">{o.status}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>

      <GrievanceFormDialog open={open} onOpenChange={setOpen} grievance={editing} />
    </div>
  );
}
