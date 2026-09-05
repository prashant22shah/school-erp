import { useMemo, useState } from "react";
import { TrendingDown, Search, Plus, Calculator, AlertTriangle, DollarSign } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { DepreciationScheduleFormDialog } from "@/pages/depreciation-schedule-form-dialog";
import { ImpairmentFormDialog } from "@/pages/impairment-form-dialog";
import { useDepreciationSchedules, useImpairments, useDeleteDepreciationSchedule, useDeleteImpairment } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DepreciationSchedule, Impairment } from "@/lib/types";

const scheduleStatusVariant: Record<string, "info" | "success"> = {
  draft: "info", posted: "success",
};
const impairmentStatusVariant: Record<string, "info" | "success" | "secondary"> = {
  draft: "info", approved: "success", posted: "secondary",
};

export default function DepreciationImpairment() {
  const schedules = useDepreciationSchedules();
  const impairments = useImpairments();
  const deleteSchedule = useDeleteDepreciationSchedule();
  const deleteImpairment = useDeleteImpairment();
  const [q, setQ] = useState("");
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DepreciationSchedule | undefined>();
  const [impairmentDialogOpen, setImpairmentDialogOpen] = useState(false);
  const [editingImpairment, setEditingImpairment] = useState<Impairment | undefined>();

  const filteredSchedules = useMemo(() => {
    let list = schedules.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.assetName.toLowerCase().includes(s) || d.period.toLowerCase().includes(s)); }
    return list;
  }, [schedules.data, q]);

  const filteredImpairments = useMemo(() => {
    let list = impairments.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.assetName.toLowerCase().includes(s) || i.reason.toLowerCase().includes(s)); }
    return list;
  }, [impairments.data, q]);

  const totalDepreciation = (schedules.data ?? []).reduce((sum, d) => sum + (d.depreciationAmount ?? 0), 0);
  const totalImpairmentLoss = (impairments.data ?? []).reduce((sum, i) => sum + (i.impairmentLoss ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={TrendingDown}
        title="Depreciation & Impairment"
        titleNe="मूल्यह्रास"
        microModule="M15.06"
        description="Track asset depreciation schedules and record impairment losses."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="depreciationSchedules">
              <Button variant="outline" onClick={() => { setEditingSchedule(undefined); setScheduleDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New schedule
              </Button>
            </CanCreate>
            <CanCreate resource="impairments">
              <Button onClick={() => { setEditingImpairment(undefined); setImpairmentDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New impairment
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><TrendingDown className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Schedule entries</p><p className="text-lg font-bold">{schedules.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><DollarSign className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total depreciation</p><p className="text-lg font-bold">NPR {totalDepreciation.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><AlertTriangle className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Impairments</p><p className="text-lg font-bold">{impairments.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-red-100 p-2 text-red-600"><Calculator className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Impairment losses</p><p className="text-lg font-bold">NPR {totalImpairmentLoss.toLocaleString()}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search schedules, impairments…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="schedules">
        <TabsList>
          <TabsTrigger value="schedules">Depreciation Schedules</TabsTrigger>
          <TabsTrigger value="impairments">Impairments</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="mt-4">
          {schedules.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Asset</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Opening</TableHead>
                      <TableHead>Depreciation</TableHead>
                      <TableHead>Accumulated</TableHead>
                      <TableHead>Closing</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedules.map((d) => (
                      <TableRow key={d.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{d.assetName}</p></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{d.method?.replace(/_/g, " ") || "—"}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{d.period}</Badge></TableCell>
                        <TableCell><span className="text-sm font-mono">{d.openingValue?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono text-amber-600">{d.depreciationAmount?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{d.accumulatedDepreciation?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono font-medium">{d.closingValue?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><Badge variant={scheduleStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="depreciationSchedules" onEdit={() => { setEditingSchedule(d); setScheduleDialogOpen(true); }} onDelete={() => deleteSchedule.mutate(d)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="impairments" className="mt-4">
          {impairments.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Asset</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Carrying Value</TableHead>
                      <TableHead>Recoverable</TableHead>
                      <TableHead>Loss</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredImpairments.map((i) => (
                      <TableRow key={i.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{i.assetName}</p></TableCell>
                        <TableCell><span className="text-xs">{i.impairmentDate}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{i.carryingValue?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{i.recoverableAmount?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono text-destructive font-medium">{i.impairmentLoss?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{i.approvedBy || "—"}</span></TableCell>
                        <TableCell><Badge variant={impairmentStatusVariant[i.status] ?? "secondary"} className="capitalize">{i.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="impairments" onEdit={() => { setEditingImpairment(i); setImpairmentDialogOpen(true); }} onDelete={() => deleteImpairment.mutate(i)} />
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

      <DepreciationScheduleFormDialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen} editing={editingSchedule} />
      <ImpairmentFormDialog open={impairmentDialogOpen} onOpenChange={setImpairmentDialogOpen} editing={editingImpairment} />
    </div>
  );
}
