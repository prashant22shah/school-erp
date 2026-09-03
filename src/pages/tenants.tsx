import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Users, HardDrive, ShieldAlert } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { TenantFormDialog } from "@/pages/tenant-form-dialog";
import { useTenants, useDeleteTenant } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TenantStatusBadge, EditionBadge, EnvBadge } from "@/components/status-badges";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Tenant } from "@/lib/types";

export default function Tenants() {
  const tenants = useTenants();
  const del = useDeleteTenant();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | undefined>();

  const rows = useMemo(() => {
    let list = tenants.data ?? [];
    if (statusFilter !== "all") list = list.filter((t) => t.status === statusFilter);
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(s) || t.code.toLowerCase().includes(s));
    }
    return list;
  }, [tenants.data, q, statusFilter]);

  const statuses: { key: string; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "trial", label: "Trial" },
    { key: "suspended", label: "Suspended" },
    { key: "read_only", label: "Read-only" },
    { key: "archived", label: "Archived" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldAlert}
        title="Tenants & Subscriptions"
        titleNe="किरायेदार तथा सदस्यता"
        microModule="M01.01"
        description="Institution tenants with immutable codes, lifecycle states, licensed modules, quotas and usage metering."
        actions={
          <CanCreate resource="tenants">
            <Button onClick={() => { setEditing(undefined); setDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New tenant
            </Button>
          </CanCreate>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name or tenant code…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === s.key ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

  ];

      {tenants.isLoading ? (
        <LoadingBlock />
      ) : (
        <Card className="animate-fade-up">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Tenant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>Valid till</TableHead>
                  <TableHead className="pr-5" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => {
                  const seatPct = Math.min(100, Math.round((t.usage.users / t.userLimit) * 100));
                  const storPct = Math.min(100, Math.round((t.usage.storageGb / t.storageLimitGb) * 100));
                  return (
                    <TableRow key={t.id} className="group">
                      <TableCell className="pl-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-violet-500/15 text-sm font-bold text-primary">
                            {t.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium leading-tight">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{t.code} · {t.contactEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><TenantStatusBadge status={t.status} /></TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-1">
                          <EditionBadge edition={t.edition} />
                          <EnvBadge env={t.environment} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-28 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" /> {t.usage.users}/{t.userLimit}
                          </div>
                          <Progress value={seatPct} className="h-1.5" indicatorClassName={seatPct > 85 ? "bg-amber-500" : undefined} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-28 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <HardDrive className="h-3 w-3" /> {t.usage.storageGb}/{t.storageLimitGb} GB
                          </div>
                          <Progress value={storPct} className="h-1.5" indicatorClassName={storPct > 85 ? "bg-amber-500" : undefined} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{fmtDate(t.validTo)}</span>
                        <div className="mt-0.5"><Badge variant="secondary" className="text-[10px]">{t.licensedModules.length} modules</Badge></div>
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <RowActionMenu resource="tenants" onEdit={() => { setEditing(t); setDialogOpen(true); }} onDelete={() => del.mutate(t)} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-28 text-center text-sm text-muted-foreground">
                      No tenants match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <TenantFormDialog open={dialogOpen} onOpenChange={setDialogOpen} tenant={editing} />
    </div>
  );
}

