import { useMemo, useState } from "react";
import { GraduationCap, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CertificateFormDialog } from "@/pages/certificate-form-dialog";
import { CertificateRequestFormDialog } from "@/pages/certificate-request-form-dialog";
import { useCertificates, useCertificateRequests, useDeleteCertificate, useDeleteCertificateRequest } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Certificate, CertificateRequest } from "@/lib/types";

const certStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", issued: "success", revoked: "warning", expired: "warning",
};
const reqStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning", approved: "info", issued: "success", rejected: "secondary",
};

export default function CertificatesPage() {
  const certs = useCertificates();
  const requests = useCertificateRequests();
  const deleteCert = useDeleteCertificate();
  const deleteReq = useDeleteCertificateRequest();
  const [q, setQ] = useState("");
  const [certOpen, setCertOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | undefined>();
  const [reqOpen, setReqOpen] = useState(false);
  const [editingReq, setEditingReq] = useState<CertificateRequest | undefined>();

  const filteredCerts = useMemo(() => {
    let list = certs.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.studentName.toLowerCase().includes(s) || c.serial.toLowerCase().includes(s) || c.type.toLowerCase().includes(s) || c.status.toLowerCase().includes(s)); }
    return list;
  }, [certs.data, q]);

  const filteredRequests = useMemo(() => {
    let list = requests.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.studentName.toLowerCase().includes(s) || r.certificateType.toLowerCase().includes(s) || r.purpose.toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [requests.data, q]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={GraduationCap}
        title="Certificates & Requests"
        titleNe="प्रमाणपत्र"
        microModule="M09.05"
        description="Issue certificates and manage guardian/student requests."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingCert(undefined); setCertOpen(true); }}><Plus className="h-4 w-4" /> New Certificate</Button>
            <Button onClick={() => { setEditingReq(undefined); setReqOpen(true); }}><Plus className="h-4 w-4" /> New Request</Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><GraduationCap className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Certificates</p><p className="text-lg font-bold">{certs.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><GraduationCap className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Issued</p><p className="text-lg font-bold">{(certs.data ?? []).filter((c) => c.status === "issued").length}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><GraduationCap className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Requests</p><p className="text-lg font-bold">{requests.data?.length ?? 0}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search certificates or requests…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>

      <Tabs defaultValue="certificates">
        <TabsList><TabsTrigger value="certificates">Certificates</TabsTrigger><TabsTrigger value="requests">Requests</TabsTrigger></TabsList>

        <TabsContent value="certificates" className="mt-4">
          {certs.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Type</TableHead><TableHead>Serial</TableHead><TableHead>Status</TableHead><TableHead>Issued On</TableHead><TableHead>Valid Until</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredCerts.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5 font-medium">{c.studentName}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{c.type}</Badge></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.serial}</code></TableCell><TableCell><Badge variant={certStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell><span className="text-sm font-mono">{c.issuedOn.slice(0, 10)}</span></TableCell><TableCell><span className="text-sm font-mono">{c.validUntil ? c.validUntil.slice(0, 10) : "—"}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingCert(c); setCertOpen(true); }}><Pencil /> Edit certificate</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteCert.mutate(c)}><Trash2 /> Delete certificate</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          {requests.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Type</TableHead><TableHead>Purpose</TableHead><TableHead>Status</TableHead><TableHead>Requested On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRequests.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.studentName}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{r.certificateType}</Badge></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{r.purpose}</span></TableCell><TableCell><Badge variant={reqStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell><span className="text-sm font-mono">{r.requestedOn.slice(0, 10)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingReq(r); setReqOpen(true); }}><Pencil /> Edit request</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteReq.mutate(r)}><Trash2 /> Delete request</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <CertificateFormDialog open={certOpen} onOpenChange={setCertOpen} certificate={editingCert} />
      <CertificateRequestFormDialog open={reqOpen} onOpenChange={setReqOpen} request={editingReq} />
    </div>
  );
}
