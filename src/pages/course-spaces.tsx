import { useMemo, useState } from "react";
import { Monitor, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CourseSpaceFormDialog } from "@/pages/course-space-form-dialog";
import { useCourseSpaces, useCourseRosters, useDeleteCourseSpace, useDeleteCourseRoster } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { CourseSpace, CourseRoster } from "@/lib/types";

const courseSpaceStatusVariant: Record<string, "secondary" | "success" | "warning"> = {
  draft: "secondary", active: "success", archived: "warning",
};

const rosterStatusVariant: Record<string, "success" | "info" | "secondary"> = {
  active: "success", completed: "info", dropped: "secondary",
};

export default function CourseSpacesPage() {
  const courseSpaces = useCourseSpaces();
  const rosters = useCourseRosters();
  const deleteCourseSpace = useDeleteCourseSpace();
  const deleteRoster = useDeleteCourseRoster();
  const [q, setQ] = useState("");
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<CourseSpace | undefined>();

  const filteredSpaces = useMemo(() => {
    const list = courseSpaces.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((a: CourseSpace) => a.code.toLowerCase().includes(s) || a.name.toLowerCase().includes(s) || a.subjectName.toLowerCase().includes(s) || a.teacherName.toLowerCase().includes(s));
  }, [courseSpaces.data, q]);

  const filteredRosters = useMemo(() => {
    const list = rosters.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((r: CourseRoster) => r.studentName.toLowerCase().includes(s));
  }, [rosters.data, q]);

  const activeEnrollments = (rosters.data ?? []).filter((r: CourseRoster) => r.status === "active").length;
  const completedCount = (rosters.data ?? []).filter((r: CourseRoster) => r.status === "completed").length;
  const completionRate = (rosters.data ?? []).length > 0 ? Math.round((completedCount / (rosters.data ?? []).length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Monitor}
        title="Course Spaces & Rosters"
        titleNe="कोर्स स्पेस"
        microModule="M10.01"
        description="Manage course spaces, enrollment and student rosters."
        actions={
          <CanCreate resource="courseSpaces">
            <Button onClick={() => { setEditingSpace(undefined); setSpaceOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> New Course Space
            </Button>
          </CanCreate>
        }
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Monitor className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Courses</p><p className="text-lg font-bold">{courseSpaces.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Monitor className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Enrollments</p><p className="text-lg font-bold">{activeEnrollments}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Monitor className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completion Rate</p><p className="text-lg font-bold">{completionRate}%</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search courses or rosters…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="courses">
        <TabsList><TabsTrigger value="courses">Course Spaces</TabsTrigger><TabsTrigger value="rosters">Rosters</TabsTrigger></TabsList>

        <TabsContent value="courses" className="mt-4">
          {courseSpaces.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Teacher</TableHead><TableHead>Enrollment</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSpaces.map((a) => (
              <TableRow key={a.id} className="group">
                <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.code}</code></TableCell>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell className="text-sm">{a.subjectName}</TableCell>
                <TableCell className="text-sm">{a.teacherName}</TableCell>
                <TableCell><span className="text-sm font-mono">{a.enrolledCount}/{a.maxEnrollment}</span></TableCell>
                <TableCell><Badge variant={courseSpaceStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="courseSpaces" onEdit={() => { setEditingSpace(a); setSpaceOpen(true); }} onDelete={() => deleteCourseSpace.mutate(a.id)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="rosters" className="mt-4">
          {rosters.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Enrolled On</TableHead><TableHead>Status</TableHead><TableHead>Progress</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRosters.map((r) => (
              <TableRow key={r.id} className="group">
                <TableCell className="pl-5 font-medium">{r.studentName}</TableCell>
                <TableCell className="text-sm">{fmtDate(r.enrolledOn)}</TableCell>
                <TableCell><Badge variant={rosterStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell>
                <TableCell><span className="text-sm font-mono">{r.progress}%</span></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="courseSpaces" onDelete={() => deleteRoster.mutate(r.id)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <CourseSpaceFormDialog open={spaceOpen} onOpenChange={setSpaceOpen} editing={editingSpace} />
    </div>
  );
}
