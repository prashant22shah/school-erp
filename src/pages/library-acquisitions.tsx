import { useMemo, useState } from "react";
import { Package, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { LibraryAcquisitionFormDialog } from "@/pages/library-acquisition-form-dialog";
import { useLibraryAcquisitions, useDeleteLibraryAcquisition } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { LibraryAcquisition } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  draft: "secondary",
  ordered: "info",
  received: "warning",
  cataloged: "success",
  cancelled: "destructive",
};

const sourceVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  purchase: "info",
  donation: "success",
  exchange: "warning",
  subscription: "purple",
};

export default function LibraryAcquisitionsPage() {
  const query = useLibraryAcquisitions();
  const del = useDeleteLibraryAcquisition();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LibraryAcquisition | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(s) || a.vendorName.toLowerCase().includes(s) || a.orderNo.toLowerCase().includes(s) || a.status.toLowerCase().includes(s) || a.source.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const ordered = (query.data ?? []).filter((a) => a.status === "ordered").length;
  const received = (query.data ?? []).filter((a) => a.status === "received").length;
  const cataloged = (query.data ?? []).filter((a) => a.status === "cataloged").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Package} title="Library Acquisitions" titleNe="पुस्तकालय अधिग्रहण" microModule="M16.04" description="Acquisition and serials — orders, receipts and cataloging." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Acquisition</Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Package className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Orders</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Package className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Ordered</p><p className="text-lg font-bold">{ordered}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Package className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Received</p><p className="text-lg font-bold">{received}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Package className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Cataloged</p><p className="text-lg font-bold">{cataloged}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search acquisitions by title, vendor or order no…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Order No</TableHead><TableHead>Title</TableHead><TableHead>Vendor</TableHead><TableHead>Source</TableHead><TableHead>Qty</TableHead><TableHead>Total Cost</TableHead><TableHead>Status</TableHead><TableHead>Ordered On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.orderNo}</code></TableCell><TableCell className="font-medium">{a.title}</TableCell><TableCell><span className="text-sm">{a.vendorName}</span></TableCell><TableCell><Badge variant={sourceVariant[a.source] ?? "secondary"} className="capitalize">{a.source}</Badge></TableCell><TableCell><span className="text-sm font-mono">{a.quantity}</span></TableCell><TableCell><span className="text-sm font-mono">NPR {a.totalCost.toLocaleString()}</span></TableCell><TableCell><Badge variant={statusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(a.orderedOn)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(a); setOpen(true); }}><Pencil /> Edit acquisition</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(a)}><Trash2 /> Delete acquisition</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <LibraryAcquisitionFormDialog open={open} onOpenChange={setOpen} acquisition={editing} />
    </div>
  );
}
