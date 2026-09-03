import { useMemo, useState } from "react";
import { LogOut, FileText, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SeparationFormDialog } from "@/pages/separation-form-dialog";
import { StaffContractFormDialog } from "@/pages/staff-contract-form-dialog";
import { useSeparations, useStaffContracts, useDeleteSeparation, useDeleteStaffContract } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Separation, StaffContract } from "@/lib/types";

const separationTypeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  resignation: "secondary",
  retirement: "info",
  termination: "destructive",
  transfer: "warning",
};

const separationStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning",
  approved: "info",
  completed: "success",
  cancelled: "secondary",
};

const contractTypeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  permanent: "success",
  contract: "info",
  probation: "warning",
  temporary: "secondary",
};

const contractStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  active: "success",
  expired: "warning",
  terminated: "destructive",
};

export default function SeparationsPage() {
  const separations = useSeparations();
  const contracts = useStaffContracts();
  const deleteSeparation = useDeleteSeparation();
  const deleteContract = useDeleteStaffContract();
  const [q, setQ] = useState("");
  const [sepOpen, setSepOpen] = useState(false);
  const [editingSep, setEditingSep] = useState<Separation | undefined>();
  const [contractOpen, setContractOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<StaffContract | undefined>();

  const filteredSeps = useMemo(() => {
    let list = separations.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.staffName.toLowerCase().includes(s) || r.type.toLowerCase().includes(s) || r.status.toLowerCase().includes(s) || r.reason.toLowerCase().includes(s));
    }
    return list;
  }, [separations.data, q]);

  const filteredContracts = useMemo(() => {
    let list = contracts.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((c) => c.staffName.toLowerCase().includes(s) || c.contractType.toLowerCase().includes(s) || c.status.toLowerCase().includes(s));
    }
    return list;
  }, [contracts.data, q]);

  const pendingSeps = (separations.data ?? []).filter((s) => s.status === "pending").length;
  const activeContracts = (contracts.data ?? []).filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={LogOut} title="Separations & Contracts" titleNe="अवकाश र करार" microModule="M13.10" description="Staff separations, off-boarding and employment contracts." actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { setEditingSep(undefined); setSepOpen(true); }}><CanCreate resource="separations">New Separation</CanCreate></Button><Button onClick={() => { setEditingContract(undefined); setContractOpen(true); }}> New Contract</Button></div>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><LogOut className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Separations</p><p className="text-lg font-bold">{separations.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><LogOut className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{pendingSeps}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Contracts</p><p className="text-lg font-bold">{contracts.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Contracts</p><p className="text-lg font-bold">{activeContracts}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search separations or contracts…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="separations">
        <TabsList><TabsTrigger value="separations">Separations</TabsTrigger><TabsTrigger value="contracts">Staff Contracts</TabsTrigger></TabsList>

        <TabsContent value="separations" className="mt-4">
          {separations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Type</TableHead><TableHead>Last Working Date</TableHead><TableHead>Status</TableHead><TableHead>Reason</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSeps.map((s) => (<TableRow key={s.id} className="group"><TableCell className="pl-5 font-medium">{s.staffName}</TableCell><TableCell><Badge variant={separationTypeVariant[s.type] ?? "secondary"} className="capitalize">{s.type}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(s.lastWorkingDate)}</span></TableCell><TableCell><Badge variant={separationStatusVariant[s.status] ?? "secondary"} className="capitalize">{s.status}</Badge></TableCell><TableCell><span className="line-clamp-1 max-w-[260px] text-sm text-muted-foreground">{s.reason}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="separations" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="contracts" className="mt-4">
          {contracts.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Contract Type</TableHead><TableHead>Start Date</TableHead><TableHead>End Date</TableHead><TableHead>Salary</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredContracts.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5 font-medium">{c.staffName}</TableCell><TableCell><Badge variant={contractTypeVariant[c.contractType] ?? "secondary"} className="capitalize">{c.contractType}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(c.startDate)}</span></TableCell><TableCell><span className="text-sm">{c.endDate ? fmtDate(c.endDate) : "—"}</span></TableCell><TableCell><span className="text-sm font-mono">{c.salary.toLocaleString()}</span></TableCell><TableCell><Badge variant={contractStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="separations" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <SeparationFormDialog open={sepOpen} onOpenChange={setSepOpen} separation={editingSep} />
      <StaffContractFormDialog open={contractOpen} onOpenChange={setContractOpen} contract={editingContract} />
    </div>
  );
}
