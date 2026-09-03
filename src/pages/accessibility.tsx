import { useMemo, useState } from "react";
import { Accessibility, Ticket, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { AccessibilityProfileFormDialog } from "@/pages/accessibility-profile-form-dialog";
import { PortalTicketFormDialog } from "@/pages/portal-ticket-form-dialog";
import { useAccessibilityProfiles, usePortalTickets, useDeleteAccessibilityProfile, useDeletePortalTicket } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { AccessibilityProfile, PortalTicket } from "@/lib/types";

const themeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  light: "secondary",
  dark: "default",
  high_contrast: "warning",
};
const ticketStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  open: "warning",
  in_progress: "info",
  resolved: "success",
  closed: "secondary",
};
const priorityVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  low: "secondary",
  medium: "info",
  high: "warning",
  urgent: "destructive",
};

export default function AccessibilityPage() {
  const profiles = useAccessibilityProfiles();
  const tickets = usePortalTickets();
  const deleteProfile = useDeleteAccessibilityProfile();
  const deleteTicket = useDeletePortalTicket();
  const [q, setQ] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<AccessibilityProfile | undefined>();
  const [ticketOpen, setTicketOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<PortalTicket | undefined>();

  const filteredProfiles = useMemo(() => {
    let list = profiles.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.userName.toLowerCase().includes(s) || p.theme.toLowerCase().includes(s) || p.language.toLowerCase().includes(s) || p.userRef.toLowerCase().includes(s));
    }
    return list;
  }, [profiles.data, q]);

  const filteredTickets = useMemo(() => {
    let list = tickets.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((t) => t.requesterName.toLowerCase().includes(s) || t.subject.toLowerCase().includes(s) || t.category.toLowerCase().includes(s) || t.status.toLowerCase().includes(s) || t.priority.toLowerCase().includes(s));
    }
    return list;
  }, [tickets.data, q]);

  const openTickets = (tickets.data ?? []).filter((t) => t.status === "open").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Accessibility} title="Accessibility & Support" titleNe="पहुँच र सहयोग" microModule="M11.07" description="Manage accessibility profiles and portal support tickets." actions={<div className="flex gap-2"><Button variant="outline" onClick={() => { setEditingProfile(undefined); setProfileOpen(true); }}><Plus className="h-4 w-4" /> New Profile</Button><Button onClick={() => { setEditingTicket(undefined); setTicketOpen(true); }}><Plus className="h-4 w-4" /> New Ticket</Button></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Accessibility className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Accessibility Profiles</p><p className="text-lg font-bold">{profiles.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Ticket className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Portal Tickets</p><p className="text-lg font-bold">{tickets.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Ticket className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open Tickets</p><p className="text-lg font-bold">{openTickets}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search profiles or tickets…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="profiles">
        <TabsList><TabsTrigger value="profiles">Accessibility Profiles</TabsTrigger><TabsTrigger value="tickets">Portal Tickets</TabsTrigger></TabsList>

        <TabsContent value="profiles" className="mt-4">
          {profiles.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">User</TableHead><TableHead>Theme</TableHead><TableHead>Font Scale</TableHead><TableHead>Language</TableHead><TableHead>Updated</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredProfiles.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><div className="flex flex-col"><span className="font-medium">{p.userName}</span><code className="text-xs text-muted-foreground">{p.userRef}</code></div></TableCell><TableCell><Badge variant={themeVariant[p.theme] ?? "secondary"} className="capitalize">{p.theme.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm font-mono">{p.fontScale}×</span></TableCell><TableCell><Badge variant="secondary">{p.language}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(p.updatedOn)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingProfile(p); setProfileOpen(true); }}><Pencil /> Edit profile</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteProfile.mutate(p)}><Trash2 /> Delete profile</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="tickets" className="mt-4">
          {tickets.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Requester</TableHead><TableHead>Subject</TableHead><TableHead>Category</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredTickets.map((t) => (<TableRow key={t.id} className="group"><TableCell className="pl-5"><div className="flex flex-col"><span className="font-medium">{t.requesterName}</span><code className="text-xs text-muted-foreground">{t.requesterRef}</code></div></TableCell><TableCell><span className="text-sm">{t.subject}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{t.category}</Badge></TableCell><TableCell><Badge variant={priorityVariant[t.priority] ?? "secondary"} className="capitalize">{t.priority}</Badge></TableCell><TableCell><Badge variant={ticketStatusVariant[t.status] ?? "secondary"} className="capitalize">{t.status.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(t.createdOn)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingTicket(t); setTicketOpen(true); }}><Pencil /> Edit ticket</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteTicket.mutate(t)}><Trash2 /> Delete ticket</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <AccessibilityProfileFormDialog open={profileOpen} onOpenChange={setProfileOpen} profile={editingProfile} />
      <PortalTicketFormDialog open={ticketOpen} onOpenChange={setTicketOpen} ticket={editingTicket} />
    </div>
  );
}
