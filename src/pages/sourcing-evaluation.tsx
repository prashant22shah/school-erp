import { useMemo, useState } from "react";
import { Scale, Search, Plus, FileText } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { RfqFormDialog } from "@/pages/rfq-form-dialog";
import { BidComparisonFormDialog } from "@/pages/bid-comparison-form-dialog";
import { useRfqs, useBidComparisons, useDeleteRfq, useDeleteBidComparison } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { RFQ, BidComparison } from "@/lib/types";

const rfqStatusVariant: Record<string, "success" | "info" | "warning" | "secondary"> = {
  draft: "info", issued: "warning", closed: "secondary", evaluated: "success",
};

const bidStatusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  submitted: "info", evaluated: "warning", selected: "success", rejected: "destructive",
};

export default function SourcingEvaluationPage() {
  const rfqs = useRfqs();
  const bidComparisons = useBidComparisons();
  const deleteRfq = useDeleteRfq();
  const deleteBid = useDeleteBidComparison();
  const [q, setQ] = useState("");
  const [rfqDialogOpen, setRfqDialogOpen] = useState(false);
  const [editingRfq, setEditingRfq] = useState<RFQ | undefined>();
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [editingBid, setEditingBid] = useState<BidComparison | undefined>();

  const filteredRfqs = useMemo(() => {
    let list = rfqs.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.rfqNo.toLowerCase().includes(s) || r.title.toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [rfqs.data, q]);

  const filteredBids = useMemo(() => {
    let list = bidComparisons.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((b) => b.vendorName.toLowerCase().includes(s) || b.rfqRef.toLowerCase().includes(s) || b.status.toLowerCase().includes(s)); }
    return list;
  }, [bidComparisons.data, q]);

  const totalRfqs = rfqs.data?.length ?? 0;
  const activeRfqs = (rfqs.data ?? []).filter((r) => r.status === "issued").length;
  const evaluated = (rfqs.data ?? []).filter((r) => r.status === "evaluated").length;
  const totalBids = bidComparisons.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Scale}
        title="Sourcing & Evaluation"
        titleNe="स्रोत मूल्यांकन"
        microModule="M14.03"
        description="Request for quotations, vendor bids and comparative evaluation."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="rfqs">
              <Button variant="outline" onClick={() => { setEditingRfq(undefined); setRfqDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New RFQ
              </Button>
            </CanCreate>
            <CanCreate resource="rfqs">
              <Button onClick={() => { setEditingBid(undefined); setBidDialogOpen(true); }}>
                <FileText className="h-4 w-4" /> New bid
              </Button>
            </CanCreate>
          </div>
        }
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Scale className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total RFQs</p><p className="text-lg font-bold">{totalRfqs}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Scale className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active RFQs</p><p className="text-lg font-bold">{activeRfqs}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Scale className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Evaluated</p><p className="text-lg font-bold">{evaluated}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Bids</p><p className="text-lg font-bold">{totalBids}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search RFQs, bids…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="rfqs">
        <TabsList>
          <TabsTrigger value="rfqs">RFQs</TabsTrigger>
          <TabsTrigger value="bids">Bid Comparisons</TabsTrigger>
        </TabsList>
        <TabsContent value="rfqs" className="mt-4">
          {rfqs.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">RFQ No</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Requisition</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Closing Date</TableHead>
                <TableHead>Vendors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredRfqs.map((r) => (
                  <TableRow key={r.id} className="group">
                    <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.rfqNo}</code></TableCell>
                    <TableCell><p className="font-medium">{r.title}</p></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.requisitionRef}</code></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(r.issueDate)}</span></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(r.closingDate)}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{r.vendorsInvited}</span></TableCell>
                    <TableCell><Badge variant={rfqStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu onEdit={() => { setEditingRfq(r); setRfqDialogOpen(true); }} onDelete={() => deleteRfq.mutate(r)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="bids" className="mt-4">
          {bidComparisons.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">Vendor</TableHead>
                <TableHead>RFQ</TableHead>
                <TableHead>Quoted Amt</TableHead>
                <TableHead>Tech Score</TableHead>
                <TableHead>Comm Score</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredBids.map((b) => (
                  <TableRow key={b.id} className="group">
                    <TableCell className="pl-5"><p className="font-medium">{b.vendorName}</p></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{b.rfqRef}</code></TableCell>
                    <TableCell><span className="text-sm font-mono">Rs {b.quotedAmount.toLocaleString()}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{b.technicalScore}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{b.commercialScore}</span></TableCell>
                    <TableCell><span className="text-sm font-mono font-bold">{b.totalScore}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{b.rank}</span></TableCell>
                    <TableCell><Badge variant={bidStatusVariant[b.status] ?? "secondary"} className="capitalize">{b.status}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu onEdit={() => { setEditingBid(b); setBidDialogOpen(true); }} onDelete={() => deleteBid.mutate(b)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <RfqFormDialog open={rfqDialogOpen} onOpenChange={setRfqDialogOpen} rfq={editingRfq} />
      <BidComparisonFormDialog open={bidDialogOpen} onOpenChange={setBidDialogOpen} bid={editingBid} />
    </div>
  );
}
