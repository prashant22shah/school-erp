import { useMemo, useState } from "react";
import { ArrowRightLeft, Search, Plus, BookOpen, Package, ArrowDown, ArrowUp } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { StockEntryFormDialog } from "@/pages/stock-entry-form-dialog";
import { StockLedgerFormDialog } from "@/pages/stock-ledger-form-dialog";
import { useStockEntries, useStockLedgers, useDeleteStockEntry, useDeleteStockLedger } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { StockEntry, StockLedger } from "@/lib/types";

const entryStatusVariant: Record<string, "info" | "success" | "destructive"> = {
  draft: "info", posted: "success", cancelled: "destructive",
};
const entryTypeVariant: Record<string, "success" | "warning" | "info" | "secondary"> = {
  receipt: "success", issue: "warning", transfer: "info", adjustment: "secondary", return: "success",
};

export default function StockTransactions() {
  const entries = useStockEntries();
  const ledgers = useStockLedgers();
  const deleteEntry = useDeleteStockEntry();
  const deleteLedger = useDeleteStockLedger();
  const [q, setQ] = useState("");
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<StockEntry | undefined>();
  const [ledgerDialogOpen, setLedgerDialogOpen] = useState(false);
  const [editingLedger, setEditingLedger] = useState<StockLedger | undefined>();

  const filteredEntries = useMemo(() => {
    let list = entries.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.entryNo.toLowerCase().includes(s) || e.itemName.toLowerCase().includes(s) || e.storeRef.toLowerCase().includes(s)); }
    return list;
  }, [entries.data, q]);

  const filteredLedgers = useMemo(() => {
    let list = ledgers.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((l) => l.itemName.toLowerCase().includes(s) || l.storeRef.toLowerCase().includes(s) || l.period.toLowerCase().includes(s)); }
    return list;
  }, [ledgers.data, q]);

  const postedEntries = (entries.data ?? []).filter((e) => e.status === "posted").length;
  const totalReceipts = (entries.data ?? []).filter((e) => e.type === "receipt").length;
  const totalIssues = (entries.data ?? []).filter((e) => e.type === "issue").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ArrowRightLeft}
        title="Stock Transactions"
        titleNe="स्टक कारोबार"
        microModule="M15.02"
        description="Record stock receipts, issues, transfers, adjustments and maintain ledgers."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="stockEntries">
              <Button variant="outline" onClick={() => { setEditingEntry(undefined); setEntryDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New entry
              </Button>
            </CanCreate>
            <CanCreate resource="stockLedgers">
              <Button onClick={() => { setEditingLedger(undefined); setLedgerDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New ledger
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ArrowRightLeft className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total entries</p><p className="text-lg font-bold">{entries.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ArrowDown className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Receipts</p><p className="text-lg font-bold">{totalReceipts}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><ArrowUp className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Issues</p><p className="text-lg font-bold">{totalIssues}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><BookOpen className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Ledger records</p><p className="text-lg font-bold">{ledgers.data?.length ?? 0}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search entries, ledgers…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="entries">Stock Entries</TabsTrigger>
          <TabsTrigger value="ledgers">Stock Ledgers</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="mt-4">
          {entries.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Entry No</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((e) => (
                      <TableRow key={e.id} className="group">
                        <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{e.entryNo}</code></TableCell>
                        <TableCell><span className="text-sm font-medium">{e.itemName}</span></TableCell>
                        <TableCell><span className="text-sm">{e.storeRef}</span></TableCell>
                        <TableCell><Badge variant={entryTypeVariant[e.type] ?? "secondary"} className="capitalize">{e.type}</Badge></TableCell>
                        <TableCell><span className="text-sm font-mono">{e.quantity}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{e.unitCost?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(e.entryDate)}</span></TableCell>
                        <TableCell><Badge variant={entryStatusVariant[e.status] ?? "secondary"} className="capitalize">{e.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="stockEntries" onEdit={() => { setEditingEntry(e); setEntryDialogOpen(true); }} onDelete={() => deleteEntry.mutate(e)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ledgers" className="mt-4">
          {ledgers.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Item</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Opening</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Issued</TableHead>
                      <TableHead>Closing</TableHead>
                      <TableHead>Value (NPR)</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLedgers.map((l) => (
                      <TableRow key={l.id} className="group">
                        <TableCell className="pl-5"><span className="text-sm font-medium">{l.itemName}</span></TableCell>
                        <TableCell><span className="text-sm">{l.storeRef}</span></TableCell>
                        <TableCell><Badge variant="secondary">{l.period}</Badge></TableCell>
                        <TableCell><span className="text-sm font-mono">{l.openingQty}</span></TableCell>
                        <TableCell><span className="text-sm font-mono text-emerald-600">+{l.receivedQty}</span></TableCell>
                        <TableCell><span className="text-sm font-mono text-amber-600">-{l.issuedQty}</span></TableCell>
                        <TableCell><span className="text-sm font-mono font-medium">{l.closingQty}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{l.balanceValue?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="stockLedgers" onEdit={() => { setEditingLedger(l); setLedgerDialogOpen(true); }} onDelete={() => deleteLedger.mutate(l)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <StockEntryFormDialog open={entryDialogOpen} onOpenChange={setEntryDialogOpen} editing={editingEntry} />
      <StockLedgerFormDialog open={ledgerDialogOpen} onOpenChange={setLedgerDialogOpen} editing={editingLedger} />
    </div>
  );
}
