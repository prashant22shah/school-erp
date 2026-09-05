import { useMemo, useState } from "react";
import { Bell, Send, Search, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { AnnouncementFormDialog } from "@/pages/announcement-form-dialog";
import { MessageFormDialog } from "@/pages/message-form-dialog";
import { useAnnouncements, useMessages, useDeliveryAttempts, useDeleteAnnouncement, useDeleteMessage, useDeleteDeliveryAttempt } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Announcement, Message, DeliveryAttempt } from "@/lib/types";

const announcementStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  draft: "default", published: "success", archived: "info",
};
const messageStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  queued: "default", sent: "info", delivered: "success", failed: "destructive",
};

export default function NoticesAnnouncementsPage() {
  const annQuery = useAnnouncements();
  const msgQuery = useMessages();
  const delQuery = useDeliveryAttempts();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | Message | undefined>();
  const [dialogType, setDialogType] = useState<"announcement" | "message">("announcement");

  const filteredAnn = useMemo(() => {
    let list = annQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.title.toLowerCase().includes(s)); }
    return list;
  }, [annQuery.data, q]);

  const filteredMsg = useMemo(() => {
    let list = msgQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => m.channel.toLowerCase().includes(s) || m.status.toLowerCase().includes(s)); }
    return list;
  }, [msgQuery.data, q]);

  const filteredDel = useMemo(() => {
    let list = delQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.provider.toLowerCase().includes(s) || d.outcome.toLowerCase().includes(s)); }
    return list;
  }, [delQuery.data, q]);

  const totalAnn = annQuery.data?.length ?? 0;
  const publishedAnn = (annQuery.data ?? []).filter((a) => a.status === "published").length;
  const totalMsg = msgQuery.data?.length ?? 0;
  const failedDelivery = (delQuery.data ?? []).filter((d) => d.outcome === "bounced").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Bell}
        title="Notices & Announcements"
        titleNe="सूचना तथा घोषणा"
        microModule="M23.01"
        description="Manage announcements, messages and delivery tracking."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="announcements"><Button onClick={() => { setEditing(undefined); setDialogType("announcement"); setOpen(true); }}><Plus className="h-4 w-4" /> New Announcement</Button></CanCreate>
            <CanCreate resource="messages"><Button variant="outline" onClick={() => { setEditing(undefined); setDialogType("message"); setOpen(true); }}><Plus className="h-4 w-4" /> New Message</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Bell className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Announcements</p><p className="text-lg font-bold">{totalAnn}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{publishedAnn}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Send className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Messages</p><p className="text-lg font-bold">{totalMsg}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Failed Deliveries</p><p className="text-lg font-bold">{failedDelivery}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search announcements, messages…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="announcements">
        <TabsList>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="deliveryAttempts">Delivery Attempts</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="mt-4">
          {annQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Title</TableHead><TableHead>Audience</TableHead><TableHead>Publish At</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAnn.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><span className="font-medium">{r.title}</span></TableCell><TableCell><span className="text-sm">{r.audienceQuery || "All"}</span></TableCell><TableCell><span className="text-sm">{fmtDate(r.publishAt)}</span></TableCell><TableCell><Badge variant={announcementStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="announcements" onEdit={() => { setEditing(r); setDialogType("announcement"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="messages" className="mt-4">
          {msgQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Channel</TableHead><TableHead>Recipient</TableHead><TableHead>Template</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredMsg.map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5"><Badge variant="secondary" className="capitalize">{m.channel}</Badge></TableCell><TableCell><span className="text-sm">{m.recipientRef}</span></TableCell><TableCell><span className="text-sm">{m.templateRef}</span></TableCell><TableCell><Badge variant={messageStatusVariant[m.status] ?? "secondary"} className="capitalize">{m.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="messages" onEdit={() => { setEditing(m); setDialogType("message"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="deliveryAttempts" className="mt-4">
          {delQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Message</TableHead><TableHead>Provider</TableHead><TableHead>Attempted At</TableHead><TableHead>Outcome</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredDel.map((d) => (<TableRow key={d.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{d.messageId}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{d.provider}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(d.attemptedAt)}</span></TableCell><TableCell><Badge variant={d.outcome === "delivered" ? "success" : d.outcome === "bounced" ? "destructive" : "default"} className="capitalize">{d.outcome}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="deliveryAttempts" onEdit={() => {}} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      {dialogType === "announcement" && <AnnouncementFormDialog open={open} onOpenChange={setOpen} editing={editing as Announcement} />}
      {dialogType === "message" && <MessageFormDialog open={open} onOpenChange={setOpen} editing={editing as Message} />}
    </div>
  );
}
