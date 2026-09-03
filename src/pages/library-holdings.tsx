import { useMemo, useState } from "react";
import { Layers, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { LibraryHoldingFormDialog } from "@/pages/library-holding-form-dialog";
import { useLibraryHoldings, useDeleteLibraryHolding } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { LibraryHolding } from "@/lib/types";

const holdingStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  available: "success",
  issued: "warning",
  reserved: "info",
  maintenance: "warning",
  lost: "destructive",
};

const conditionVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  new: "success",
  good: "info",
  worn: "warning",
  damaged: "destructive",
  lost: "destructive",
  withdrawn: "secondary",
};

export default function LibraryHoldingsPage() {
  const query = useLibraryHoldings();
  const del = useDeleteLibraryHolding();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LibraryHolding | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((h) => h.barcode.toLowerCase().includes(s) || h.location.toLowerCase().includes(s) || (h.resourceTitle ?? "").toLowerCase().includes(s) || h.copyNo.toLowerCase().includes(s) || h.condition.toLowerCase().includes(s) || h.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const available = (query.data ?? []).filter((h) => h.status === "available").length;
  const issued = (query.data ?? []).filter((h) => h.status === "issued").length;
  const reserved = (query.data ?? []).filter((h) => h.status === "reserved").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Layers} title="Library Holdings" titleNe="पुस्तकालय धारण" microModule="M16.02" description="Copies, holdings and shelving — physical inventory." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><CanCreate resource="libraryHoldings">New Holding</CanCreate></Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Layers className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Copies</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Layers className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Available</p><p className="text-lg font-bold">{available}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Layers className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Issued</p><p className="text-lg font-bold">{issued}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Layers className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Reserved</p><p className="text-lg font-bold">{reserved}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search holdings by barcode, location or resource…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Barcode</TableHead><TableHead>Resource</TableHead><TableHead>Copy No</TableHead><TableHead>Location</TableHead><TableHead>Condition</TableHead><TableHead>Status</TableHead><TableHead>Acquired On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((h) => (<TableRow key={h.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{h.barcode}</code></TableCell><TableCell><span className="text-sm font-medium">{h.resourceTitle ?? h.resourceId}</span></TableCell><TableCell><span className="text-sm font-mono">{h.copyNo}</span></TableCell><TableCell><span className="text-sm">{h.location}</span></TableCell><TableCell><Badge variant={conditionVariant[h.condition] ?? "secondary"} className="capitalize">{h.condition}</Badge></TableCell><TableCell><Badge variant={holdingStatusVariant[h.status] ?? "secondary"} className="capitalize">{h.status}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(h.acquiredOn)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="libraryHoldings" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <LibraryHoldingFormDialog open={open} onOpenChange={setOpen} holding={editing} />
    </div>
  );
}
