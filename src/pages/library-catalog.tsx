import { useMemo, useState } from "react";
import { BookOpen, Layers, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { LibraryResourceFormDialog } from "@/pages/library-resource-form-dialog";
import { DigitalResourceFormDialog } from "@/pages/digital-resource-form-dialog";
import { useLibraryResources, useDigitalResources, useDeleteLibraryResource, useDeleteDigitalResource } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { LibraryResource, DigitalResource } from "@/lib/types";

const resourceStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  available: "success",
  restricted: "warning",
  archived: "secondary",
  lost: "destructive",
};

const resourceTypeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  book: "info",
  journal: "warning",
  reference: "secondary",
  digital: "success",
  av: "purple",
  thesis: "default",
};

const digitalStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  active: "success",
  expired: "warning",
  revoked: "destructive",
};

const accessTypeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  open: "success",
  subscription: "info",
  per_user: "warning",
};

export default function LibraryCatalogPage() {
  const libraryResources = useLibraryResources();
  const digitalResources = useDigitalResources();
  const deleteResource = useDeleteLibraryResource();
  const deleteDigital = useDeleteDigitalResource();
  const [q, setQ] = useState("");
  const [resourceOpen, setResourceOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<LibraryResource | undefined>();
  const [digitalOpen, setDigitalOpen] = useState(false);
  const [editingDigital, setEditingDigital] = useState<DigitalResource | undefined>();

  const filteredResources = useMemo(() => {
    let list = libraryResources.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(s) || r.author.toLowerCase().includes(s) || r.accessionNo.toLowerCase().includes(s) || r.category.toLowerCase().includes(s) || r.type.toLowerCase().includes(s) || r.status.toLowerCase().includes(s));
    }
    return list;
  }, [libraryResources.data, q]);

  const filteredDigital = useMemo(() => {
    let list = digitalResources.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((d) => d.title.toLowerCase().includes(s) || d.provider.toLowerCase().includes(s) || d.accessType.toLowerCase().includes(s) || d.status.toLowerCase().includes(s));
    }
    return list;
  }, [digitalResources.data, q]);

  const availableCount = (libraryResources.data ?? []).filter((r) => r.status === "available").length;
  const activeDigital = (digitalResources.data ?? []).filter((d) => d.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title="Library Catalog"
        titleNe="पुस्तकालय सूची"
        microModule="M16.01/M16.05"
        description="Catalog, metadata and digital resource access — library foundation."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingResource(undefined); setResourceOpen(true); }}><CanCreate resource="libraryResources">New Resource</CanCreate></Button>
            <Button onClick={() => { setEditingDigital(undefined); setDigitalOpen(true); }}> New Digital</Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Catalog Items</p><p className="text-lg font-bold">{libraryResources.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Available</p><p className="text-lg font-bold">{availableCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Layers className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Digital Resources</p><p className="text-lg font-bold">{digitalResources.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Layers className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Access</p><p className="text-lg font-bold">{activeDigital}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search catalog or digital resources…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="catalog">
        <TabsList><TabsTrigger value="catalog">Catalog</TabsTrigger><TabsTrigger value="digital">Digital Resources</TabsTrigger></TabsList>

        <TabsContent value="catalog" className="mt-4">
          {libraryResources.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Accession No</TableHead><TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Category</TableHead><TableHead>Type</TableHead><TableHead>Shelf</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredResources.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.accessionNo}</code></TableCell><TableCell><div className="flex flex-col"><span className="font-medium">{r.title}</span>{r.subtitle && <span className="text-xs text-muted-foreground">{r.subtitle}</span>}</div></TableCell><TableCell><span className="text-sm">{r.author}</span></TableCell><TableCell><Badge variant="secondary">{r.category}</Badge></TableCell><TableCell><Badge variant={resourceTypeVariant[r.type] ?? "secondary"} className="capitalize">{r.type}</Badge></TableCell><TableCell><span className="text-sm text-muted-foreground">{r.shelfRef ?? "—"}</span></TableCell><TableCell><Badge variant={resourceStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="libraryResources" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="digital" className="mt-4">
          {digitalResources.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Title</TableHead><TableHead>Provider</TableHead><TableHead>Access Type</TableHead><TableHead>Valid From</TableHead><TableHead>Valid Until</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredDigital.map((d) => (<TableRow key={d.id} className="group"><TableCell className="pl-5 font-medium">{d.title}</TableCell><TableCell><span className="text-sm">{d.provider}</span></TableCell><TableCell><Badge variant={accessTypeVariant[d.accessType] ?? "secondary"} className="capitalize">{d.accessType.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(d.validFrom)}</span></TableCell><TableCell><span className="text-sm">{d.validUntil ? fmtDate(d.validUntil) : "—"}</span></TableCell><TableCell><Badge variant={digitalStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="digitalResources" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <LibraryResourceFormDialog open={resourceOpen} onOpenChange={setResourceOpen} resource={editingResource} />
      <DigitalResourceFormDialog open={digitalOpen} onOpenChange={setDigitalOpen} resource={editingDigital} />
    </div>
  );
}
