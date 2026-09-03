import { useMemo, useState } from "react";
import { ArrowRightLeft, Search, Plus, Ban, Eye, Clock, UserCheck, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { DelegationFormDialog } from "@/pages/delegation-form-dialog";
import { useDelegations, useImpersonationLogs, useRevokeDelegation } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";

export default function DelegationImpersonation() {
  const delegations = useDelegations();
  const impLogs = useImpersonationLogs();
  const revokeDel = useRevokeDelegation();
  const [q, setQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredDelegations = useMemo(() => {
    let list = delegations.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.delegatorName.toLowerCase().includes(s) || d.delegateName.toLowerCase().includes(s)); }
    return list;
  }, [delegations.data, q]);

  const activeDelegations = (delegations.data ?? []).filter((d) => d.status === "active").length;
  const activeImpersonations = (impLogs.data ?? []).filter((l) => l.status === "active").length;
  const totalImpActions = (impLogs.data ?? []).reduce((sum, l) => sum + l.actionsPerformed, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ArrowRightLeft}
        title="Delegation & Impersonation"
        titleNe="प्रतिनिधित्व तथा अनुकरण"
        microModule="M02.04"
        description="Temporary authority delegation during leave and admin impersonation for troubleshooting — with full audit trail."
        actions={
          <CanCreate resource="delegations">
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" /> New delegation
            </Button>
          </CanCreate>
        }
      />

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ArrowRightLeft className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active delegations</p><p className="text-lg font-bold">{activeDelegations}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Eye className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active impersonations</p><p className="text-lg font-bold">{activeImpersonations}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-600"><Clock className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total delegations</p><p className="text-lg font-bold">{delegations.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><UserCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Impersonation actions</p><p className="text-lg font-bold">{totalImpActions}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search delegator or delegate…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="delegations">
        <TabsList>
          <TabsTrigger value="delegations">Delegations</TabsTrigger>
          <TabsTrigger value="impersonation">Impersonation Log</TabsTrigger>
        </TabsList>

        <TabsContent value="delegations" className="mt-4">
          {delegations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Delegator</TableHead>
                      <TableHead>Delegate</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Valid</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDelegations.map((d) => (
                      <TableRow key={d.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{d.delegatorName}</p>
                          <p className="text-xs text-muted-foreground">{d.delegatorId}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{d.delegateName}</p>
                          <p className="text-xs text-muted-foreground">{d.delegateId}</p>
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{d.scope}</code></TableCell>
                        <TableCell><p className="max-w-[200px] truncate text-sm">{d.reason}</p></TableCell>
                        <TableCell>
                          <p className="text-xs">{fmtDate(d.validFrom)}</p>
                          <p className="text-xs text-muted-foreground">→ {fmtDate(d.validTo)}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={d.status === "active" ? "success" : d.status === "expired" ? "secondary" : "destructive"}>
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-5 text-right">
                          {d.status === "active" && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive opacity-0 group-hover:opacity-100" onClick={() => revokeDel.mutate(d)}>
                              <Ban className="h-3 w-3" /> Revoke
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="impersonation" className="mt-4">
          {impLogs.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Admin</TableHead>
                      <TableHead>Target user</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Ended</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(impLogs.data ?? []).map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="pl-5"><p className="font-medium">{l.adminName}</p></TableCell>
                        <TableCell><p className="font-medium">{l.targetName}</p><p className="text-xs text-muted-foreground">{l.targetUserId}</p></TableCell>
                        <TableCell><p className="max-w-[220px] truncate text-sm">{l.reason}</p></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(l.startedAt)}</span></TableCell>
                        <TableCell><span className="text-xs">{l.endedAt ? fmtDate(l.endedAt) : "—"}</span></TableCell>
                        <TableCell><Badge variant="secondary">{l.actionsPerformed}</Badge></TableCell>
                        <TableCell>
                          <Badge variant={l.status === "active" ? "warning" : l.status === "ended" ? "success" : "destructive"}>
                            {l.status === "active" && <AlertTriangle className="h-3 w-3" />}
                            {l.status}
                          </Badge>
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

      <DelegationFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
