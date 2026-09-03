import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Users, Shield, Lock, Unlock } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { IdentityFormDialog } from "@/pages/identity-form-dialog";
import { useUserIdentities, useDeleteUserIdentity } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { UserIdentity, IdentityStatus, IdentityType } from "@/lib/types";

const statusMap: Record<IdentityStatus, { label: string; variant: "success" | "warning" | "destructive" | "secondary" | "info" | "purple" }> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "secondary" },
  locked: { label: "Locked", variant: "destructive" },
  suspended: { label: "Suspended", variant: "warning" },
  pending_activation: { label: "Pending", variant: "info" },
  archived: { label: "Archived", variant: "secondary" },
};

const typeMap: Record<IdentityType, { label: string; color: string }> = {
  staff: { label: "Staff", color: "bg-blue-100 text-blue-700" },
  student: { label: "Student", color: "bg-emerald-100 text-emerald-700" },
  guardian: { label: "Guardian", color: "bg-amber-100 text-amber-700" },
  vendor: { label: "Vendor", color: "bg-slate-100 text-slate-700" },
  admin: { label: "Admin", color: "bg-violet-100 text-violet-700" },
  service_account: { label: "Service", color: "bg-rose-100 text-rose-700" },
};

export default function IdentityLifecycle() {
  const identities = useUserIdentities();
  const del = useDeleteUserIdentity();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<UserIdentity | undefined>();

  const rows = useMemo(() => {
    let list = identities.data ?? [];
    if (statusFilter !== "all") list = list.filter((u) => u.status === statusFilter);
    if (typeFilter !== "all") list = list.filter((u) => u.type === typeFilter);
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((u) => u.displayName.toLowerCase().includes(s) || u.username.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }
    return list;
  }, [identities.data, q, statusFilter, typeFilter]);

  const statuses = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "locked", label: "Locked" },
    { key: "suspended", label: "Suspended" },
    { key: "inactive", label: "Inactive" },
  ];

  const types = [
    { key: "all", label: "All types" },
    { key: "staff", label: "Staff" },
    { key: "admin", label: "Admin" },
    { key: "guardian", label: "Guardian" },
    { key: "student", label: "Student" },
  ];

  const activeCount = (identities.data ?? []).filter((u) => u.status === "active").length;
  const lockedCount = (identities.data ?? []).filter((u) => u.status === "locked").length;
  const mfaCount = (identities.data ?? []).filter((u) => u.mfaEnabled).length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Identity Lifecycle"
        titleNe="पहिचान जीवनचक्र"
        microModule="M02.01"
        description="User identity registry — create, activate, lock, suspend and archive user accounts with lifecycle state management."
        actions={
          <CanCreate resource="userIdentities">
            <Button onClick={() => { setEditing(undefined); setDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New identity
            </Button>
          </CanCreate>
        }
      />

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total identities</p><p className="text-lg font-bold">{identities.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Shield className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{activeCount}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-red-100 p-2 text-red-600"><Lock className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Locked</p><p className="text-lg font-bold">{lockedCount}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Shield className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">MFA enabled</p><p className="text-lg font-bold">{mfaCount}</p></div>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, username or email…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button key={s.key} onClick={() => setStatusFilter(s.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${statusFilter === s.key ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {types.map((t) => (
            <button key={t.key} onClick={() => setTypeFilter(t.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${typeFilter === t.key ? "bg-violet-600 text-white shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {identities.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Identity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>MFA</TableHead>
                  <TableHead>Last login</TableHead>
                  <TableHead>Failed</TableHead>
                  <TableHead className="pr-5" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((u) => {
                  const st = statusMap[u.status];
                  const tp = typeMap[u.type];
                  return (
                    <TableRow key={u.id} className="group">
                      <TableCell className="pl-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-violet-500/15 text-xs font-bold text-primary">
                            {u.displayName.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("")}
                          </div>
                          <div>
                            <p className="font-medium leading-tight">{u.displayName}</p>
                            <p className="text-xs text-muted-foreground">{u.username} · {u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tp.color}`}>{tp.label}</span></TableCell>
                      <TableCell><Badge variant={st.variant}><span className="h-1.5 w-1.5 rounded-full bg-current" />{st.label}</Badge></TableCell>
                      <TableCell>
                        {u.mfaEnabled ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600"><Shield className="h-3 w-3" /> {u.mfaMethod?.toUpperCase()}</span>
                        ) : <span className="text-xs text-muted-foreground">Off</span>}
                      </TableCell>
                      <TableCell><span className="text-sm">{u.lastLogin ? fmtDate(u.lastLogin) : "—"}</span></TableCell>
                      <TableCell>
                        {u.failedAttempts > 0 ? (
                          <Badge variant="destructive">{u.failedAttempts}</Badge>
                        ) : <span className="text-xs text-muted-foreground">0</span>}
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <RowActionMenu
                          resource="userIdentities"
                          onEdit={() => { setEditing(u); setDialogOpen(true); }}
                          onDelete={() => del.mutate(u)}
                          extraItems={
                            <>
                              <DropdownMenuItem><Lock /> Lock account</DropdownMenuItem>
                              <DropdownMenuItem><Unlock /> Unlock account</DropdownMenuItem>
                            </>
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {rows.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="h-28 text-center text-sm text-muted-foreground">No identities match your filters.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <IdentityFormDialog open={dialogOpen} onOpenChange={setDialogOpen} identity={editing} />
    </div>
  );
}
