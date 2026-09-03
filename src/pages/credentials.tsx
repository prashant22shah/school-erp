import { useMemo, useState } from "react";
import { BadgeCheck, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { DigitalCredentialFormDialog } from "@/pages/digital-credential-form-dialog";
import { useDigitalCredentials, useDeleteDigitalCredential } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { DigitalCredential } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success", revoked: "warning", expired: "secondary",
};

export default function CredentialsPage() {
  const creds = useDigitalCredentials();
  const del = useDeleteDigitalCredential();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DigitalCredential | undefined>();

  const filtered = useMemo(() => {
    let list = creds.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.credentialCode.toLowerCase().includes(s) || (c.studentName ?? "").toLowerCase().includes(s) || (c.certificateSerial ?? "").toLowerCase().includes(s) || c.status.toLowerCase().includes(s)); }
    return list;
  }, [creds.data, q]);

  const active = (creds.data ?? []).filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={BadgeCheck} title="Digital Credentials" titleNe="डिजिटल प्रमाण" microModule="M09.06" description="Verifiable digital credentials for certificates." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Credential</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BadgeCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total credentials</p><p className="text-lg font-bold">{creds.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><BadgeCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{active}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><BadgeCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Revoked / Expired</p><p className="text-lg font-bold">{(creds.data ?? []).filter((c) => c.status !== "active").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search credentials…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {creds.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Certificate</TableHead><TableHead>Student</TableHead><TableHead>Status</TableHead><TableHead>Issued On</TableHead><TableHead>Verified On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.credentialCode}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.certificateSerial ?? c.certificateId.slice(0, 8)}</code></TableCell><TableCell><span className="text-sm">{c.studentName ?? "—"}</span></TableCell><TableCell><Badge variant={statusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell><span className="text-sm font-mono">{c.issuedOn.slice(0, 10)}</span></TableCell><TableCell><span className="text-sm font-mono">{c.verifiedOn ? c.verifiedOn.slice(0, 10) : "—"}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(c); setOpen(true); }}><Pencil /> Edit credential</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(c)}><Trash2 /> Delete credential</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <DigitalCredentialFormDialog open={open} onOpenChange={setOpen} credential={editing} />
    </div>
  );
}
