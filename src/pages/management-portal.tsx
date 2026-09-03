import { useState } from "react";
import { LayoutDashboard, Users, TrendingUp, DollarSign, Bus, UserPlus, Ticket, Calendar } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useManagementDashboards } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";

export default function ManagementPortalPage() {
  const query = useManagementDashboards();
  const [tab, setTab] = useState("overview");
  const dashboard = query.data?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LayoutDashboard}
        title="Management Portal"
        titleNe="व्यवस्थापन पोर्टल"
        microModule="M11.04"
        description="School management dashboard with KPIs, academics, finance and operations overview."
      />

      {query.isLoading ? <LoadingBlock /> : !dashboard ? (
        <Card><CardContent className="p-6 text-center text-muted-foreground">No management dashboard found.</CardContent></Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Users className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Total Students</p><p className="text-lg font-bold">{dashboard.totalStudents.toLocaleString()}</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><TrendingUp className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Attendance Rate</p><p className="text-lg font-bold">{dashboard.attendanceRate}%</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><DollarSign className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Fee Collection</p><p className="text-lg font-bold">{dashboard.feeCollectionRate}%</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Bus className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Active Vehicles</p><p className="text-lg font-bold">{dashboard.activeVehicles}</p></div>
            </CardContent></Card>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="academics">Academics</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">School Overview</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Total Students</span><span className="font-medium">{dashboard.totalStudents.toLocaleString()}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Total Staff</span><span className="font-medium">{dashboard.totalStaff.toLocaleString()}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Last Updated</span><span className="text-sm">{fmtDate(dashboard.updatedOn)}</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">KPI Widgets</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {dashboard.kpiWidgets.map((widget, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">{widget}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="academics" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Academic Metrics</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Attendance Rate</span><span className="text-lg font-bold text-emerald-600">{dashboard.attendanceRate}%</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Pending Admissions</span><span className="text-lg font-bold text-amber-600">{dashboard.pendingAdmissions}</span></div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="finance" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Finance Overview</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Fee Collection Rate</span><span className="text-lg font-bold text-emerald-600">{dashboard.feeCollectionRate}%</span></div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="operations" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Operations Overview</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Active Vehicles</span><span className="text-lg font-bold">{dashboard.activeVehicles}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Open Tickets</span><span className="text-lg font-bold text-red-600">{dashboard.openTickets}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Upcoming Events</span><span className="text-lg font-bold text-blue-600">{dashboard.upcomingEvents}</span></div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
