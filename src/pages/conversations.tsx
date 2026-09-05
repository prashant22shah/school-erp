import { useMemo, useState } from "react";
import { MessageCircle, Users, Search, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ConversationFormDialog } from "@/pages/conversation-form-dialog";
import { useConversations, useConversationParticipants, useConversationMessages, useDeleteConversation, useDeleteConversationParticipant, useDeleteConversationMessage } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Conversation, ConversationParticipant, ConversationMessage } from "@/lib/types";

const convStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  active: "success", archived: "info", closed: "default",
};

export default function ConversationsPage() {
  const convQuery = useConversations();
  const partQuery = useConversationParticipants();
  const msgQuery = useConversationMessages();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Conversation | undefined>();

  const filteredConv = useMemo(() => {
    let list = convQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.subject.toLowerCase().includes(s) || c.type.toLowerCase().includes(s)); }
    return list;
  }, [convQuery.data, q]);

  const filteredPart = useMemo(() => {
    let list = partQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.subjectRef.toLowerCase().includes(s) || p.role.toLowerCase().includes(s)); }
    return list;
  }, [partQuery.data, q]);

  const filteredMsg = useMemo(() => {
    let list = msgQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => m.content.toLowerCase().includes(s) || m.senderRef.toLowerCase().includes(s)); }
    return list;
  }, [msgQuery.data, q]);

  const totalConv = convQuery.data?.length ?? 0;
  const activeConv = (convQuery.data ?? []).filter((c) => c.status === "active").length;
  const totalPart = partQuery.data?.length ?? 0;
  const totalMsg = msgQuery.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={MessageCircle}
        title="Conversations & Inbox"
        titleNe="संवाद तथा इनबक्स"
        microModule="M23.03"
        description="Manage conversations, participants and messages."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="conversations"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Conversation</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><MessageCircle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Conversations</p><p className="text-lg font-bold">{totalConv}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{activeConv}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Participants</p><p className="text-lg font-bold">{totalPart}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Messages</p><p className="text-lg font-bold">{totalMsg}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search conversations…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="conversations">
        <TabsList>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="mt-4">
          {convQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Subject</TableHead><TableHead>Type</TableHead><TableHead>Context</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredConv.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><span className="font-medium">{c.subject}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{c.type.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm">{c.contextRef}</span></TableCell><TableCell><Badge variant={convStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="conversations" onEdit={() => { setEditing(c); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="participants" className="mt-4">
          {partQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Conversation</TableHead><TableHead>Subject</TableHead><TableHead>Role</TableHead><TableHead>Joined At</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPart.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.conversationId}</code></TableCell><TableCell><span className="text-sm">{p.subjectRef}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{p.role}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(p.joinedAt)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="conversationParticipants" onEdit={() => {}} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="messages" className="mt-4">
          {msgQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Conversation</TableHead><TableHead>Sender</TableHead><TableHead>Content</TableHead><TableHead>Sent At</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredMsg.map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{m.conversationId}</code></TableCell><TableCell><span className="text-sm">{m.senderRef}</span></TableCell><TableCell><span className="text-sm truncate max-w-[200px] block">{m.content}</span></TableCell><TableCell><span className="text-sm">{fmtDate(m.sentAt)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="conversationMessages" onEdit={() => {}} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ConversationFormDialog open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
