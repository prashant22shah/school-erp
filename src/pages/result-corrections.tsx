import { useMemo, useState } from "react";
import { FilePenLine, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ResultCorrectionFormDialog } from "@/pages/result-correction-form-dialog";
import { useResultCorrections, useDeleteResultCorrection } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RowActionMenu } from "@/components/row-action-menu";
import { CanCreate } from "@/components/permission-gate";
import type { ResultCorrection } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning", approved: "info", rejected: "secondary", applied: "success",
};

export default function ResultCorrectionsPage() {
  const corrections = useResultCorrections();
  const del = useDeleteResultCorrection();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ResultCorrection | undefined>();

  const filtered = useMemo(() => {
    let list = corrections.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => (c.studentName ?? "").toLowerCase().includes(s) || c.type.toLowerCase().includes(s) || c.reason.toLowerCase().includes(s) || c.status.toLowerCase().includes(s)); }
    return list;
  }, [corrections.data, q]);

  const pending = (corrections.data ?? []).filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={FilePenLine} title="Result Corrections" titleNe="नतिजा सच्याइ" microModule="M09.03" description="Retotal, recheck and data-fix requests for published results." actions={<CanCreate resource="resultCorrections"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Correction</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FilePenLine className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total corrections</p><p className="text-lg font-bold">{corrections.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><FilePenLine className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{pending}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FilePenLine className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Applied</p><p className="text-lg font-bold">{(corrections.data ?? []).filter((c) => c.status === "applied").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search corrections…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {corrections.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Type</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead>Corrected By</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5 font-medium">{c.studentName ?? c.resultLineId.slice(0, 8)}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{c.type.replace("_", " ")}</Badge></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{c.reason}</span></TableCell><TableCell><Badge variant={statusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell><span className="text-sm">{c.correctedBy ?? "—"}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="resultCorrections" onEdit={() => { setEditing(c); setOpen(true); }} onDelete={() => del.mutate(c)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <ResultCorrectionFormDialog open={open} onOpenChange={setOpen} correction={editing} />
    </div>
  );
}
