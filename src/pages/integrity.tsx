import { useMemo, useState } from "react";
import { ShieldAlert, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { IntegrityCaseFormDialog } from "@/pages/integrity-case-form-dialog";
import { useIntegrityCases, useDeleteIntegrityCase } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RowActionMenu } from "@/components/row-action-menu";
import { CanCreate } from "@/components/permission-gate";
import type { IntegrityCase } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  open: "warning", under_review: "info", resolved: "success", dismissed: "secondary",
};

export default function IntegrityPage() {
  const cases = useIntegrityCases();
  const del = useDeleteIntegrityCase();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IntegrityCase | undefined>();

  const filtered = useMemo(() => {
    let list = cases.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.studentName.toLowerCase().includes(s) || c.type.toLowerCase().includes(s) || c.description.toLowerCase().includes(s) || c.status.toLowerCase().includes(s)); }
    return list;
  }, [cases.data, q]);

  return (
    <div className="space-y-6">
      <PageHeader icon={ShieldAlert} title="Integrity & Discipline" titleNe="अनुशासन" microModule="M08.08" description="Malpractice, cheating and disruption cases." actions={<CanCreate resource="integrityCases"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Case</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ShieldAlert className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total cases</p><p className="text-lg font-bold">{cases.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><ShieldAlert className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open / Under Review</p><p className="text-lg font-bold">{(cases.data ?? []).filter((c) => c.status === "open" || c.status === "under_review").length}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ShieldAlert className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Resolved</p><p className="text-lg font-bold">{(cases.data ?? []).filter((c) => c.status === "resolved").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search integrity cases…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {cases.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Exam</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5 font-medium">{c.studentName}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.examId.slice(0,8)}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{c.type}</Badge></TableCell><TableCell><span className="line-clamp-1 max-w-[280px] text-sm text-muted-foreground">{c.description}</span></TableCell><TableCell><Badge variant={statusVariant[c.status] ?? "secondary"} className="capitalize">{c.status.replace("_"," ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="integrityCases" onEdit={() => { setEditing(c); setOpen(true); }} onDelete={() => del.mutate(c)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <IntegrityCaseFormDialog open={open} onOpenChange={setOpen} integrityCase={editing} />
    </div>
  );
}
