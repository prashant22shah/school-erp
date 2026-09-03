import { useMemo, useState } from "react";
import { Award, DollarSign, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PerformanceReviewFormDialog } from "@/pages/performance-review-form-dialog";
import { CompensationFormDialog } from "@/pages/compensation-form-dialog";
import { usePerformanceReviews, useCompensations, useDeletePerformanceReview, useDeleteCompensation } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { PerformanceReview, Compensation } from "@/lib/types";

const reviewStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  draft: "secondary",
  submitted: "info",
  approved: "success",
  acknowledged: "purple",
};

const compVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  basic: "default",
  allowance: "info",
  bonus: "success",
  deduction: "destructive",
};

export default function PerformancePage() {
  const reviews = usePerformanceReviews();
  const compensations = useCompensations();
  const deleteReview = useDeletePerformanceReview();
  const deleteComp = useDeleteCompensation();
  const [q, setQ] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<PerformanceReview | undefined>();
  const [compOpen, setCompOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<Compensation | undefined>();

  const filteredReviews = useMemo(() => {
    let list = reviews.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.staffName.toLowerCase().includes(s) || r.period.toLowerCase().includes(s) || r.reviewer.toLowerCase().includes(s) || r.status.toLowerCase().includes(s));
    }
    return list;
  }, [reviews.data, q]);

  const filteredComps = useMemo(() => {
    let list = compensations.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((c) => c.staffName.toLowerCase().includes(s) || c.component.toLowerCase().includes(s));
    }
    return list;
  }, [compensations.data, q]);

  const approvedReviews = (reviews.data ?? []).filter((r) => r.status === "approved").length;
  const totalCompAmount = (compensations.data ?? []).reduce((sum, c) => sum + (c.component === "deduction" ? -c.amount : c.amount), 0);

  return (
    <div className="space-y-6">
      <PageHeader icon={Award} title="Performance & Compensation" titleNe="कार्यसम्पादन र पारिश्रमिक" microModule="M13.05/M13.06" description="Performance reviews, ratings and salary components." actions={<div className="flex flex-wrap gap-2"><CanCreate resource="performanceReviews"><Button variant="outline" onClick={() => { setEditingReview(undefined); setReviewOpen(true); }}>New Review</Button></CanCreate><Button onClick={() => { setEditingComp(undefined); setCompOpen(true); }}> New Compensation</Button></div>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Award className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Reviews</p><p className="text-lg font-bold">{reviews.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Award className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Approved</p><p className="text-lg font-bold">{approvedReviews}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><DollarSign className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Compensations</p><p className="text-lg font-bold">{compensations.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><DollarSign className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Net Total</p><p className="text-lg font-bold">{totalCompAmount.toLocaleString()}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search reviews or compensations…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="reviews">
        <TabsList><TabsTrigger value="reviews">Performance Reviews</TabsTrigger><TabsTrigger value="compensations">Compensations</TabsTrigger></TabsList>

        <TabsContent value="reviews" className="mt-4">
          {reviews.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Period</TableHead><TableHead>Rating</TableHead><TableHead>Reviewer</TableHead><TableHead>Status</TableHead><TableHead>Remarks</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredReviews.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.staffName}</TableCell><TableCell><Badge variant="secondary">{r.period}</Badge></TableCell><TableCell><span className="text-sm font-mono">{r.rating} / 5</span></TableCell><TableCell><span className="text-sm text-muted-foreground">{r.reviewer}</span></TableCell><TableCell><Badge variant={reviewStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell><span className="line-clamp-1 max-w-[200px] text-sm text-muted-foreground">{r.remarks ?? "—"}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="performanceReviews" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="compensations" className="mt-4">
          {compensations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Component</TableHead><TableHead>Amount</TableHead><TableHead>Effective From</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredComps.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5 font-medium">{c.staffName}</TableCell><TableCell><Badge variant={compVariant[c.component] ?? "secondary"} className="capitalize">{c.component}</Badge></TableCell><TableCell><span className="text-sm font-mono">{c.amount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{c.effectiveFrom.slice(0, 10)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="compensation" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <PerformanceReviewFormDialog open={reviewOpen} onOpenChange={setReviewOpen} review={editingReview} />
      <CompensationFormDialog open={compOpen} onOpenChange={setCompOpen} compensation={editingComp} />
    </div>
  );
}
