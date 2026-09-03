import { useMemo, useState } from "react";
import { BookOpenCheck, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CurriculumMapFormDialog } from "@/pages/curriculum-map-form-dialog";
import { LearningOutcomeFormDialog } from "@/pages/learning-outcome-form-dialog";
import { useCurriculumMaps, useLearningOutcomes, useDeleteCurriculumMap, useDeleteLearningOutcome } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { CurriculumMap, LearningOutcome } from "@/lib/types";

const mapStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", submitted: "info", verified: "info", approved: "success", published: "default", superseded: "warning",
};

export default function CurriculumMappingPage() {
  const maps = useCurriculumMaps();
  const outcomes = useLearningOutcomes();
  const deleteMap = useDeleteCurriculumMap();
  const deleteOutcome = useDeleteLearningOutcome();
  const [q, setQ] = useState("");
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [editingMap, setEditingMap] = useState<CurriculumMap | undefined>();
  const [outcomeDialogOpen, setOutcomeDialogOpen] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState<LearningOutcome | undefined>();

  const filteredMaps = useMemo(() => {
    let list = maps.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => m.offeringRef.toLowerCase().includes(s) || String(m.version).includes(s)); }
    return list;
  }, [maps.data, q]);

  const filteredOutcomes = useMemo(() => {
    let list = outcomes.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((o) => o.code.toLowerCase().includes(s) || o.description.toLowerCase().includes(s) || o.curriculumMapId.toLowerCase().includes(s)); }
    return list;
  }, [outcomes.data, q]);

  const publishedMaps = (maps.data ?? []).filter((m) => m.status === "published").length;
  const totalOutcomes = outcomes.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpenCheck}
        title="Curriculum Mapping"
        titleNe="पाठ्यक्रम मानचित्रण"
        microModule="M06.01"
        description="Curriculum maps and learning outcomes aligned to offerings."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingMap(undefined); setMapDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New Map
            </Button>
            <Button onClick={() => { setEditingOutcome(undefined); setOutcomeDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New Outcome
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BookOpenCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total maps</p><p className="text-lg font-bold">{maps.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><BookOpenCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{publishedMaps}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><BookOpenCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Learning outcomes</p><p className="text-lg font-bold">{totalOutcomes}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search maps or outcomes…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="maps">
        <TabsList>
          <TabsTrigger value="maps">Curriculum Maps</TabsTrigger>
          <TabsTrigger value="outcomes">Learning Outcomes</TabsTrigger>
        </TabsList>

        <TabsContent value="maps" className="mt-4">
          {maps.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Offering Ref</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaps.map((m) => (
                      <TableRow key={m.id} className="group">
                        <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{m.offeringRef}</code></TableCell>
                        <TableCell><span className="text-sm font-mono">v{m.version}</span></TableCell>
                        <TableCell><Badge variant={mapStatusVariant[m.status] ?? "secondary"} className="capitalize">{m.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingMap(m); setMapDialogOpen(true); }}><Pencil /> Edit map</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteMap.mutate(m)}><Trash2 /> Delete map</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="outcomes" className="mt-4">
          {outcomes.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Code</TableHead>
                      <TableHead>Curriculum Map</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOutcomes.map((o) => (
                      <TableRow key={o.id} className="group">
                        <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{o.code}</code></TableCell>
                        <TableCell><Badge variant="secondary">{o.curriculumMapId}</Badge></TableCell>
                        <TableCell><span className="text-sm">{o.description}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingOutcome(o); setOutcomeDialogOpen(true); }}><Pencil /> Edit outcome</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteOutcome.mutate(o)}><Trash2 /> Delete outcome</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <CurriculumMapFormDialog open={mapDialogOpen} onOpenChange={setMapDialogOpen} map={editingMap} />
      <LearningOutcomeFormDialog open={outcomeDialogOpen} onOpenChange={setOutcomeDialogOpen} outcome={editingOutcome} />
    </div>
  );
}
