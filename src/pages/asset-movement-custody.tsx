import { useMemo, useState } from "react";
import { ArrowRightLeft, Search, Plus, Shield, MapPin, CheckCircle2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { AssetTransferFormDialog } from "@/pages/asset-transfer-form-dialog";
import { CustodyRecordFormDialog } from "@/pages/custody-record-form-dialog";
import { useAssetTransfers, useCustodyRecords, useDeleteAssetTransfer, useDeleteCustodyRecord } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { AssetTransfer, CustodyRecord } from "@/lib/types";

const transferStatusVariant: Record<string, "info" | "success" | "secondary"> = {
  draft: "info", approved: "success", completed: "secondary",
};
const custodyStatusVariant: Record<string, "success" | "secondary"> = {
  active: "success", returned: "secondary",
};
const conditionVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  good: "success", fair: "warning", poor: "destructive", damaged: "destructive",
};

export default function AssetMovementCustody() {
  const transfers = useAssetTransfers();
  const custody = useCustodyRecords();
  const deleteTransfer = useDeleteAssetTransfer();
  const deleteCustody = useDeleteCustodyRecord();
  const [q, setQ] = useState("");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<AssetTransfer | undefined>();
  const [custodyDialogOpen, setCustodyDialogOpen] = useState(false);
  const [editingCustody, setEditingCustody] = useState<CustodyRecord | undefined>();

  const filteredTransfers = useMemo(() => {
    let list = transfers.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((t) => t.assetName.toLowerCase().includes(s) || t.toLocation.toLowerCase().includes(s) || t.fromLocation.toLowerCase().includes(s)); }
    return list;
  }, [transfers.data, q]);

  const filteredCustody = useMemo(() => {
    let list = custody.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.assetName.toLowerCase().includes(s) || c.custodianName.toLowerCase().includes(s)); }
    return list;
  }, [custody.data, q]);

  const completedTransfers = (transfers.data ?? []).filter((t) => t.status === "completed").length;
  const activeCustody = (custody.data ?? []).filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ArrowRightLeft}
        title="Asset Movement"
        titleNe="सम्पत्ति स्थानान्तरण"
        microModule="M15.05"
        description="Track asset transfers between locations and maintain custody records."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="assetTransfers">
              <Button variant="outline" onClick={() => { setEditingTransfer(undefined); setTransferDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New transfer
              </Button>
            </CanCreate>
            <CanCreate resource="custodyRecords">
              <Button onClick={() => { setEditingCustody(undefined); setCustodyDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New custody
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ArrowRightLeft className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total transfers</p><p className="text-lg font-bold">{transfers.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completedTransfers}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Shield className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Custody records</p><p className="text-lg font-bold">{custody.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><MapPin className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active custody</p><p className="text-lg font-bold">{activeCustody}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transfers, custody…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="transfers">
        <TabsList>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="custody">Custody Records</TabsTrigger>
        </TabsList>

        <TabsContent value="transfers" className="mt-4">
          {transfers.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Asset</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>From Custodian</TableHead>
                      <TableHead>To Custodian</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransfers.map((t) => (
                      <TableRow key={t.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{t.assetName}</p></TableCell>
                        <TableCell><span className="text-sm">{t.fromLocation || "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{t.toLocation}</span></TableCell>
                        <TableCell><span className="text-sm">{t.fromCustodian || "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{t.toCustodian || "—"}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(t.transferDate)}</span></TableCell>
                        <TableCell><Badge variant={transferStatusVariant[t.status] ?? "secondary"} className="capitalize">{t.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="assetTransfers" onEdit={() => { setEditingTransfer(t); setTransferDialogOpen(true); }} onDelete={() => deleteTransfer.mutate(t)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="custody" className="mt-4">
          {custody.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Asset</TableHead>
                      <TableHead>Custodian</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustody.map((c) => (
                      <TableRow key={c.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{c.assetName}</p></TableCell>
                        <TableCell><span className="text-sm">{c.custodianName}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(c.assignedDate)}</span></TableCell>
                        <TableCell><span className="text-xs">{c.returnDate ? fmtDate(c.returnDate) : "—"}</span></TableCell>
                        <TableCell><Badge variant={conditionVariant[c.condition] ?? "secondary"} className="capitalize">{c.condition}</Badge></TableCell>
                        <TableCell><Badge variant={custodyStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="custodyRecords" onEdit={() => { setEditingCustody(c); setCustodyDialogOpen(true); }} onDelete={() => deleteCustody.mutate(c)} />
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

      <AssetTransferFormDialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen} editing={editingTransfer} />
      <CustodyRecordFormDialog open={custodyDialogOpen} onOpenChange={setCustodyDialogOpen} editing={editingCustody} />
    </div>
  );
}
