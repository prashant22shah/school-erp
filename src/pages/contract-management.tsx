import { useMemo, useState } from "react";
import { FileSignature, Search, Plus, RefreshCw } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ContractFormDialog } from "@/pages/contract-form-dialog";
import { ContractRenewalFormDialog } from "@/pages/contract-renewal-form-dialog";
import { useContracts, useContractRenewals, useDeleteContract, useDeleteContractRenewal } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { Contract, ContractRenewal } from "@/lib/types";

const contractStatusVariant: Record<string, "success" | "info" | "warning" | "secondary" | "destructive"> = {
  draft: "info", active: "success", expired: "warning", terminated: "destructive",
};

const renewalStatusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  pending: "info", approved: "success", rejected: "destructive", completed: "secondary",
};

export default function ContractManagementPage() {
  const contracts = useContracts();
  const contractRenewals = useContractRenewals();
  const deleteContract = useDeleteContract();
  const deleteRenewal = useDeleteContractRenewal();
  const [q, setQ] = useState("");
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | undefined>();
  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [editingRenewal, setEditingRenewal] = useState<ContractRenewal | undefined>();

  const filteredContracts = useMemo(() => {
    let list = contracts.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.contractNo.toLowerCase().includes(s) || c.vendorName.toLowerCase().includes(s) || c.title.toLowerCase().includes(s) || c.status.toLowerCase().includes(s)); }
    return list;
  }, [contracts.data, q]);

  const filteredRenewals = useMemo(() => {
    let list = contractRenewals.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.contractRef.toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [contractRenewals.data, q]);

  const totalContracts = contracts.data?.length ?? 0;
  const activeContracts = (contracts.data ?? []).filter((c) => c.status === "active").length;
  const expiredContracts = (contracts.data ?? []).filter((c) => c.status === "expired").length;
  const totalValue = (contracts.data ?? []).reduce((sum, c) => sum + (c.value || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileSignature}
        title="Contract Management"
        titleNe="सम्झौता"
        microModule="M14.06"
        description="Vendor contracts, renewals and agreement lifecycle management."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="contracts">
              <Button variant="outline" onClick={() => { setEditingContract(undefined); setContractDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New contract
              </Button>
            </CanCreate>
            <CanCreate resource="contracts">
              <Button onClick={() => { setEditingRenewal(undefined); setRenewalDialogOpen(true); }}>
                <RefreshCw className="h-4 w-4" /> New renewal
              </Button>
            </CanCreate>
          </div>
        }
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileSignature className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Contracts</p><p className="text-lg font-bold">{totalContracts}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FileSignature className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{activeContracts}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-red-100 p-2 text-red-600"><FileSignature className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Expired</p><p className="text-lg font-bold">{expiredContracts}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><FileSignature className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Value</p><p className="text-lg font-bold">Rs {totalValue.toLocaleString()}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search contracts, renewals…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="contracts">
        <TabsList>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="renewals">Renewals</TabsTrigger>
        </TabsList>
        <TabsContent value="contracts" className="mt-4">
          {contracts.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">Contract No</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredContracts.map((c) => (
                  <TableRow key={c.id} className="group">
                    <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.contractNo}</code></TableCell>
                    <TableCell><p className="font-medium">{c.vendorName}</p></TableCell>
                    <TableCell><span className="text-sm">{c.title}</span></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(c.startDate)}</span></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(c.endDate)}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">Rs {c.value.toLocaleString()}</span></TableCell>
                    <TableCell><Badge variant={contractStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu onEdit={() => { setEditingContract(c); setContractDialogOpen(true); }} onDelete={() => deleteContract.mutate(c)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="renewals" className="mt-4">
          {contractRenewals.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">Contract</TableHead>
                <TableHead>Previous End</TableHead>
                <TableHead>New End</TableHead>
                <TableHead>Revised Value</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredRenewals.map((r) => (
                  <TableRow key={r.id} className="group">
                    <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.contractRef}</code></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(r.previousEndDate)}</span></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(r.newEndDate)}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">Rs {r.revisedValue.toLocaleString()}</span></TableCell>
                    <TableCell><span className="text-sm max-w-[200px] truncate inline-block">{r.notes}</span></TableCell>
                    <TableCell><Badge variant={renewalStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu onEdit={() => { setEditingRenewal(r); setRenewalDialogOpen(true); }} onDelete={() => deleteRenewal.mutate(r)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <ContractFormDialog open={contractDialogOpen} onOpenChange={setContractDialogOpen} contract={editingContract} />
      <ContractRenewalFormDialog open={renewalDialogOpen} onOpenChange={setRenewalDialogOpen} renewal={editingRenewal} />
    </div>
  );
}
