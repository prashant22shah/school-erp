import { useMemo, useState } from "react";
import { Megaphone, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ResultPublicationFormDialog } from "@/pages/result-publication-form-dialog";
import { useResultPublications, useDeleteResultPublication } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RowActionMenu } from "@/components/row-action-menu";
import { CanCreate } from "@/components/permission-gate";
import type { ResultPublication } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", approved: "info", published: "success", revoked: "warning",
};

export default function ResultPublicationsPage() {
  const pubs = useResultPublications();
  const del = useDeleteResultPublication();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ResultPublication | undefined>();

  const filtered = useMemo(() => {
    let list = pubs.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => (p.resultRunName ?? "").toLowerCase().includes(s) || p.status.toLowerCase().includes(s) || (p.approvedBy ?? "").toLowerCase().includes(s)); }
    return list;
  }, [pubs.data, q]);

  const published = (pubs.data ?? []).filter((p) => p.status === "published").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Megaphone} title="Result Publications" titleNe="नतिजा प्रकाशन" microModule="M09.02" description="Approve and publish result runs for student access." actions={<CanCreate resource="resultPublications"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Publication</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Megaphone className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total publications</p><p className="text-lg font-bold">{pubs.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Megaphone className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{published}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Megaphone className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Draft</p><p className="text-lg font-bold">{(pubs.data ?? []).filter((p) => p.status === "draft").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search publications…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {pubs.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Result Run</TableHead><TableHead>Published On</TableHead><TableHead>Status</TableHead><TableHead>Approved By</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5 font-medium">{p.resultRunName ?? p.resultRunId}</TableCell><TableCell><span className="text-sm font-mono">{p.publishedOn.slice(0, 10)}</span></TableCell><TableCell><Badge variant={statusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell><span className="text-sm">{p.approvedBy ?? "—"}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="resultPublications" onEdit={() => { setEditing(p); setOpen(true); }} onDelete={() => del.mutate(p)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <ResultPublicationFormDialog open={open} onOpenChange={setOpen} publication={editing} />
    </div>
  );
}
