import {
  ToggleLeft, History, FileCheck2, Globe2, Building2, ShieldCheck, Check, X,
} from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import {
  useFeatureFlags, useConfigVersions, useAudit, useSaveFeatureFlag, useSaveConfigVersion,
} from "@/hooks/use-erp";
import { useCampuses } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ConfigStatusBadge } from "@/components/status-badges";
import { fmtDate, initials } from "@/lib/utils";
import type { FeatureFlag, FeatureCategory } from "@/lib/types";

const CATEGORY_BADGE: Record<FeatureCategory, { label: string; cls: string }> = {
  academics: { label: "Academics", cls: "border-sky-200 bg-sky-50 text-sky-700" },
  finance: { label: "Finance", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  transport: { label: "Transport", cls: "border-amber-200 bg-amber-50 text-amber-700" },
  library: { label: "Library", cls: "border-violet-200 bg-violet-50 text-violet-700" },
  communication: { label: "Communication", cls: "border-rose-200 bg-rose-50 text-rose-700" },
  hr: { label: "HR", cls: "border-cyan-200 bg-cyan-50 text-cyan-700" },
};

function ScopeBadge({ flag, campusName }: { flag: FeatureFlag; campusName?: string }) {
  if (flag.scope === "campus")
    return (
      <Badge variant="secondary" className="text-[10px]">
        <Building2 className="h-3 w-3" /> {campusName ?? "Campus"}
      </Badge>
    );
  if (flag.scope === "role")
    return (
      <Badge variant="secondary" className="text-[10px]">
        <ShieldCheck className="h-3 w-3" /> {flag.role ?? "Role"}
      </Badge>
    );
  return (
    <Badge variant="secondary" className="text-[10px]">
      <Globe2 className="h-3 w-3" /> Tenant-wide
    </Badge>
  );
}

export default function Features() {
  const flags = useFeatureFlags();
  const versions = useConfigVersions();
  const audit = useAudit();
  const campuses = useCampuses();
  const saveFlag = useSaveFeatureFlag();
  const saveVersion = useSaveConfigVersion();

  const campusName = (id: string | null | undefined) => campuses.data?.find((c) => c.id === id)?.name;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ToggleLeft}
        title="Feature & Policy Configuration"
        titleNe="सुविधा तथा नीति"
        microModule="M01.06"
        description="Feature enablement by tenant, campus, role and effective date; versioned configuration with maker-checker approval."
      />

      {flags.isLoading || versions.isLoading || campuses.isLoading ? (
        <LoadingBlock />
      ) : (
        <Tabs defaultValue="features">
          <TabsList>
            <TabsTrigger value="features"><ToggleLeft className="h-4 w-4" /> Feature flags</TabsTrigger>
            <TabsTrigger value="versions"><FileCheck2 className="h-4 w-4" /> Config versions</TabsTrigger>
            <TabsTrigger value="audit"><History className="h-4 w-4" /> Audit log</TabsTrigger>
          </TabsList>

          {/* Feature flags */}
          <TabsContent value="features" className="space-y-3">
            {(flags.data ?? []).map((f) => {
              const cat = CATEGORY_BADGE[f.category];
              return (
                <Card key={f.id} className="animate-fade-up">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{f.name}</p>
                        <Badge variant="outline" className={cat.cls}>{cat.label}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{f.featureCode}</span>
                        <ScopeBadge flag={f} campusName={campusName(f.campusId)} />
                        <span className="text-[11px] text-muted-foreground">Effective {fmtDate(f.effectiveFrom)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <Switch
                        checked={f.enabled}
                        onCheckedChange={(v) => saveFlag.mutate({ ...f, enabled: v })}
                      />
                      <span className={`text-[11px] font-medium ${f.enabled ? "text-emerald-600" : "text-muted-foreground"}`}>
                        {f.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
{/* Config versions — maker-checker */}
          <TabsContent value="versions" className="space-y-3">
            {(versions.data ?? []).map((v) => (
              <Card key={v.id} className="animate-fade-up">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">Configuration {v.version}</p>
                      <ConfigStatusBadge status={v.status} />
                      <Badge variant="secondary" className="text-[10px]">{v.targetEnv}</Badge>
                      <Badge variant="outline" className="text-[10px]">{v.changes} changes</Badge>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{v.notes}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                      <span>Created by <span className="font-medium text-foreground">{v.createdBy}</span></span>
                      <span>on <span className="font-medium text-foreground">{fmtDate(v.createdOn)}</span></span>
                      {v.approvedBy && <span>Approved by <span className="font-medium text-foreground">{v.approvedBy}</span></span>}
                    </div>
                  </div>
                  {v.status === "in_review" && (
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm" variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => saveVersion.mutate({ ...v, status: "rejected" })}
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </Button>
                      <Button
                        size="sm" variant="success" onClick={() => saveVersion.mutate({ ...v, status: "published", approvedBy: "Anish Karki (you)" })}
                      >
                        <Check className="h-3.5 w-3.5" /> Approve & publish
                      </Button>
                    </div>
                  )}
                  {v.status === "approved" && (
                    <Button size="sm" onClick={() => saveVersion.mutate({ ...v, status: "published" })}>
                      <Check className="h-3.5 w-3.5" /> Publish
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Audit log */}
          <TabsContent value="audit">
            <Card className="animate-fade-up">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">Policy & config change audit</CardTitle>
                <CardDescription>
                  Every feature-policy change is versioned, audit-logged and linked to the records it recalculated (M01.06.F5).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {(audit.data ?? []).map((a) => (
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
                        {new Date(a.ts).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} · {a.action.toLowerCase().replace(/_/g, " ")} · {a.entity}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {a.recordsAffected} records
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}