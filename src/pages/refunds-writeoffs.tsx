import { useMemo, useState } from "react";
import { RotateCcw, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useRefundRecords, useWriteOffEntries, useDeleteRefundRecord, useDeleteWriteOffEntry } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { RefundRecord, WriteOffEntry } from "@/lib/types";

const refundStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning",
  approved: "info",
  processed: "success",
  rejected: "secondary",
};

const writeOffReasonVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  bad_debt: "warning",
  scholarship_adjustment: "info",
  admin_correction: "secondary",
  other: "default",
};

export default function RefundsWriteoffsPage() {
  const refunds = useRefundRecords();
  const writeOffs = useWriteOffEntries();
  const deleteRefund = useDeleteRefundRecord();
  const deleteWriteOff = useDeleteWriteOffEntry();
  const [q, setQ] = useState("");
  const [refundOpen, setRefundOpen] = useState(false);
  const [editingRefund, setEditingRefund] = useState<RefundRecord | undefined>();
  const [writeOffOpen, setWriteOffOpen] = useState(false);
  const [editingWriteOff, setEditingWriteOff] = useState<WriteOffEntry | undefined>();

  const filteredRefunds = useMemo(() => {
    let list = refunds.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.studentName.toLowerCase().includes(s) || r.reason.toLowerCase().includes(s) || r.status.toLowerCase().includes(s));
    }
    return list;
  }, [refunds.data, q]);

  const filteredWriteOffs = useMemo(() => {
    let list = writeOffs.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((w) => w.studentName.toLowerCase().includes(s) || w.reason.toLowerCase().includes(s));
    }
    return list;
  }, [writeOffs.data, q]);

  const pendingRefunds = (refunds.data ?? []).filter((r) => r.status === "pending").length;
  const approvedRefunds = (refunds.data ?? []).filter((r) => r.status === "approved" || r.status === "processed").length;
  const totalWrittenOff = (writeOffs.data ?? []).reduce((s, w) => s + w.amount, 0);
  const totalRefundValue = (refunds.data ?? []).filter((r) => r.status !== "rejected").reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader icon={RotateCcw} title="Refunds & Write-offs" titleNe="फिर्ता र छुट" microModule="M12.12" description="Refund processing, write-off approvals and adjustment history." actions={<div className="flex gap-2"><Button variant="outline" onClick={() => { setEditingRefund(undefined); setRefundOpen(true); }}><Plus className="h-4 w-4" /> New Refund</Button><Button onClick={() => { setEditingWriteOff(undefined); setWriteOffOpen(true); }}><Plus className="h-4 w-4" /> New Write-off</Button></div>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><RotateCcw className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending Refunds</p><p className="text-lg font-bold">{pendingRefunds}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><RotateCcw className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Approved</p><p className="text-lg font-bold">{approvedRefunds}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><RotateCcw className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Written Off</p><p className="text-lg font-bold">NPR {totalWrittenOff.toLocaleString()}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><RotateCcw className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Value</p><p className="text-lg font-bold">NPR {totalRefundValue.toLocaleString()}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search refunds or write-offs…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="refunds">
        <TabsList><TabsTrigger value="refunds">Refunds</TabsTrigger><TabsTrigger value="writeoffs">Write-offs</TabsTrigger><TabsTrigger value="history">History</TabsTrigger></TabsList>

        <TabsContent value="refunds" className="mt-4">
          {refunds.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Amount</TableHead><TableHead>Reason</TableHead><TableHead>Approved By</TableHead><TableHead>Status</TableHead><TableHead>Processed</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRefunds.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.studentName}</TableCell><TableCell><span className="text-sm font-mono">NPR {r.amount.toLocaleString()}</span></TableCell><TableCell><span className="line-clamp-1 max-w-[200px] text-sm text-muted-foreground">{r.reason}</span></TableCell><TableCell><span className="text-sm">{r.approvedBy}</span></TableCell><TableCell><Badge variant={refundStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(r.processedAt)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingRefund(r); setRefundOpen(true); }}><Pencil /> Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteRefund.mutate(r)}><Trash2 /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="writeoffs" className="mt-4">
          {writeOffs.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Amount</TableHead><TableHead>Reason</TableHead><TableHead>Approved By</TableHead><TableHead>Written Off</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredWriteOffs.map((w) => (<TableRow key={w.id} className="group"><TableCell className="pl-5 font-medium">{w.studentName}</TableCell><TableCell><span className="text-sm font-mono">NPR {w.amount.toLocaleString()}</span></TableCell><TableCell><Badge variant={writeOffReasonVariant[w.reason] ?? "secondary"} className="capitalize">{w.reason.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm">{w.approvedBy}</span></TableCell><TableCell><span className="text-sm">{fmtDate(w.writtenOffAt)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingWriteOff(w); setWriteOffOpen(true); }}><Pencil /> Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteWriteOff.mutate(w)}><Trash2 /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Complete history of refunds and write-offs with audit trail. All adjustments are logged for compliance.</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
