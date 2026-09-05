import { useMemo, useState } from "react";
import { Building2, Search, Plus, FileText } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { VendorFormDialog } from "@/pages/vendor-form-dialog";
import { VendorDocumentFormDialog } from "@/pages/vendor-document-form-dialog";
import { useVendors, useVendorDocuments, useDeleteVendor, useDeleteVendorDocument } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { Vendor, VendorDocument } from "@/lib/types";

const vendorStatusVariant: Record<string, "success" | "secondary" | "destructive"> = {
  active: "success", inactive: "secondary", blacklisted: "destructive",
};

const docStatusVariant: Record<string, "success" | "destructive" | "warning"> = {
  valid: "success", expired: "destructive", pending_renewal: "warning",
};

const docTypeVariant: Record<string, "info" | "warning" | "success" | "secondary" | "purple"> = {
  registration: "info", pan: "warning", tax_clearance: "success", insurance: "secondary", bank_guarantee: "purple",
};

export default function VendorMasterPage() {
  const vendors = useVendors();
  const vendorDocuments = useVendorDocuments();
  const deleteVendor = useDeleteVendor();
  const deleteVendorDocument = useDeleteVendorDocument();
  const [q, setQ] = useState("");
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>();
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<VendorDocument | undefined>();

  const filteredVendors = useMemo(() => {
    let list = vendors.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((v) => v.name.toLowerCase().includes(s) || v.code.toLowerCase().includes(s) || v.category.toLowerCase().includes(s) || v.status.toLowerCase().includes(s)); }
    return list;
  }, [vendors.data, q]);

  const filteredDocs = useMemo(() => {
    let list = vendorDocuments.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.vendorRef.toLowerCase().includes(s) || d.type.toLowerCase().includes(s) || d.documentNo.toLowerCase().includes(s)); }
    return list;
  }, [vendorDocuments.data, q]);

  const totalVendors = vendors.data?.length ?? 0;
  const activeVendors = (vendors.data ?? []).filter((v) => v.status === "active").length;
  const blacklisted = (vendors.data ?? []).filter((v) => v.status === "blacklisted").length;
  const totalDocs = vendorDocuments.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        title="Vendor Master"
        titleNe="विक्रेता"
        microModule="M14.01"
        description="Vendor registry, contact details, bank information and compliance documents."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="vendors">
              <Button variant="outline" onClick={() => { setEditingVendor(undefined); setVendorDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New vendor
              </Button>
            </CanCreate>
            <CanCreate resource="vendors">
              <Button onClick={() => { setEditingDoc(undefined); setDocDialogOpen(true); }}>
                <FileText className="h-4 w-4" /> New document
              </Button>
            </CanCreate>
          </div>
        }
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Building2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Vendors</p><p className="text-lg font-bold">{totalVendors}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Building2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{activeVendors}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-red-100 p-2 text-red-600"><Building2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Blacklisted</p><p className="text-lg font-bold">{blacklisted}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Documents</p><p className="text-lg font-bold">{totalDocs}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search vendors, documents…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="vendors">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="vendors" className="mt-4">
          {vendors.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">Vendor</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>PAN No</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredVendors.map((v) => (
                  <TableRow key={v.id} className="group">
                    <TableCell className="pl-5"><p className="font-medium">{v.name}</p></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{v.code}</code></TableCell>
                    <TableCell><Badge variant="secondary" className="capitalize">{v.category}</Badge></TableCell>
                    <TableCell><span className="text-sm">{v.contactPerson}</span></TableCell>
                    <TableCell><span className="text-sm">{v.email}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{v.phone}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{v.panNo}</span></TableCell>
                    <TableCell><span className="text-sm">{v.rating}</span></TableCell>
                    <TableCell><Badge variant={vendorStatusVariant[v.status] ?? "secondary"} className="capitalize">{v.status.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu onEdit={() => { setEditingVendor(v); setVendorDialogOpen(true); }} onDelete={() => deleteVendor.mutate(v)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="documents" className="mt-4">
          {vendorDocuments.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">Vendor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Document No</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredDocs.map((d) => (
                  <TableRow key={d.id} className="group">
                    <TableCell className="pl-5"><p className="font-medium">{d.vendorRef}</p></TableCell>
                    <TableCell><Badge variant={docTypeVariant[d.type] ?? "secondary"} className="capitalize">{d.type.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{d.documentNo}</code></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(d.issuedDate)}</span></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(d.expiryDate)}</span></TableCell>
                    <TableCell><Badge variant={docStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu onEdit={() => { setEditingDoc(d); setDocDialogOpen(true); }} onDelete={() => deleteVendorDocument.mutate(d)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <VendorFormDialog open={vendorDialogOpen} onOpenChange={setVendorDialogOpen} vendor={editingVendor} />
      <VendorDocumentFormDialog open={docDialogOpen} onOpenChange={setDocDialogOpen} document={editingDoc} />
    </div>
  );
}
