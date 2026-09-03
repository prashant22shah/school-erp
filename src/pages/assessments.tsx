import { useMemo, useState } from "react";
import { FileText, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { AssessmentFormDialog } from "@/pages/assessment-form-dialog";
import { AssessmentComponentFormDialog } from "@/pages/assessment-component-form-dialog";
import { useAssessments, useAssessmentComponents, useDeleteAssessment, useDeleteAssessmentComponent } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Assessment, AssessmentComponent } from "@/lib/types";

const assessmentStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", published: "info", active: "success", archived: "warning",
};

export default function AssessmentsPage() {
  const assessments = useAssessments();
  const components = useAssessmentComponents();
  const deleteAssessment = useDeleteAssessment();
  const deleteComponent = useDeleteAssessmentComponent();
  const [q, setQ] = useState("");
  const [assOpen, setAssOpen] = useState(false);
  const [editingAss, setEditingAss] = useState<Assessment | undefined>();
  const [compOpen, setCompOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<AssessmentComponent | undefined>();

  const filteredAssessments = useMemo(() => {
    let list = assessments.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.code.toLowerCase().includes(s) || a.name.toLowerCase().includes(s) || a.type.toLowerCase().includes(s)); }
    return list;
  }, [assessments.data, q]);

  const filteredComponents = useMemo(() => {
    let list = components.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.name.toLowerCase().includes(s) || (c.assessmentName ?? "").toLowerCase().includes(s)); }
    return list;
  }, [components.data, q]);

  const activeCount = (assessments.data ?? []).filter((a) => a.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={FileText} title="Assessment Design" titleNe="मूल्याङ्कन डिजाइन" microModule="M08.01" description="Assessment schemes, weightage and component breakdown." actions={<div className="flex gap-2"><Button variant="outline" onClick={() => { setEditingAss(undefined); setAssOpen(true); }}><Plus className="h-4 w-4" /> New Assessment</Button><Button onClick={() => { setEditingComp(undefined); setCompOpen(true); }}><Plus className="h-4 w-4" /> New Component</Button></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total assessments</p><p className="text-lg font-bold">{assessments.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{activeCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Components</p><p className="text-lg font-bold">{components.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search assessments or components…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="assessments">
        <TabsList><TabsTrigger value="assessments">Assessments</TabsTrigger><TabsTrigger value="components">Components</TabsTrigger></TabsList>

        <TabsContent value="assessments" className="mt-4">
          {assessments.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Max / Pass</TableHead><TableHead>Weight</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAssessments.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.code}</code></TableCell><TableCell className="font-medium">{a.name}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{a.type.replace("_"," ")}</Badge></TableCell><TableCell><span className="text-sm font-mono">{a.maxMarks}/{a.passMarks}</span></TableCell><TableCell><span className="text-sm">{a.weight}%</span></TableCell><TableCell><Badge variant={assessmentStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingAss(a); setAssOpen(true); }}><Pencil /> Edit assessment</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteAssessment.mutate(a)}><Trash2 /> Delete assessment</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="components" className="mt-4">
          {components.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Assessment</TableHead><TableHead>Name</TableHead><TableHead>Max Marks</TableHead><TableHead>Weight</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredComponents.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><Badge variant="secondary">{c.assessmentName ?? c.assessmentId}</Badge></TableCell><TableCell className="font-medium">{c.name}</TableCell><TableCell><span className="text-sm font-mono">{c.maxMarks}</span></TableCell><TableCell><span className="text-sm">{c.weight}%</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingComp(c); setCompOpen(true); }}><Pencil /> Edit component</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteComponent.mutate(c)}><Trash2 /> Delete component</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <AssessmentFormDialog open={assOpen} onOpenChange={setAssOpen} assessment={editingAss} />
      <AssessmentComponentFormDialog open={compOpen} onOpenChange={setCompOpen} component={editingComp} />
    </div>
  );
}
