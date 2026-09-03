import { useMemo, useState } from "react";
import { ShieldCheck, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { QualityReviewFormDialog } from "@/pages/quality-review-form-dialog";
import { QualityEvidenceFormDialog } from "@/pages/quality-evidence-form-dialog";
import { useQualityReviews, useQualityEvidences, useDeleteQualityReview, useDeleteQualityEvidence } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { QualityReview, QualityEvidence } from "@/lib/types";

const reviewStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", in_progress: "info", completed: "success", certified: "default",
};

export default function QualityReviewPage() {
  const reviews = useQualityReviews();
  const evidences = useQualityEvidences();
  const deleteReview = useDeleteQualityReview();
  const deleteEvidence = useDeleteQualityEvidence();
  const [q, setQ] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<QualityReview | undefined>();
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<QualityEvidence | undefined>();

  const filteredReviews = useMemo(() => {
    let list = reviews.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.scopeType.toLowerCase().includes(s) || r.reviewType.toLowerCase().includes(s) || r.cycle.toLowerCase().includes(s) || (r.findings ?? "").toLowerCase().includes(s)); }
    return list;
  }, [reviews.data, q]);

  const filteredEvidences = useMemo(() => {
    let list = evidences.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.objectRef.toLowerCase().includes(s) || e.objectType.toLowerCase().includes(s) || e.description.toLowerCase().includes(s)); }
    return list;
  }, [evidences.data, q]);

  const completedReviews = (reviews.data ?? []).filter((r) => r.status === "completed" || r.status === "certified").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldCheck}
        title="Quality Review"
        titleNe="गुणस्तर समीक्षा"
        microModule="M06.05"
        description="Quality reviews and evidence tracking."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="qualityReviews">
              <Button variant="outline" onClick={() => { setEditingReview(undefined); setReviewDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New Review
              </Button>
            </CanCreate>
            <CanCreate resource="qualityReviews">
              <Button onClick={() => { setEditingEvidence(undefined); setEvidenceDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New Evidence
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ShieldCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total reviews</p><p className="text-lg font-bold">{reviews.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ShieldCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completedReviews}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ShieldCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Evidence items</p><p className="text-lg font-bold">{evidences.data?.length ?? 0}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reviews or evidence…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="reviews">
        <TabsList>
          <TabsTrigger value="reviews">Quality Reviews</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-4">
          {reviews.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Scope</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Cycle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Findings</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map((r) => (
                      <TableRow key={r.id} className="group">
                        <TableCell className="pl-5"><Badge variant="secondary" className="capitalize">{r.scopeType}</Badge></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{r.reviewType}</Badge></TableCell>
                        <TableCell><span className="text-sm">{r.cycle}</span></TableCell>
                        <TableCell><Badge variant={reviewStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{r.findings ?? "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="qualityReviews" onEdit={() => { setEditingReview(r); setReviewDialogOpen(true); }} onDelete={() => deleteReview.mutate(r)} editLabel="Edit review" deleteLabel="Delete review" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="evidence" className="mt-4">
          {evidences.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Object Ref</TableHead>
                      <TableHead>Object Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvidences.map((e) => (
                      <TableRow key={e.id} className="group">
                        <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{e.objectRef}</code></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{e.objectType}</Badge></TableCell>
                        <TableCell><span className="line-clamp-1 text-sm">{e.description}</span></TableCell>
                        <TableCell><Badge variant="secondary">{e.reviewId}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="qualityReviews" onEdit={() => { setEditingEvidence(e); setEvidenceDialogOpen(true); }} onDelete={() => deleteEvidence.mutate(e)} editLabel="Edit evidence" deleteLabel="Delete evidence" />
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

      <QualityReviewFormDialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen} review={editingReview} />
      <QualityEvidenceFormDialog open={evidenceDialogOpen} onOpenChange={setEvidenceDialogOpen} evidence={editingEvidence} />
    </div>
  );
}
