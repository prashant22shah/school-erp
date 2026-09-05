import { useMemo, useState } from "react";
import { FileStack, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CourseContentFormDialog } from "@/pages/course-content-form-dialog";
import { LearningResourceFormDialog } from "@/pages/learning-resource-form-dialog";
import { useCourseContents, useLearningResources, useDeleteCourseContent, useDeleteLearningResource } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { CourseContent, LearningResource } from "@/lib/types";

const contentStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", published: "info", archived: "warning",
};

const accessVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  public: "success", restricted: "warning",
};

export default function ContentResourcesPage() {
  const contents = useCourseContents();
  const resources = useLearningResources();
  const deleteContent = useDeleteCourseContent();
  const deleteResource = useDeleteLearningResource();
  const [q, setQ] = useState("");
  const [contentOpen, setContentOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<CourseContent | undefined>();
  const [resourceOpen, setResourceOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<LearningResource | undefined>();

  const filteredContents = useMemo(() => {
    let list = contents.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.title.toLowerCase().includes(s) || c.type.toLowerCase().includes(s)); }
    return list;
  }, [contents.data, q]);

  const filteredResources = useMemo(() => {
    let list = resources.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.title.toLowerCase().includes(s) || r.type.toLowerCase().includes(s) || r.subject.toLowerCase().includes(s)); }
    return list;
  }, [resources.data, q]);

  const publishedCount = (contents.data ?? []).filter((c) => c.status === "published").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={FileStack} title="Content & Resources" titleNe="सामग्री" microModule="M10.02" description="Course content items and shared learning resources." actions={<div className="flex gap-2"><CanCreate resource="courseContents"><Button onClick={() => { setEditingContent(undefined); setContentOpen(true); }}><Plus className="h-4 w-4" /> New Content</Button></CanCreate><CanCreate resource="learningResources"><Button variant="outline" onClick={() => { setEditingResource(undefined); setResourceOpen(true); }}><Plus className="h-4 w-4" /> New Resource</Button></CanCreate></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileStack className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Contents</p><p className="text-lg font-bold">{contents.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FileStack className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{publishedCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><FileStack className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Resources</p><p className="text-lg font-bold">{resources.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by title, type or subject…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="contents">
        <TabsList><TabsTrigger value="contents">Contents</TabsTrigger><TabsTrigger value="resources">Resources</TabsTrigger></TabsList>

        <TabsContent value="contents" className="mt-4">
          {contents.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Course</TableHead><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>URL</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredContents.map((c) => (
              <TableRow key={c.id} className="group">
                <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.courseSpaceRef}</code></TableCell>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell><Badge variant="secondary" className="capitalize">{c.type}</Badge></TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">{c.url || "—"}</TableCell>
                <TableCell><Badge variant={contentStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="courseContents" onEdit={() => { setEditingContent(c); setContentOpen(true); }} onDelete={() => deleteContent.mutate(c.id)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="mt-4">
          {resources.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Title</TableHead><TableHead>Type</TableHead><TableHead>Subject</TableHead><TableHead>Grade</TableHead><TableHead>Access</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredResources.map((r) => (
              <TableRow key={r.id} className="group">
                <TableCell className="pl-5 font-medium">{r.title}</TableCell>
                <TableCell><Badge variant="secondary" className="capitalize">{r.type}</Badge></TableCell>
                <TableCell className="text-sm">{r.subject || "—"}</TableCell>
                <TableCell className="text-sm">{r.grade || "—"}</TableCell>
                <TableCell><Badge variant={accessVariant[r.accessLevel] ?? "secondary"} className="capitalize">{r.accessLevel}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="learningResources" onEdit={() => { setEditingResource(r); setResourceOpen(true); }} onDelete={() => deleteResource.mutate(r.id)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <CourseContentFormDialog open={contentOpen} onOpenChange={setContentOpen} editing={editingContent} />
      <LearningResourceFormDialog open={resourceOpen} onOpenChange={setResourceOpen} editing={editingResource} />
    </div>
  );
}
