import { useMemo, useState } from "react";
import { Tag, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { FeeStructureFormDialog } from "@/pages/fee-structure-form-dialog";
import { useFeeStructures, useDeleteFeeStructure } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { FeeStructure } from "@/lib/types";

const freqVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  one_time: "secondary",
  monthly: "info",
  term: "warning",
  annual: "success",
};

export default function FeeCatalogPage() {
  const query = useFeeStructures();
  const del = useDeleteFeeStructure();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FeeStructure | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(s) || f.code.toLowerCase().includes(s) || f.frequency.toLowerCase().includes(s) || (f.academicPeriodName ?? "").toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const oneTime = (query.data ?? []).filter((f) => f.frequency === "one_time").length;
  const monthly = (query.data ?? []).filter((f) => f.frequency === "monthly").length;
  const term = (query.data ?? []).filter((f) => f.frequency === "term").length;
  const annual = (query.data ?? []).filter((f) => f.frequency === "annual").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Tag} title="Fee Catalog" titleNe="शुल्क सूची" microModule="M12.05" description="Fee structures, frequencies and amounts." actions={<CanCreate resource="feeStructures"><Button onClick={() => { setEditing(undefined); setOpen(true); }}>New Fee Structure</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-5">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Tag className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total</p><p className="text-lg font-bold">{query.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-slate-100 p-2 text-slate-600"><Tag className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">One-time</p><p className="text-lg font-bold">{oneTime}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-sky-100 p-2 text-sky-600"><Tag className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Monthly</p><p className="text-lg font-bold">{monthly}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Tag className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Term</p><p className="text-lg font-bold">{term}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Tag className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Annual</p><p className="text-lg font-bold">{annual}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search fee structures…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Period</TableHead><TableHead>Amount</TableHead><TableHead>Frequency</TableHead><TableHead>Active</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((f) => (<TableRow key={f.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{f.code}</code></TableCell><TableCell className="font-medium">{f.name}</TableCell><TableCell><Badge variant="secondary">{f.academicPeriodName ?? f.academicPeriodRef.slice(0, 8)}</Badge></TableCell><TableCell><span className="text-sm font-mono">{f.amount.toLocaleString()}</span></TableCell><TableCell><Badge variant={freqVariant[f.frequency] ?? "secondary"} className="capitalize">{f.frequency.replace("_", " ")}</Badge></TableCell><TableCell><Badge variant={f.isActive ? "success" : "secondary"}>{f.isActive ? "Active" : "Inactive"}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="feeStructures" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <FeeStructureFormDialog open={open} onOpenChange={setOpen} feeStructure={editing} />
    </div>
  );
}
