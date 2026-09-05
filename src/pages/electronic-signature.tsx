import { useMemo, useState } from "react";
import { PenTool, Stamp, Search, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SignatureRequestFormDialog } from "@/pages/signature-request-form-dialog";
import { useSignatureRequests, useDeleteSignatureRequest } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { SignatureRequest } from "@/lib/types";

const sigStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  pending: "default", signed: "success", rejected: "destructive", expired: "info",
};

export default function ElectronicSignaturePage() {
  const sigQuery = useSignatureRequests();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SignatureRequest | undefined>();

  const filteredSig = useMemo(() => {
    let list = sigQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.documentId.toLowerCase().includes(s) || r.signerRef.toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [sigQuery.data, q]);

  const totalSig = sigQuery.data?.length ?? 0;
  const pendingSig = (sigQuery.data ?? []).filter((r) => r.status === "pending").length;
  const signedSig = (sigQuery.data ?? []).filter((r) => r.status === "signed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PenTool}
        title="Electronic Signature & Seal"
        titleNe="इलेक्ट्रोनिक हस्ताक्षर तथा मुहर"
        microModule="M23.07"
        description="Manage signature requests and document sealing."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="signatureRequests"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Request</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><PenTool className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Requests</p><p className="text-lg font-bold">{totalSig}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{pendingSig}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Signed</p><p className="text-lg font-bold">{signedSig}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search signature requests…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Signature Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-4">
          {sigQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Document</TableHead><TableHead>Signer</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSig.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.documentId}</code></TableCell><TableCell><span className="text-sm">{r.signerRef}</span></TableCell><TableCell><Badge variant={sigStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="signatureRequests" onEdit={() => { setEditing(r); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <SignatureRequestFormDialog open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
