import { useState } from "react";
import { Users, Bell, Mail, Smartphone, TrendingUp, DollarSign, BookOpen, MessageSquare } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useParentPortalProfiles } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";

export default function ParentPortalPage() {
  const query = useParentPortalProfiles();
  const [tab, setTab] = useState("dashboard");
  const profile = query.data?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Parent Portal"
        titleNe="अभिभावक पोर्टल"
        microModule="M11.02"
        description="Parent self-service dashboard with ward profiles, attendance, fees and communication."
      />

      {query.isLoading ? <LoadingBlock /> : !profile ? (
        <Card><CardContent className="p-6 text-center text-muted-foreground">No parent portal profile found.</CardContent></Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-rose-100 p-2 text-rose-600"><Users className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Linked Wards</p><p className="text-lg font-bold">{profile.wardNames.length}</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Bell className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Notifications</p><p className="text-lg font-bold">{Object.values(profile.notificationPrefs).filter(Boolean).length}/3</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BookOpen className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Children</p><p className="text-lg font-bold">{profile.wardNames.length}</p></div>
            </CardContent></Card>
            <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><MessageSquare className="h-4 w-4" /></div>
              <div><p className="text-xs text-muted-foreground">Relation</p><p className="text-lg font-bold">{profile.relation}</p></div>
            </CardContent></Card>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="children">Children</TabsTrigger>
              <TabsTrigger value="fees">Fees</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Parent Profile</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Name</span><span className="font-medium">{profile.parentName}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Relation</span><Badge variant="secondary">{profile.relation}</Badge></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Linked Since</span><span className="text-sm">{fmtDate(profile.linkedSince)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Last Updated</span><span className="text-sm">{fmtDate(profile.updatedOn)}</span></div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="children" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Linked Children</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {profile.wardNames.map((name, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm font-medium">{name}</span>
                      <Badge variant="outline">{profile.wardIds[i] ?? ""}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="fees" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Fee Overview</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fee Payment Status</span>
                    <span className="text-sm font-medium text-emerald-600">View invoices in Finance module</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="communication" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Smartphone className="h-4 w-4" /><span className="text-sm">SMS</span></div>
                    <Badge variant={profile.notificationPrefs.sms ? "success" : "secondary"}>{profile.notificationPrefs.sms ? "Enabled" : "Disabled"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span className="text-sm">Email</span></div>
                    <Badge variant={profile.notificationPrefs.email ? "success" : "secondary"}>{profile.notificationPrefs.email ? "Enabled" : "Disabled"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Bell className="h-4 w-4" /><span className="text-sm">Push</span></div>
                    <Badge variant={profile.notificationPrefs.push ? "success" : "secondary"}>{profile.notificationPrefs.push ? "Enabled" : "Disabled"}</Badge>
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
