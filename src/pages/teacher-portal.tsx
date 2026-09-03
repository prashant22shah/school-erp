import { useState } from "react";
import { BookOpen, ClipboardCheck, Clock, Users, FileText, Calendar, AlertCircle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useTeacherPortalProfiles } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";

export default function TeacherPortalPage() {
  const query = useTeacherPortalProfiles();
  const [tab, setTab] = useState("dashboard");
  const profile = query.data?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title="Teacher Portal"
        titleNe="शिक्षक पोर्टल"
        microModule="M11.03"
        description="Teacher self-service dashboard with classes, attendance, grading and leave management."
      />

      {query.isLoading ? <LoadingBlock /> : !profile ? (
        <Card><CardContent className="p-6 text-center text-muted-foreground">No teacher portal profile found.</CardContent></Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><BookOpen className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Classes Today</p><p className="text-lg font-bold">{profile.classesToday}</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-red-100 p-2 text-red-600"><FileText className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Pending Grading</p><p className="text-lg font-bold">{profile.pendingGrading}</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Clock className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Pending Leaves</p><p className="text-lg font-bold">{profile.pendingLeaves}</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Advisor Students</p><p className="text-lg font-bold">{profile.advisorStudents}</p></div>
            </CardContent></Card>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="grading">Grading</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Teacher Overview</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Name</span><span className="font-medium">{profile.teacherName}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Assigned Sections</span><div className="flex gap-1">{profile.assignedSections.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}</div></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Assigned Subjects</span><div className="flex gap-1">{profile.assignedSubjects.map((s, i) => <Badge key={i} variant="outline">{s}</Badge>)}</div></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Last Updated</span><span className="text-sm">{fmtDate(profile.updatedOn)}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Pending Grading</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{profile.pendingGrading} papers pending for grading</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="classes" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Today's Classes</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Classes scheduled</span>
                    <span className="text-lg font-bold">{profile.classesToday}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sections</span>
                    <div className="flex gap-1">{profile.assignedSections.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="attendance" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Attendance Management</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Advisor Students</span>
                    <span className="text-lg font-bold">{profile.advisorStudents}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Take attendance and manage corrections from the Attendance module.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="grading" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Grading Queue</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">{profile.pendingGrading} papers pending</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Manage marks and grades from the Assessment module.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
