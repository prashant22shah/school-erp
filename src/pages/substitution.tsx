import { useMemo, useState } from "react";
import { Repeat2, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SubstitutionFormDialog } from "@/pages/substitution-form-dialog";
import { useSubstitutions, useDeleteSubstitution } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RowActionMenu } from "@/components/row-action-menu";
import { CanCreate } from "@/components/permission-gate";
import type { Substitution } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning", approved: "success", rejected: "secondary", completed: "default",
};

export default function SubstitutionPage() {
  const subs = useSubstitutions();
  const del = useDeleteSubstitution();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Substitution | undefined>();

  const filtered = useMemo(() => {
    let list = subs.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.localDate.includes(s) || r.replacementStaffName.toLowerCase().includes(s) || (r.reason ?? "").toLowerCase().includes(s)); }
    return list;
  }, [subs.data, q]);

  const approved = (subs.data ?? []).filter((s) => s.status === "approved").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Repeat2} title="Substitution & Changes" titleNe="प्रतिस्थापन" microModule="M07.02" description="Substitute teachers, swaps and one-off timetable changes." actions={<CanCreate resource="substitutions"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Substitution</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Repeat2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total</p><p className="text-lg font-bold">{subs.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Repeat2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Approved</p><p className="text-lg font-bold">{approved}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Repeat2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{(subs.data ?? []).filter((s) => s.status === "pending").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search substitutions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {subs.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Date</TableHead><TableHead>Assignment</TableHead><TableHead>Replacement</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((s) => (<TableRow key={s.id} className="group"><TableCell className="pl-5 text-sm font-mono">{s.localDate}</TableCell><TableCell><Badge variant="secondary">{s.assignmentLabel ?? s.assignmentId}</Badge></TableCell><TableCell><span className="text-sm">{s.replacementStaffName}</span></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{s.reason ?? "—"}</span></TableCell><TableCell><Badge variant={statusVariant[s.status] ?? "secondary"} className="capitalize">{s.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="substitutions" onEdit={() => { setEditing(s); setOpen(true); }} onDelete={() => del.mutate(s)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <SubstitutionFormDialog open={open} onOpenChange={setOpen} substitution={editing} />
    </div>
  );
}
