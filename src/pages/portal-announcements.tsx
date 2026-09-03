import { useMemo, useState } from "react";
import { Megaphone, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PortalAnnouncementFormDialog } from "@/pages/portal-announcement-form-dialog";
import { usePortalAnnouncements, useDeletePortalAnnouncement } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { PortalAnnouncement } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  published: "success",
  archived: "warning",
};

export default function PortalAnnouncementsPage() {
  const query = usePortalAnnouncements();
  const del = useDeletePortalAnnouncement();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PortalAnnouncement | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(s) || a.targetAudience.toLowerCase().includes(s) || a.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const published = (query.data ?? []).filter((a) => a.status === "published").length;
  const draft = (query.data ?? []).filter((a) => a.status === "draft").length;
  const archived = (query.data ?? []).filter((a) => a.status === "archived").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Megaphone} title="Portal Announcements" titleNe="पोर्टल घोषणा" microModule="M11.01" description="Create and manage portal announcements for students, parents and staff." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Announcement</Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Megaphone className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Megaphone className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{published}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Megaphone className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Draft</p><p className="text-lg font-bold">{draft}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Megaphone className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Archived</p><p className="text-lg font-bold">{archived}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by title or audience…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Title</TableHead><TableHead>Audience</TableHead><TableHead>Publish On</TableHead><TableHead>Expires On</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5 font-medium">{a.title}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{a.targetAudience}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(a.publishOn)}</span></TableCell><TableCell><span className="text-sm">{a.expiresOn ? fmtDate(a.expiresOn) : "—"}</span></TableCell><TableCell><Badge variant={statusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(a); setOpen(true); }}><Pencil /> Edit announcement</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(a)}><Trash2 /> Delete announcement</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <PortalAnnouncementFormDialog open={open} onOpenChange={setOpen} announcement={editing} />
    </div>
  );
}
