import { useMemo, useState } from "react";
import { Layers, Search, Plus, Pencil, Trash2, BookOpen, GraduationCap, GitBranch } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SchoolLevelFormDialog } from "@/pages/school-level-form-dialog";
import { GradeClassFormDialog } from "@/pages/grade-class-form-dialog";
import { StreamFormDialog } from "@/pages/stream-form-dialog";
import { useSchoolLevels, useGradeClasses, useStreams, useSaveSchoolLevel, useDeleteGradeClass, useDeleteStream } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SchoolLevel, GradeClass, Stream } from "@/lib/types";

export default function LevelGradeStreamPage() {
  const levels = useSchoolLevels();
  const gradeClasses = useGradeClasses();
  const streams = useStreams();
  const deleteGradeClass = useDeleteGradeClass();
  const deleteStream = useDeleteStream();
  const [q, setQ] = useState("");
  const [levelDialogOpen, setLevelDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<SchoolLevel | undefined>();
  const [gcDialogOpen, setGcDialogOpen] = useState(false);
  const [editingGc, setEditingGc] = useState<GradeClass | undefined>();
  const [streamDialogOpen, setStreamDialogOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | undefined>();

  const filteredLevels = useMemo(() => {
    let list = levels.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((l) => l.name.toLowerCase().includes(s) || l.code.toLowerCase().includes(s)); }
    return list;
  }, [levels.data, q]);

  const filteredGrades = useMemo(() => {
    let list = gradeClasses.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((g) => g.name.toLowerCase().includes(s) || g.code.toLowerCase().includes(s) || g.levelName.toLowerCase().includes(s)); }
    return list;
  }, [gradeClasses.data, q]);

  const filteredStreams = useMemo(() => {
    let list = streams.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((st) => st.name.toLowerCase().includes(s) || st.code.toLowerCase().includes(s) || st.gradeClassName.toLowerCase().includes(s)); }
    return list;
  }, [streams.data, q]);

  const activeGrades = (gradeClasses.data ?? []).filter((g) => g.isActive).length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Layers}
        title="Level, Grade & Stream Catalog"
        titleNe="तह, कक्षा तथा स्ट्रिम"
        microModule="M03.02"
        description="School levels, grades/classes and academic streams catalog."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="schoolLevels">
              <Button variant="outline" onClick={() => { setEditingLevel(undefined); setLevelDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New level
              </Button>
            </CanCreate>
            <CanCreate resource="schoolLevels">
              <Button variant="outline" onClick={() => { setEditingGc(undefined); setGcDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New grade/class
              </Button>
            </CanCreate>
            <CanCreate resource="schoolLevels">
              <Button onClick={() => { setEditingStream(undefined); setStreamDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New stream
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Layers className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total levels</p><p className="text-lg font-bold">{levels.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><GraduationCap className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total grades</p><p className="text-lg font-bold">{gradeClasses.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><GitBranch className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total streams</p><p className="text-lg font-bold">{streams.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><BookOpen className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active grades</p><p className="text-lg font-bold">{activeGrades}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search levels, grades or streams…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="levels">
        <TabsList>
          <TabsTrigger value="levels">School Levels</TabsTrigger>
          <TabsTrigger value="grades">Grades/Classes</TabsTrigger>
          <TabsTrigger value="streams">Streams</TabsTrigger>
        </TabsList>

        <TabsContent value="levels" className="mt-4">
          {levels.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Level</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Age Range</TableHead>
                      <TableHead>Sequence</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLevels.map((l) => (
                      <TableRow key={l.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{l.name}</p>
                          {l.nameNe && <p className="text-xs text-muted-foreground">{l.nameNe}</p>}
                          <p className="text-xs text-muted-foreground mt-0.5">{l.description}</p>
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{l.code}</code></TableCell>
                        <TableCell><span className="text-sm">{l.ageRange ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{l.sequence}</span></TableCell>
                        <TableCell>{l.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="schoolLevels" onEdit={() => { setEditingLevel(l); setLevelDialogOpen(true); }} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="grades" className="mt-4">
          {gradeClasses.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Grade/Class</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Sequence</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((g) => (
                      <TableRow key={g.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{g.name}</p>
                          {g.nameNe && <p className="text-xs text-muted-foreground">{g.nameNe}</p>}
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{g.code}</code></TableCell>
                        <TableCell><Badge variant="secondary">{g.levelName}</Badge></TableCell>
                        <TableCell><span className="text-sm font-mono">{g.sequence}</span></TableCell>
                        <TableCell>{g.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="schoolLevels" onEdit={() => { setEditingGc(g); setGcDialogOpen(true); }} onDelete={() => deleteGradeClass.mutate(g)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="streams" className="mt-4">
          {streams.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Stream</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Grade/Class</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStreams.map((st) => (
                      <TableRow key={st.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{st.name}</p>
                          {st.nameNe && <p className="text-xs text-muted-foreground">{st.nameNe}</p>}
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{st.code}</code></TableCell>
                        <TableCell><Badge variant="secondary">{st.gradeClassName}</Badge></TableCell>
                        <TableCell><span className="text-sm">{st.description || "—"}</span></TableCell>
                        <TableCell>{st.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="schoolLevels" onEdit={() => { setEditingStream(st); setStreamDialogOpen(true); }} onDelete={() => deleteStream.mutate(st)} />
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

      <SchoolLevelFormDialog open={levelDialogOpen} onOpenChange={setLevelDialogOpen} level={editingLevel} />
      <GradeClassFormDialog open={gcDialogOpen} onOpenChange={setGcDialogOpen} gradeClass={editingGc} />
      <StreamFormDialog open={streamDialogOpen} onOpenChange={setStreamDialogOpen} stream={editingStream} />
    </div>
  );
}
