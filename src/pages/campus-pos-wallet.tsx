import { useMemo, useState } from "react";
import { Wallet, Search, Plus, CreditCard, Smartphone } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { POSModuleFormDialog } from "@/pages/pos-module-form-dialog";
import { PrepaidWalletFormDialog } from "@/pages/prepaid-wallet-form-dialog";
import { usePosModules, usePrepaidWallets, useDeletePosModule, useDeletePrepaidWallet } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { POSModule, PrepaidWallet } from "@/lib/types";

const terminalTypeVariant: Record<string, "success" | "info" | "warning" | "secondary"> = {
  canteen: "success", stationery: "info", printing: "warning", vending: "secondary",
};
const posStatusVariant: Record<string, "success" | "secondary" | "warning"> = {
  active: "success", inactive: "secondary", maintenance: "warning",
};
const walletStatusVariant: Record<string, "success" | "warning" | "secondary"> = {
  active: "success", frozen: "warning", closed: "secondary",
};

export default function CampusPosWallet() {
  const posModules = usePosModules();
  const wallets = usePrepaidWallets();
  const deletePos = useDeletePosModule();
  const deleteWallet = useDeletePrepaidWallet();
  const [q, setQ] = useState("");
  const [posDialogOpen, setPosDialogOpen] = useState(false);
  const [editingPos, setEditingPos] = useState<POSModule | undefined>();
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<PrepaidWallet | undefined>();

  const filteredPos = useMemo(() => {
    let list = posModules.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.terminalCode.toLowerCase().includes(s) || p.location.toLowerCase().includes(s) || p.vendor.toLowerCase().includes(s)); }
    return list;
  }, [posModules.data, q]);

  const filteredWallets = useMemo(() => {
    let list = wallets.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((w) => w.studentName.toLowerCase().includes(s) || w.status.includes(s)); }
    return list;
  }, [wallets.data, q]);

  const totalTerminals = posModules.data?.length ?? 0;
  const activeTerminals = (posModules.data ?? []).filter((p) => p.status === "active").length;
  const totalWalletBalance = (wallets.data ?? []).filter((w) => w.status === "active").reduce((sum, w) => sum + w.balance, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Wallet}
        title="Campus POS & Wallet"
        titleNe="क्याम्पस POS"
        microModule="M18.06"
        description="Manage campus POS terminals and student prepaid wallets for cashless transactions."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="residenceBlocks">
              <Button variant="outline" onClick={() => { setEditingPos(undefined); setPosDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New terminal
              </Button>
            </CanCreate>
            <CanCreate resource="residenceBlocks">
              <Button onClick={() => { setEditingWallet(undefined); setWalletDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New wallet
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CreditCard className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total terminals</p><p className="text-lg font-bold">{totalTerminals}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Smartphone className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active terminals</p><p className="text-lg font-bold">{activeTerminals}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Wallet className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Wallet balance</p><p className="text-lg font-bold">NPR {totalWalletBalance.toLocaleString()}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search terminals, wallets…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="terminals">
        <TabsList>
          <TabsTrigger value="terminals">POS Terminals</TabsTrigger>
          <TabsTrigger value="wallets">Prepaid Wallets</TabsTrigger>
        </TabsList>

        <TabsContent value="terminals" className="mt-4">
          {posModules.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Terminal</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPos.map((p) => (
                      <TableRow key={p.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{p.location}</p></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.terminalCode}</code></TableCell>
                        <TableCell><Badge variant={terminalTypeVariant[p.type] ?? "secondary"} className="capitalize">{p.type}</Badge></TableCell>
                        <TableCell><span className="text-sm">{p.location}</span></TableCell>
                        <TableCell><span className="text-sm">{p.vendor}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(p.lastSyncDate)}</span></TableCell>
                        <TableCell><Badge variant={posStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="residenceBlocks" onEdit={() => { setEditingPos(p); setPosDialogOpen(true); }} onDelete={() => deletePos.mutate(p)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="wallets" className="mt-4">
          {wallets.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Total Top-Up</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Transaction</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWallets.map((w) => (
                      <TableRow key={w.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{w.studentName}</p></TableCell>
                        <TableCell><span className="text-sm font-mono font-semibold">{w.balance?.toLocaleString()}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{w.totalTopUp?.toLocaleString()}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{w.totalSpent?.toLocaleString()}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(w.lastTransaction)}</span></TableCell>
                        <TableCell><Badge variant={walletStatusVariant[w.status] ?? "secondary"} className="capitalize">{w.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="residenceBlocks" onEdit={() => { setEditingWallet(w); setWalletDialogOpen(true); }} onDelete={() => deleteWallet.mutate(w)} />
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

      <POSModuleFormDialog open={posDialogOpen} onOpenChange={setPosDialogOpen} editing={editingPos} />
      <PrepaidWalletFormDialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen} editing={editingWallet} />
    </div>
  );
}
