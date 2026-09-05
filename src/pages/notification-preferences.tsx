import { useMemo, useState } from "react";
import { Settings, Bell, Search, Plus, CheckCircle2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useNotificationPreferences, useDeleteNotificationPreference } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { NotificationPreference } from "@/lib/types";

const prefStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  enabled: "success", disabled: "info",
};

export default function NotificationPreferencesPage() {
  const prefQuery = useNotificationPreferences();
  const [q, setQ] = useState("");

  const filteredPref = useMemo(() => {
    let list = prefQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.subjectRef.toLowerCase().includes(s) || p.purpose.toLowerCase().includes(s) || p.channel.toLowerCase().includes(s)); }
    return list;
  }, [prefQuery.data, q]);

  const totalPref = prefQuery.data?.length ?? 0;
  const enabledPref = (prefQuery.data ?? []).filter((p) => p.status === "enabled").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Settings}
        title="Notification Preferences"
        titleNe="सूचना प्राथमिकता"
        microModule="M23.02"
        description="Manage notification preferences for subjects and channels."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="notificationPreferences"><Button onClick={() => {}}><Plus className="h-4 w-4" /> New Preference</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Settings className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Preferences</p><p className="text-lg font-bold">{totalPref}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Enabled</p><p className="text-lg font-bold">{enabledPref}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Bell className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Disabled</p><p className="text-lg font-bold">{totalPref - enabledPref}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search preferences…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="preferences">
        <TabsList>
          <TabsTrigger value="preferences">Notification Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="mt-4">
          {prefQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Subject</TableHead><TableHead>Purpose</TableHead><TableHead>Channel</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPref.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><span className="text-sm">{p.subjectRef}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{p.purpose}</Badge></TableCell><TableCell><Badge variant="info" className="capitalize">{p.channel}</Badge></TableCell><TableCell><Badge variant={prefStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="notificationPreferences" onEdit={() => {}} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
