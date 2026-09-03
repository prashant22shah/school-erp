import { useMemo, useState } from "react";
import { Users, Search, Plus, Pencil, Trash2, Home, Layers } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SectionFormDialog } from "@/pages/section-form-dialog";
import { useSections, useHouses, useCohorts, useDeleteSection } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Section } from "@/lib/types";

export default function SectionHouseCohortPage() {
  const sections = useSections();
  const houses = useHouses();
  const cohorts = useCohorts();
  const deleteSection = useDeleteSection();
  const [q, setQ] = useState("");
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | undefined>();

  const filteredSections = useMemo(() => {
    let list = sections.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((sec) => sec.name.toLowerCase().includes(s) || sec.gradeClassName.toLowerCase().includes(s)); }
    return list;
  }, [sections.data, q]);

  const filteredHouses = useMemo(() => {
    let list = houses.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((h) => h.name.toLowerCase().includes(s) || h.code.toLowerCase().includes(s)); }
    return list;
  }, [houses.data, q]);

  const filteredCohorts = useMemo(() => {
    let list = cohorts.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.name.toLowerCase().includes(s) || c.gradeClassName.toLowerCase().includes(s)); }
    return list;
  }, [cohorts.data, q]);

  const totalEnrolled = (sections.data ?? []).reduce((sum, s) => sum + s.enrolled, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Sections, Houses & Cohorts"
        titleNe="सेक्सन, हाउस तथा कोहोर्ट"
        microModule="M03.04"
        description="Class sections with capacity, school houses and student cohorts."
        actions={
          <Button onClick={() => { setEditingSection(undefined); setSectionDialogOpen(true); }}>
            <Plus className="h-4 w-4" /> New section
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Users className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total sections</p><p className="text-lg font-bold">{sections.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total enrolled</p><p className="text-lg font-bold">{totalEnrolled}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Home className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total houses</p><p className="text-lg font-bold">{houses.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Layers className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total cohorts</p><p className="text-lg font-bold">{cohorts.data?.length ?? 0}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search sections, houses or cohorts…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="sections">
        <TabsList>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="houses">Houses</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="mt-4">
          {sections.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Section</TableHead>
                      <TableHead>Grade/Class</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSections.map((s) => (
                      <TableRow key={s.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{s.name}</p>
                          {s.nameNe && <p className="text-xs text-muted-foreground">{s.nameNe}</p>}
                        </TableCell>
                        <TableCell><Badge variant="secondary">{s.gradeClassName}</Badge></TableCell>
                        <TableCell><span className="text-sm">{s.academicYearName}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{s.capacity}</span></TableCell>
                        <TableCell>
                          <span className="text-sm font-mono">{s.enrolled}</span>
                          {s.enrolled >= s.capacity && <Badge variant="destructive" className="ml-1 text-[10px]">Full</Badge>}
                        </TableCell>
                        <TableCell><span className="text-sm">{s.classTeacherName ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{s.roomNo ?? "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingSection(s); setSectionDialogOpen(true); }}><Pencil /> Edit section</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteSection.mutate(s)}><Trash2 /> Delete section</DropdownMenuItem>
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

        <TabsContent value="houses" className="mt-4">
          {houses.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">House</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Members</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHouses.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="pl-5">
                          <p className="font-medium">{h.name}</p>
                          {h.nameNe && <p className="text-xs text-muted-foreground">{h.nameNe}</p>}
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{h.code}</code></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: h.color }} />
                            <span className="text-sm">{h.color}</span>
                          </div>
                        </TableCell>
                        <TableCell><span className="text-sm">{h.description || "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{h.memberCount}</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cohorts" className="mt-4">
          {cohorts.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Cohort</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Grade/Class</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Students</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCohorts.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="pl-5">
                          <p className="font-medium">{c.name}</p>
                          {c.nameNe && <p className="text-xs text-muted-foreground">{c.nameNe}</p>}
                        </TableCell>
                        <TableCell><Badge variant="secondary">{c.academicYearName}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{c.gradeClassName}</Badge></TableCell>
                        <TableCell><span className="text-sm">{c.description || "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{c.studentCount}</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <SectionFormDialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen} section={editingSection} />
    </div>
  );
}
