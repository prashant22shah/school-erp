import { useMemo, useState } from "react";
import { MessageSquare, Search, Plus, Trash2, Clock, CheckCircle2, CalendarClock } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CounselingSessionFormDialog } from "@/pages/counseling-session-form-dialog";
import { FollowUpFormDialog } from "@/pages/follow-up-form-dialog";
import { useCounselingSessions, useFollowUps, useDeleteCounselingSession, useDeleteFollowUp } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { CounselingSession, FollowUp } from "@/lib/types";

const sessionStatusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  scheduled: "info", completed: "success", cancelled: "destructive", no_show: "warning",
};

const followUpStatusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  pending: "warning", completed: "success", overdue: "destructive", cancelled: "secondary",
};

export default function AdmissionsCounseling() {
  const sessions = useCounselingSessions();
  const followUps = useFollowUps();
  const deleteSession = useDeleteCounselingSession();
  const deleteFollowUp = useDeleteFollowUp();
  const [q, setQ] = useState("");
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CounselingSession | undefined>();
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | undefined>();

  const filteredSessions = useMemo(() => {
    let list = sessions.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.studentName.toLowerCase().includes(s) || c.counselorName.toLowerCase().includes(s) || c.notes.toLowerCase().includes(s)); }
    return list;
  }, [sessions.data, q]);

  const filteredFollowUps = useMemo(() => {
    let list = followUps.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((f) => f.studentName.toLowerCase().includes(s) || f.assignedTo.toLowerCase().includes(s) || f.action.toLowerCase().includes(s)); }
    return list;
  }, [followUps.data, q]);

  const totalSessions = sessions.data?.length ?? 0;
  const pendingFollowUps = (followUps.data ?? []).filter((f) => f.status === "pending").length;
  const completedSessions = (sessions.data ?? []).filter((c) => c.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={MessageSquare}
        title="Admissions Counseling"
        titleNe="प्रवेश परामर्श"
        microModule="M04.02"
        description="Manage counseling sessions and follow-up actions for student admissions."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="counselingSessions">
              <Button variant="outline" onClick={() => { setEditingSession(undefined); setSessionDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New session
              </Button>
            </CanCreate>
            <CanCreate resource="followUps">
              <Button onClick={() => { setEditingFollowUp(undefined); setFollowUpDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New follow-up
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><MessageSquare className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total sessions</p><p className="text-lg font-bold">{totalSessions}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Clock className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Pending follow-ups</p><p className="text-lg font-bold">{pendingFollowUps}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Completed sessions</p><p className="text-lg font-bold">{completedSessions}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search sessions, follow-ups…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Counseling Sessions</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-4">
          {sessions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Counselor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((c) => (
                      <TableRow key={c.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{c.studentName}</p>
                        </TableCell>
                        <TableCell><span className="text-sm">{c.counselorName}</span></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{c.type}</Badge></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(c.scheduledOn)}</span></TableCell>
                        <TableCell><span className="text-sm">{c.duration} min</span></TableCell>
                        <TableCell><span className="text-sm max-w-[150px] truncate inline-block">{c.outcome || "—"}</span></TableCell>
                        <TableCell><Badge variant={sessionStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="counselingSessions" onEdit={() => { setEditingSession(c); setSessionDialogOpen(true); }} onDelete={() => deleteSession.mutate(c)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="followups" className="mt-4">
          {followUps.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Assigned to</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Due date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFollowUps.map((f) => (
                      <TableRow key={f.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{f.studentName}</p>
                        </TableCell>
                        <TableCell><span className="text-sm">{f.assignedTo}</span></TableCell>
                        <TableCell><span className="text-sm max-w-[200px] truncate inline-block">{f.action}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(f.dueDate)}</span></TableCell>
                        <TableCell><Badge variant={followUpStatusVariant[f.status] ?? "secondary"} className="capitalize">{f.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="followUps" onEdit={() => { setEditingFollowUp(f); setFollowUpDialogOpen(true); }} onDelete={() => deleteFollowUp.mutate(f)} />
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

      <CounselingSessionFormDialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen} session={editingSession} />
      <FollowUpFormDialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen} followUp={editingFollowUp} />
    </div>
  );
}
