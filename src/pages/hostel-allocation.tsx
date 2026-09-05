import { useMemo, useState } from "react";
import { Home, Search, Plus, FileText, KeyRound } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { HostelApplicationFormDialog } from "@/pages/hostel-application-form-dialog";
import { RoomAllocationFormDialog } from "@/pages/room-allocation-form-dialog";
import { useHostelApplications, useRoomAllocations, useDeleteHostelApplication, useDeleteRoomAllocation } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { HostelApplication, RoomAllocation } from "@/lib/types";

const appStatusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  pending: "warning", approved: "success", rejected: "destructive", waitlisted: "info", cancelled: "secondary",
};
const allocStatusVariant: Record<string, "success" | "secondary" | "warning" | "destructive"> = {
  active: "success", vacated: "secondary", transferred: "warning", terminated: "destructive",
};

export default function HostelAllocation() {
  const applications = useHostelApplications();
  const allocations = useRoomAllocations();
  const deleteApp = useDeleteHostelApplication();
  const deleteAlloc = useDeleteRoomAllocation();
  const [q, setQ] = useState("");
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<HostelApplication | undefined>();
  const [allocDialogOpen, setAllocDialogOpen] = useState(false);
  const [editingAlloc, setEditingAlloc] = useState<RoomAllocation | undefined>();

  const filteredApps = useMemo(() => {
    let list = applications.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.studentName.toLowerCase().includes(s) || a.applicationNo.toLowerCase().includes(s) || a.blockPreference.toLowerCase().includes(s)); }
    return list;
  }, [applications.data, q]);

  const filteredAllocs = useMemo(() => {
    let list = allocations.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.studentName.toLowerCase().includes(s) || a.blockName.toLowerCase().includes(s) || a.roomNo.toLowerCase().includes(s)); }
    return list;
  }, [allocations.data, q]);

  const totalApps = applications.data?.length ?? 0;
  const approvedApps = (applications.data ?? []).filter((a) => a.status === "approved").length;
  const activeAllocs = (allocations.data ?? []).filter((a) => a.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Home}
        title="Application & Allocation"
        titleNe="आवेदन"
        microModule="M18.02"
        description="Manage hostel applications, approvals, and room/bed allocations."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="hostel">
              <Button variant="outline" onClick={() => { setEditingApp(undefined); setAppDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New application
              </Button>
            </CanCreate>
            <CanCreate resource="hostel">
              <Button onClick={() => { setEditingAlloc(undefined); setAllocDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New allocation
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileText className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total applications</p><p className="text-lg font-bold">{totalApps}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Home className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Approved</p><p className="text-lg font-bold">{approvedApps}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><KeyRound className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active allocations</p><p className="text-lg font-bold">{activeAllocs}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search applications, allocations…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-4">
          {applications.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>App No</TableHead>
                      <TableHead>Block Pref</TableHead>
                      <TableHead>Room Type Pref</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Consent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApps.map((a) => (
                      <TableRow key={a.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{a.studentName}</p></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.applicationNo}</code></TableCell>
                        <TableCell><span className="text-sm">{a.blockPreference}</span></TableCell>
                        <TableCell><span className="text-sm">{a.roomTypePreference}</span></TableCell>
                        <TableCell><Badge variant="secondary">{a.session}</Badge></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(a.appliedOn)}</span></TableCell>
                        <TableCell>{a.guardianConsent ? <Badge variant="success">Yes</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                        <TableCell><Badge variant={appStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="hostel" onEdit={() => { setEditingApp(a); setAppDialogOpen(true); }} onDelete={() => deleteApp.mutate(a)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="allocations" className="mt-4">
          {allocations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Bed</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAllocs.map((a) => (
                      <TableRow key={a.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{a.studentName}</p></TableCell>
                        <TableCell><span className="text-sm">{a.blockName}</span></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.roomNo}</code></TableCell>
                        <TableCell><span className="text-sm">{a.bedNo}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(a.allocatedFrom)}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(a.allocatedTo)}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{a.feeAmount?.toLocaleString()}</span></TableCell>
                        <TableCell><Badge variant={allocStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="hostel" onEdit={() => { setEditingAlloc(a); setAllocDialogOpen(true); }} onDelete={() => deleteAlloc.mutate(a)} />
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

      <HostelApplicationFormDialog open={appDialogOpen} onOpenChange={setAppDialogOpen} editing={editingApp} />
      <RoomAllocationFormDialog open={allocDialogOpen} onOpenChange={setAllocDialogOpen} editing={editingAlloc} />
    </div>
  );
}
