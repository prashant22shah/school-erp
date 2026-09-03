import { useMemo, useState } from "react";
import { Users, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ModerationReviewFormDialog } from "@/pages/moderation-review-form-dialog";
import { ReviewActionFormDialog } from "@/pages/review-action-form-dialog";
import { useModerationReviews, useReviewActions, useDeleteModerationReview, useDeleteReviewAction } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { ModerationReview, ReviewAction } from "@/lib/types";

const outcomeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  agreed: "success", disagreed: "warning", revised: "info", pending: "secondary",
};

const actionStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", open: "info", in_progress: "info", completed: "success", overdue: "warning",
};

export default function FacultyReviewPage() {
  const moderations = useModerationReviews();
  const actions = useReviewActions();
  const deleteModeration = useDeleteModerationReview();
  const deleteAction = useDeleteReviewAction();
  const [q, setQ] = useState("");
  const [moderationDialogOpen, setModerationDialogOpen] = useState(false);
  const [editingModeration, setEditingModeration] = useState<ModerationReview | undefined>();
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<ReviewAction | undefined>();

  const filteredModerations = useMemo(() => {
    let list = moderations.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => m.subjectName.toLowerCase().includes(s) || m.reviewerName.toLowerCase().includes(s) || m.outcome.toLowerCase().includes(s)); }
    return list;
  }, [moderations.data, q]);

  const filteredActions = useMemo(() => {
    let list = actions.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.action.toLowerCase().includes(s) || a.ownerName.toLowerCase().includes(s) || a.status.toLowerCase().includes(s) || a.dueDate.includes(s)); }
    return list;
  }, [actions.data, q]);

  const agreedModerations = (moderations.data ?? []).filter((m) => m.outcome === "agreed").length;
  const openActions = (actions.data ?? []).filter((a) => a.status === "open" || a.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Faculty Review"
        titleNe="शिक्षक समीक्षा"
        microModule="M06.06"
        description="Moderation reviews and review actions for faculty quality assurance."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingModeration(undefined); setModerationDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New Moderation
            </Button>
            <Button onClick={() => { setEditingAction(undefined); setActionDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New Action
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Users className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Moderations</p><p className="text-lg font-bold">{moderations.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Agreed</p><p className="text-lg font-bold">{agreedModerations}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Users className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Open actions</p><p className="text-lg font-bold">{openActions}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search moderations or actions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="moderations">
        <TabsList>
          <TabsTrigger value="moderations">Moderation Reviews</TabsTrigger>
          <TabsTrigger value="actions">Review Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="moderations" className="mt-4">
          {moderations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Subject</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Anonymous</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModerations.map((m) => (
                      <TableRow key={m.id} className="group">
                        <TableCell className="pl-5 font-medium">{m.subjectName}</TableCell>
                        <TableCell><Badge variant={outcomeVariant[m.outcome] ?? "secondary"} className="capitalize">{m.outcome.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm">{m.reviewerName}</span></TableCell>
                        <TableCell><Badge variant={m.isAnonymous ? "warning" : "secondary"}>{m.isAnonymous ? "Yes" : "No"}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingModeration(m); setModerationDialogOpen(true); }}><Pencil /> Edit moderation</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteModeration.mutate(m)}><Trash2 /> Delete moderation</DropdownMenuItem>
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

        <TabsContent value="actions" className="mt-4">
          {actions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Action</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActions.map((a) => (
                      <TableRow key={a.id} className="group">
                        <TableCell className="pl-5"><span className="line-clamp-1 text-sm">{a.action}</span></TableCell>
                        <TableCell><span className="text-sm">{a.ownerName}</span></TableCell>
                        <TableCell><span className="text-sm">{a.dueDate}</span></TableCell>
                        <TableCell><Badge variant={actionStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingAction(a); setActionDialogOpen(true); }}><Pencil /> Edit action</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteAction.mutate(a)}><Trash2 /> Delete action</DropdownMenuItem>
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

      <ModerationReviewFormDialog open={moderationDialogOpen} onOpenChange={setModerationDialogOpen} moderation={editingModeration} />
      <ReviewActionFormDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen} action={editingAction} />
    </div>
  );
}
