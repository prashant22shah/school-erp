import { useMemo, useState } from "react";
import { BarChart3, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { WorkloadAllocationFormDialog } from "@/pages/workload-allocation-form-dialog";
import { useWorkloadAllocations, useDeleteWorkloadAllocation } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { WorkloadAllocation } from "@/lib/types";

const activityTypeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  teaching: "default", assessment: "info", administration: "secondary", guidance: "warning", extra_curricular: "success",
};

export default function TeachingWorkloadPage() {
  const allocations = useWorkloadAllocations();
  const deleteAllocation = useDeleteWorkloadAllocation();
  const [q, setQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WorkloadAllocation | undefined>();

  const filtered = useMemo(() => {
    let list = allocations.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.staffName.toLowerCase().includes(s) || a.activityType.toLowerCase().includes(s)); }
    return list;
  }, [allocations.data, q]);

  const totalAllocations = allocations.data?.length ?? 0;
  const teachingLoad = (allocations.data ?? []).filter((a) => a.activityType === "teaching").length;
  const assessmentLoad = (allocations.data ?? []).filter((a) => a.activityType === "assessment").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BarChart3}
        title="Teaching Workload"
        titleNe="शिक्षण कार्यभार"
        microModule="M06.04"
        description="Staff workload allocations by activity type and period."
        actions={
          <CanCreate resource="teachingWorkload">
            <Button onClick={() => { setEditing(undefined); setDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New Allocation
            </Button>
          </CanCreate>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BarChart3 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total allocations</p><p className="text-lg font-bold">{totalAllocations}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><BarChart3 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Teaching load</p><p className="text-lg font-bold">{teachingLoad}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><BarChart3 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Assessment load</p><p className="text-lg font-bold">{assessmentLoad}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search allocations…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {allocations.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Staff</TableHead>
                  <TableHead>Activity Type</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Period Start</TableHead>
                  <TableHead>Period End</TableHead>
                  <TableHead className="pr-5" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id} className="group">
                    <TableCell className="pl-5 font-medium">{a.staffName}</TableCell>
                    <TableCell><Badge variant={activityTypeVariant[a.activityType] ?? "secondary"} className="capitalize">{a.activityType.replace("_", " ")}</Badge></TableCell>
                    <TableCell><span className="text-sm font-mono">{a.units}</span></TableCell>
                    <TableCell><span className="text-sm">{a.periodStart}</span></TableCell>
                    <TableCell><span className="text-sm">{a.periodEnd}</span></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu resource="teachingWorkload" onEdit={() => { setEditing(a); setDialogOpen(true); }} onDelete={() => deleteAllocation.mutate(a)} editLabel="Edit allocation" deleteLabel="Delete allocation" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <WorkloadAllocationFormDialog open={dialogOpen} onOpenChange={setDialogOpen} allocation={editing} />
    </div>
  );
}
