import {
  Blocks, Landmark, MapPin, ToggleLeft, TrendingUp,
  Users, HardDrive, ArrowUpRight, ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as ReTooltip, BarChart, Bar, Cell,
} from "recharts";
import { useTenants, useCampuses, useLocations, useConfigVersions, useFeatureFlags, useAudit } from "@/hooks/use-erp";
import { StatCard } from "@/components/stat-card";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EnvBadge } from "@/components/status-badges";
import { fmtDate, initials } from "@/lib/utils";

const usageTrend = [
  { month: "Mar", users: 128, students: 1310 },
  { month: "Apr", users: 136, students: 1372 },
  { month: "May", users: 141, students: 1401 },
  { month: "Jun", users: 149, students: 1428 },
  { month: "Jul", users: 158, students: 1445 },
  { month: "Aug", users: 167, students: 1459 },
  { month: "Sep", users: 173, students: 1468 },
];

const moduleUsage = [
  { name: "Students", value: 92 },
  { name: "Fees", value: 78 },
  { name: "Attendance", value: 71 },
  { name: "Exams", value: 64 },
  { name: "Admissions", value: 45 },
  { name: "Transport", value: 31 },
];

export default function Dashboard() {
  const tenants = useTenants();
  const campuses = useCampuses();
  const locations = useLocations();
  const versions = useConfigVersions();
  const flags = useFeatureFlags();
  const audit = useAudit();

  if (tenants.isLoading || campuses.isLoading || locations.isLoading) return <LoadingBlock />;

  const activeTenants = (tenants.data ?? []).filter((t) => t.status === "active").length;
  const openCampuses = (campuses.data ?? []).filter((c) => c.status === "open").length;
  const rooms = (locations.data ?? []).filter((l) => !["site", "building", "floor"].includes(l.type)).length;
  const pendingReview = (versions.data ?? []).filter((v) => v.status === "in_review").length;
  const enabledFeatures = (flags.data ?? []).filter((f) => f.enabled).length;
  const mainTenant = (tenants.data ?? []).find((t) => t.status === "active") ?? tenants.data?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldCheck}
        title="Institution Core Overview"
        titleNe="आधारभूत अवस्था"
        description="Module 1 control plane — tenants, institution, campuses, facilities, calendar and feature policy at a glance."
        microModule="M01"
      />

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Tenants" value={tenants.data?.length ?? 0} icon={Blocks} subtitle={`${activeTenants} active on platform`} trend={{ value: "1 new trial this month", up: true }} />
        <StatCard title="Campuses" value={campuses.data?.length ?? 0} icon={Landmark} subtitle={`${openCampuses} open & operating`} />
        <StatCard title="Locations" value={locations.data?.length ?? 0} icon={MapPin} subtitle={`${rooms} bookable spaces`} />
        <StatCard title="Config in Review" value={pendingReview} icon={ToggleLeft} subtitle={`${enabledFeatures} features enabled`} />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 animate-fade-up">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">Platform usage — {mainTenant?.name}</CardTitle>
              <CardDescription>Active staff users vs enrolled students, last 7 months</CardDescription>
            </div>
            <Badge variant="success"><TrendingUp className="h-3 w-3" /> +35% users</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageTrend} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} tick={{ fill: "#94a3b8" }} />
                  <ReTooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }} />
                  <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} fill="url(#gUsers)" />
                  <Area type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={2} fill="url(#gStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 animate-fade-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Licensed module activity</CardTitle>
            <CardDescription>Monthly transactions by module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleUsage} layout="vertical" margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={84} tickLine={false} axisLine={false} fontSize={11} tick={{ fill: "#64748b" }} />
                  <ReTooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                    {moduleUsage.map((_, i) => (
                      <Cell key={i} fill={["#4f46e5", "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 animate-fade-up">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">Recent policy & audit activity</CardTitle>
              <CardDescription>Every M01 change is audited with affected records</CardDescription>
            </div>
            <Link to="/features" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {(audit.data ?? []).slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60">
                <Avatar className="mt-0.5 h-8 w-8">
                  <AvatarFallback>{initials(a.actor)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="font-medium">{a.actor}</span>
                    <span className="text-muted-foreground"> — {a.detail}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fmtDate(a.ts)} · {a.action.toLowerCase().replace(/_/g, " ")} · {a.entity}
                  </p>
                </div>
                {a.recordsAffected > 1 && (
                  <Badge variant="secondary" className="shrink-0">{a.recordsAffected} records</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 animate-fade-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Subscription snapshot</CardTitle>
            <CardDescription>{mainTenant?.name} · {mainTenant?.code}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">User seats</span>
              </div>
              <span className="text-sm font-semibold">{mainTenant?.usage.users} / {mainTenant?.userLimit}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Storage</span>
              </div>
              <span className="text-sm font-semibold">{mainTenant?.usage.storageGb} / {mainTenant?.storageLimitGb} GB</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Students metered</span>
              <span className="text-sm font-semibold">{mainTenant?.usage.students?.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Environment</span>
              {mainTenant && <EnvBadge env={mainTenant.environment} />}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Licensed valid till</span>
              <span className="text-sm font-semibold">{fmtDate(mainTenant?.validTo)}</span>
            </div>
            <Link
              to="/tenants"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/40 bg-accent px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Manage tenants & entitlements <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

