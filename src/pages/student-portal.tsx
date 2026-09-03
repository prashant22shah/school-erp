import { useState } from "react";
import { GraduationCap, Calendar, BookOpen, DollarSign, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useStudentPortalProfiles } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";

export default function StudentPortalPage() {
  const query = useStudentPortalProfiles();
  const [tab, setTab] = useState("dashboard");
  const profile = query.data?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={GraduationCap}
        title="Student Portal"
        titleNe="विद्यार्थी पोर्टल"
        microModule="M11.01"
        description="Student self-service dashboard with attendance, results, schedule and fee information."
      />

      {query.isLoading ? <LoadingBlock /> : !profile ? (
        <Card><CardContent className="p-6 text-center text-muted-foreground">No student portal profile found.</CardContent></Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BookOpen className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Enrolled Subjects</p><p className="text-lg font-bold">{profile.enrolledSubjects.length}</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><TrendingUp className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Attendance</p><p className="text-lg font-bold">{profile.attendanceSummary.present}/{profile.attendanceSummary.present + profile.attendanceSummary.absent + profile.attendanceSummary.late}</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><DollarSign className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Fee Balance</p><p className="text-lg font-bold">Rs {profile.feeBalance.toLocaleString()}</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Calendar className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Upcoming Exams</p><p className="text-lg font-bold">{profile.upcomingExams.length}</p></div>
            </CardContent></Card>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="fees">Fees</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Student Overview</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Name</span><span className="font-medium">{profile.studentName}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Grade / Section</span><Badge variant="secondary">{profile.grade} - {profile.section}</Badge></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Enrolled Subjects</span><span className="font-medium">{profile.enrolledSubjects.length}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Last Updated</span><span className="text-sm">{fmtDate(profile.updatedOn)}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Upcoming Exams</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {profile.upcomingExams.map((exam, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">{exam}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Enrolled Subjects</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {profile.enrolledSubjects.map((subj, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm font-medium">{subj}</span>
                      <Badge variant="outline">{profile.grade}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Last Results</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {profile.lastResults.map((result, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm">{result}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="fees" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Fee Summary</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Outstanding Balance</span>
                    <span className="text-lg font-bold text-amber-600">Rs {profile.feeBalance.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
