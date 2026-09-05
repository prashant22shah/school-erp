import { useMemo, useState } from "react";
import { FileCheck, Search, Plus, CalendarClock, TrendingUp, CheckCircle2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SelectionEventFormDialog } from "@/pages/selection-event-form-dialog";
import { SelectionScoreFormDialog } from "@/pages/selection-score-form-dialog";
import { useSelectionEvents, useSelectionScores, useDeleteSelectionEvent, useDeleteSelectionScore } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { SelectionEvent, SelectionScore } from "@/lib/types";

const eventStatusVariant: Record<string, "success" | "info" | "warning" | "secondary"> = {
  scheduled: "info", completed: "success", cancelled: "warning", rescheduled: "secondary",
};

export default function EntranceTestInterview() {
  const events = useSelectionEvents();
  const scores = useSelectionScores();
  const deleteEvent = useDeleteSelectionEvent();
  const deleteScore = useDeleteSelectionScore();
  const [q, setQ] = useState("");
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SelectionEvent | undefined>();
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<SelectionScore | undefined>();

  const filteredEvents = useMemo(() => {
    let list = events.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.applicationName.toLowerCase().includes(s) || e.type.toLowerCase().includes(s) || (e.venue ?? "").toLowerCase().includes(s)); }
    return list;
  }, [events.data, q]);

  const filteredScores = useMemo(() => {
    let list = scores.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((sc) => sc.criterion.toLowerCase().includes(s) || sc.evaluatedBy.toLowerCase().includes(s)); }
    return list;
  }, [scores.data, q]);

  const totalEvents = events.data?.length ?? 0;
  const avgScore = (() => {
    const s = scores.data ?? [];
    if (!s.length) return 0;
    return Math.round(s.reduce((sum, sc) => sum + (sc.maxScore > 0 ? (sc.score / sc.maxScore) * 100 : 0), 0) / s.length);
  })();
  const passedEvents = (events.data ?? []).filter((e) => e.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileCheck}
        title="Entrance Test & Interview"
        titleNe="प्रवेश परीक्षा"
        microModule="M04.05"
        description="Schedule entrance tests and interviews, record selection scores."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="selectionEvents">
              <Button variant="outline" onClick={() => { setEditingEvent(undefined); setEventDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New event
              </Button>
            </CanCreate>
            <CanCreate resource="selectionScores">
              <Button onClick={() => { setEditingScore(undefined); setScoreDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New score
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CalendarClock className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total events</p><p className="text-lg font-bold">{totalEvents}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><TrendingUp className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Average score</p><p className="text-lg font-bold">{avgScore}%</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{passedEvents}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events, scores…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Selection Events</TabsTrigger>
          <TabsTrigger value="scores">Selection Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-4">
          {events.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Application</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((e) => (
                      <TableRow key={e.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{e.applicationName}</p>
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{e.type.replace(/_/g, " ")}</Badge></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(e.scheduledDate)}</span></TableCell>
                        <TableCell><span className="text-sm">{e.scheduledTime || "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{e.venue || "—"}</span></TableCell>
                        <TableCell><Badge variant={eventStatusVariant[e.status] ?? "secondary"} className="capitalize">{e.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="selectionEvents" onEdit={() => { setEditingEvent(e); setEventDialogOpen(true); }} onDelete={() => deleteEvent.mutate(e)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scores" className="mt-4">
          {scores.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Criterion</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Max score</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Evaluated by</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScores.map((sc) => (
                      <TableRow key={sc.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{sc.criterion}</p>
                        </TableCell>
                        <TableCell><span className="text-sm font-mono">{sc.score}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{sc.maxScore}</span></TableCell>
                        <TableCell><span className="text-sm">{sc.maxScore > 0 ? Math.round((sc.score / sc.maxScore) * 100) : 0}%</span></TableCell>
                        <TableCell><span className="text-sm">{sc.evaluatedBy}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="selectionScores" onEdit={() => { setEditingScore(sc); setScoreDialogOpen(true); }} onDelete={() => deleteScore.mutate(sc)} />
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

      <SelectionEventFormDialog open={eventDialogOpen} onOpenChange={setEventDialogOpen} event={editingEvent} />
      <SelectionScoreFormDialog open={scoreDialogOpen} onOpenChange={setScoreDialogOpen} score={editingScore} />
    </div>
  );
}
