import { useMemo, useState } from "react";
import { ShieldCheck, Search, Plus, Pencil, Trash2, Users, Lock, MapPin } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { RoleFormDialog } from "@/pages/role-form-dialog";
import { UserRoleFormDialog } from "@/pages/user-role-form-dialog";
import { DataScopeFormDialog } from "@/pages/data-scope-form-dialog";
import { useRoles, useUserRoles, useDataScopes, useDeleteRole, useDeleteUserRole, useDeleteDataScope } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { Role, UserRole } from "@/lib/types";

export default function RbacAbac() {
  const roles = useRoles();
  const userRoles = useUserRoles();
  const dataScopes = useDataScopes();
  const deleteRole = useDeleteRole();
  const deleteUserRole = useDeleteUserRole();
  const deleteScope = useDeleteDataScope();
  const [q, setQ] = useState("");
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>();
  const [urDialogOpen, setUrDialogOpen] = useState(false);
  const [editingUr, setEditingUr] = useState<UserRole | undefined>();
  const [dsDialogOpen, setDsDialogOpen] = useState(false);

  const filteredRoles = useMemo(() => {
    let list = roles.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.name.toLowerCase().includes(s) || r.code.toLowerCase().includes(s)); }
    return list;
  }, [roles.data, q]);

  const filteredUserRoles = useMemo(() => {
    let list = userRoles.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((ur) => ur.userName.toLowerCase().includes(s) || ur.roleName.toLowerCase().includes(s)); }
    return list;
  }, [userRoles.data, q]);

  const systemRoles = (roles.data ?? []).filter((r) => r.isSystem).length;
  const activeAssignments = (userRoles.data ?? []).filter((ur) => ur.isActive).length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldCheck}
        title="RBAC, ABAC & Data Scope"
        titleNe="भूमिका तथा डाटा स्कोप"
        microModule="M02.03"
        description="Role-based and attribute-based access control — roles, permissions, user-role assignments and data scope boundaries."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="roles">
              <Button variant="outline" onClick={() => { setEditingRole(undefined); setRoleDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New role
              </Button>
            </CanCreate>
            <CanCreate resource="roles">
              <Button onClick={() => { setEditingUr(undefined); setUrDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> Assign role
              </Button>
            </CanCreate>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ShieldCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total roles</p><p className="text-lg font-bold">{roles.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Lock className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">System roles</p><p className="text-lg font-bold">{systemRoles}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active assignments</p><p className="text-lg font-bold">{activeAssignments}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><MapPin className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Data scopes</p><p className="text-lg font-bold">{dataScopes.data?.length ?? 0}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search roles or assignments…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="roles">
        <TabsList>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="assignments">User-Role Assignments</TabsTrigger>
          <TabsTrigger value="scopes">Data Scopes</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-4">
          {roles.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Role</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((r) => (
                      <TableRow key={r.id} className="group">
                        <TableCell className="pl-5">
                          <div>
                            <p className="font-medium">{r.name}</p>
                            {r.nameNe && <p className="text-xs text-muted-foreground">{r.nameNe}</p>}
                            <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                          </div>
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.code}</code></TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {r.permissions.slice(0, 3).map((p) => (
                              <Badge key={p.id} variant={p.effect === "deny" ? "destructive" : "secondary"} className="text-[10px]">
                                {p.resource}:{p.action}
                              </Badge>
                            ))}
                            {r.permissions.length > 3 && <Badge variant="secondary" className="text-[10px]">+{r.permissions.length - 3}</Badge>}
                          </div>
                        </TableCell>
                        <TableCell><span className="text-sm font-mono">{r.priority}</span></TableCell>
                        <TableCell>
                          {r.isSystem ? <Badge variant="info">System</Badge> : <Badge variant="secondary">Custom</Badge>}
                          {r.isDefault && <Badge variant="success" className="ml-1">Default</Badge>}
                        </TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="roles" onEdit={() => { setEditingRole(r); setRoleDialogOpen(true); }} onDelete={!r.isSystem ? () => deleteRole.mutate(r) : undefined} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          {userRoles.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Assigned by</TableHead>
                      <TableHead>Valid</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUserRoles.map((ur) => (
                      <TableRow key={ur.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{ur.userName}</p><p className="text-xs text-muted-foreground">{ur.userId}</p></TableCell>
                        <TableCell><Badge variant="purple">{ur.roleName}</Badge></TableCell>
                        <TableCell>
                          <p className="text-sm">{ur.scope}</p>
                          {ur.scopeName && <p className="text-xs text-muted-foreground">{ur.scopeName}</p>}
                        </TableCell>
                        <TableCell><span className="text-sm">{ur.assignedBy}</span></TableCell>
                        <TableCell>
                          <p className="text-xs">{fmtDate(ur.validFrom)}</p>
                          {ur.validTo && <p className="text-xs text-muted-foreground">→ {fmtDate(ur.validTo)}</p>}
                        </TableCell>
                        <TableCell>
                          {ur.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                        </TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="roles" onEdit={() => { setEditingUr(ur); setUrDialogOpen(true); }} onDelete={ur.isActive ? () => deleteUserRole.mutate(ur) : undefined} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scopes" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={() => setDsDialogOpen(true)}><Plus className="h-3 w-3" /> Grant scope</Button>
          </div>
          {dataScopes.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">User</TableHead>
                      <TableHead>Scope Type</TableHead>
                      <TableHead>Scope Name</TableHead>
                      <TableHead>Granted by</TableHead>
                      <TableHead>Granted on</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(dataScopes.data ?? []).map((ds) => (
                      <TableRow key={ds.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{ds.userName}</p></TableCell>
                        <TableCell><Badge variant="secondary">{ds.scopeType}</Badge></TableCell>
                        <TableCell><span className="text-sm">{ds.scopeName}</span></TableCell>
                        <TableCell><span className="text-sm">{ds.grantedBy}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(ds.grantedOn)}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteScope.mutate(ds)}><Trash2 /> Revoke scope</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <RoleFormDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen} role={editingRole} />
      <UserRoleFormDialog open={urDialogOpen} onOpenChange={setUrDialogOpen} userRole={editingUr} />
      <DataScopeFormDialog open={dsDialogOpen} onOpenChange={setDsDialogOpen} />
    </div>
  );
}
