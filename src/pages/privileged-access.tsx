import { useMemo, useState } from "react";
import { Crown, Search, Plus, Shield, AlertTriangle, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PrivilegedAccessFormDialog } from "@/pages/privileged-access-form-dialog";
import { usePrivilegedAccess, useAccessReviews, useSavePrivilegedAccess } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { PrivilegeLevel, PrivilegedAccess as PAType } from "@/lib/types";

const levelMap: Record<PrivilegeLevel, { label: string; variant: "destructive" | "warning" | "info" | "secondary" }> = {
  standard: { label: "Standard", variant: "secondary" },
  elevated: { label: "Elevated", variant: "warning" },
  emergency: { label: "Emergency", variant: "destructive" },
  break_glass: { label: "Break-glass", variant: "destructive" },
};

const paStatusMap: Record<string, { variant: "success" | "warning" | "destructive" | "secondary" | "info" }> = {
  pending: { variant: "info" },
  approved: { variant: "success" },
  active: { variant: "success" },
  expired: { variant: "secondary" },
  revoked: { variant: "destructive" },
};

const reviewStatusMap: Record<string, { variant: "success" | "warning" | "info" | "secondary" }> = {
  draft: { variant: "secondary" },
  in_progress: { variant: "info" },
  completed: { variant: "success" },
  certified: { variant: "success" },
};

export default function PrivilegedAccessPage() {
  const pa = usePrivilegedAccess();
  const reviews = useAccessReviews();
  const savePA = useSavePrivilegedAccess();
  const [q, setQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredPA = useMemo(() => {
    let list = pa.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.userName.toLowerCase().includes(s) || p.resource.toLowerCase().includes(s)); }
    return list;
  }, [pa.data, q]);

  const activePA = (pa.data ?? []).filter((p) => p.status === "active").length;
  const pendingPA = (pa.data ?? []).filter((p) => p.status === "pending").length;
  const breakGlass = (pa.data ?? []).filter((p) => p.level === "break_glass").length;
  const activeReviews = (reviews.data ?? []).filter((r) => r.status === "in_progress").length;

  const approvePA = (p: PAType) => savePA.mutate({ ...p, status: "approved", approvedBy: "Anish Karki" });
  const revokePA = (p: PAType) => savePA.mutate({ ...p, status: "revoked" });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Crown}
        title="Privileged Access"
        titleNe="विशेष पहुँच"
        microModule="M02.06"
        description="Elevated, emergency and break-glass access requests with time-bound approval, usage limits and periodic access review certification."
        actions={
          <CanCreate resource="privilegedAccess">
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Request access
            </Button>
          </CanCreate>
        }
      />

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Crown className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active privileges</p><p className="text-lg font-bold">{activePA}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Clock className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Pending approval</p><p className="text-lg font-bold">{pendingPA}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-red-100 p-2 text-red-600"><AlertTriangle className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Break-glass</p><p className="text-lg font-bold">{breakGlass}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Eye className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active reviews</p><p className="text-lg font-bold">{activeReviews}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search user or resource…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="access">
        <TabsList>
          <TabsTrigger value="access">Privileged Access</TabsTrigger>
          <TabsTrigger value="reviews">Access Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="mt-4">
          {pa.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">User</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Valid</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPA.map((p) => {
                      const lvl = levelMap[p.level];
                      const st = paStatusMap[p.status];
                      return (
                        <TableRow key={p.id} className="group">
                          <TableCell className="pl-5">
                            <p className="font-medium">{p.userName}</p>
                            <p className="text-xs text-muted-foreground">By {p.requestedBy}</p>
                          </TableCell>
                          <TableCell><Badge variant={lvl.variant}>{lvl.label}</Badge></TableCell>
                          <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.resource}</code></TableCell>
                          <TableCell><p className="max-w-[200px] truncate text-sm">{p.reason}</p></TableCell>
                          <TableCell>
                            <p className="text-xs">{fmtDate(p.validFrom)}</p>
                            <p className="text-xs text-muted-foreground">→ {fmtDate(p.validTo)}</p>
                          </TableCell>
                          <TableCell>
                            <div className="w-20 space-y-1">
                              <p className="text-xs text-muted-foreground">{p.usedCount}{p.maxUses ? `/${p.maxUses}` : ""} uses</p>
                              {p.maxUses && <Progress value={(p.usedCount / p.maxUses) * 100} className="h-1.5" />}
                            </div>
                          </TableCell>
                          <TableCell><Badge variant={st!.variant}>{p.status}</Badge></TableCell>
                          <TableCell className="pr-5 text-right">
                            {p.status === "pending" && (
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-600" onClick={() => approvePA(p)}>
                                  <CheckCircle2 className="h-3 w-3" /> Approve
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => revokePA(p)}>
                                  <XCircle className="h-3 w-3" /> Reject
                                </Button>
                              </div>
                            )}
                            {p.status === "active" && (
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive opacity-0 group-hover:opacity-100" onClick={() => revokePA(p)}>
                                <XCircle className="h-3 w-3" /> Revoke
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          {reviews.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Period</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Approved / Revoked</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Certified by</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(reviews.data ?? []).map((r) => {
                      const st = reviewStatusMap[r.status];
                      const pct = r.totalIdentities > 0 ? Math.round((r.reviewed / r.totalIdentities) * 100) : 0;
                      return (
                        <TableRow key={r.id}>
                          <TableCell className="pl-5">
                            <p className="font-medium">{r.reviewPeriod}</p>
                            <p className="text-xs text-muted-foreground">Started {fmtDate(r.startedOn)}</p>
                          </TableCell>
                          <TableCell><span className="text-sm">{r.scope}</span></TableCell>
                          <TableCell><span className="text-sm">{r.reviewerName}</span></TableCell>
                          <TableCell>
                            <div className="w-32 space-y-1">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{r.reviewed}/{r.totalIdentities}</span>
                                <span>{pct}%</span>
                              </div>
                              <Progress value={pct} className="h-1.5" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="h-3 w-3" />{r.approved}</span>
                              <span className="flex items-center gap-1 text-xs text-destructive"><XCircle className="h-3 w-3" />{r.revoked}</span>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant={st!.variant}>{r.status.replace("_", " ")}</Badge></TableCell>
                          <TableCell><span className="text-sm">{r.certifiedBy ?? "—"}</span></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <PrivilegedAccessFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
