import { useMemo, useState } from "react";
import { Key, UserCheck, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { VisitorVisitFormDialog } from "@/pages/visitor-visit-form-dialog";
import { useVisitorVisits, useAccessCredentials, useKeyIssues, useDeleteVisitorVisit, useDeleteAccessCredential, useDeleteKeyIssue } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { VisitorVisit, AccessCredential, KeyIssue } from "@/lib/types";

const visitStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  pre_registered: "info", checked_in: "success", checked_out: "default", denied: "destructive",
};
const credentialStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  active: "success", suspended: "warning", revoked: "destructive", expired: "info",
};
const keyStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  issued: "info", returned: "success", lost: "destructive", replaced: "warning",
};

export default function VisitorKeyControlPage() {
  const visitQuery = useVisitorVisits();
  const credQuery = useAccessCredentials();
  const keyQuery = useKeyIssues();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VisitorVisit | AccessCredential | KeyIssue | undefined>();

  const filteredVisits = useMemo(() => {
    let list = visitQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((v) => v.visitorName.toLowerCase().includes(s) || v.hostName.toLowerCase().includes(s)); }
    return list;
  }, [visitQuery.data, q]);

  const filteredCreds = useMemo(() => {
    let list = credQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.holderName.toLowerCase().includes(s) || c.accessZones.toLowerCase().includes(s)); }
    return list;
  }, [credQuery.data, q]);

  const filteredKeys = useMemo(() => {
    let list = keyQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((k) => k.keyNo.toLowerCase().includes(s) || k.issuedToName.toLowerCase().includes(s)); }
    return list;
  }, [keyQuery.data, q]);

  const totalVisits = visitQuery.data?.length ?? 0;
  const checkedIn = (visitQuery.data ?? []).filter((v) => v.status === "checked_in").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Key}
        title="Access, Visitor & Key Control"
        titleNe="पहुँच, आगन्तुक तथा कुञ्जी नियन्त्रण"
        microModule="M22.05"
        description="Manage visitor registration, access credentials and key issuance."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="visitorVisits"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Visitor</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><UserCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Visits</p><p className="text-lg font-bold">{totalVisits}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Key className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Checked In</p><p className="text-lg font-bold">{checkedIn}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Key className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Credentials</p><p className="text-lg font-bold">{(credQuery.data ?? []).filter((c) => c.status === "active").length}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><UserCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Keys Issued</p><p className="text-lg font-bold">{(keyQuery.data ?? []).filter((k) => k.status === "issued").length}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search visitors, credentials, keys…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="visitors">
        <TabsList>
          <TabsTrigger value="visitors">Visitor Visits</TabsTrigger>
          <TabsTrigger value="credentials">Access Credentials</TabsTrigger>
          <TabsTrigger value="keys">Key Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="visitors" className="mt-4">
          {visitQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Visitor</TableHead><TableHead>Host</TableHead><TableHead>Purpose</TableHead><TableHead>Check In</TableHead><TableHead>Check Out</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredVisits.map((v) => (<TableRow key={v.id} className="group"><TableCell className="pl-5"><span className="font-medium">{v.visitorName}</span></TableCell><TableCell><span className="text-sm">{v.hostName || v.hostRef}</span></TableCell><TableCell><span className="text-sm">{v.purpose}</span></TableCell><TableCell><span className="text-sm">{fmtDate(v.checkInTime)}</span></TableCell><TableCell><span className="text-sm">{v.checkOutTime ? fmtDate(v.checkOutTime) : "—"}</span></TableCell><TableCell><Badge variant={visitStatusVariant[v.status] ?? "secondary"} className="capitalize">{v.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="visitorVisits" onEdit={() => { setEditing(v); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="credentials" className="mt-4">
          {credQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Subject</TableHead><TableHead>Zone</TableHead><TableHead>Valid From</TableHead><TableHead>Valid To</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredCreds.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><span className="font-medium">{c.holderName}</span></TableCell><TableCell><span className="text-sm">{c.accessZones}</span></TableCell><TableCell><span className="text-sm">{fmtDate(c.validFrom)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(c.validUntil)}</span></TableCell><TableCell><Badge variant={credentialStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="accessCredentials" onEdit={() => { setEditing(c); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="keys" className="mt-4">
          {keyQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Key</TableHead><TableHead>Subject</TableHead><TableHead>Issued</TableHead><TableHead>Returned</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredKeys.map((k) => (<TableRow key={k.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{k.keyNo}</code></TableCell><TableCell><span className="text-sm">{k.issuedToName || k.issuedTo}</span></TableCell><TableCell><span className="text-sm">{fmtDate(k.issuedDate)}</span></TableCell><TableCell><span className="text-sm">{k.returnedDate ? fmtDate(k.returnedDate) : "—"}</span></TableCell><TableCell><Badge variant={keyStatusVariant[k.status] ?? "secondary"} className="capitalize">{k.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="keyIssues" onEdit={() => { setEditing(k); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <VisitorVisitFormDialog open={open} onOpenChange={setOpen} editing={editing as VisitorVisit} />
    </div>
  );
}
