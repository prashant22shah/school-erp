import { useMemo, useState } from "react";
import { Briefcase, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PositionFormDialog } from "@/pages/position-form-dialog";
import { usePositions, useDeletePosition } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { Position } from "@/lib/types";

export default function PositionControlPage() {
  const positions = usePositions();
  const deletePosition = useDeletePosition();
  const [q, setQ] = useState("");
  const [posOpen, setPosOpen] = useState(false);
  const [editingPos, setEditingPos] = useState<Position | undefined>();

  const filteredPositions = useMemo(() => {
    let list = positions.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(s) || p.department.toLowerCase().includes(s) || p.grade.toLowerCase().includes(s));
    }
    return list;
  }, [positions.data, q]);

  const totalPositions = positions.data?.length ?? 0;
  const filledCount = (positions.data ?? []).filter((p) => !p.isVacant).length;
  const vacantCount = (positions.data ?? []).filter((p) => p.isVacant).length;
  const onHoldCount = 0;

  const deptBudgets = useMemo(() => {
    const map: Record<string, number> = {};
    (positions.data ?? []).forEach((p) => {
      map[p.department] = (map[p.department] ?? 0) + p.headCount;
    });
    return Object.entries(map).map(([dept, headcount]) => ({ dept, headcount }));
  }, [positions.data]);

  return (
    <div className="space-y-6">
      <PageHeader icon={Briefcase} title="Position & Establishment" titleNe="पद तथा स्थापना" microModule="M13.02" description="Manage positions, sanctioned strength and establishment planning." actions={<Button onClick={() => { setEditingPos(undefined); setPosOpen(true); }}><Plus className="h-4 w-4" /> New Position</Button>} />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Briefcase className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Positions</p><p className="text-lg font-bold">{totalPositions}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Briefcase className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Filled</p><p className="text-lg font-bold">{filledCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Briefcase className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Vacant</p><p className="text-lg font-bold">{vacantCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Briefcase className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">On Hold</p><p className="text-lg font-bold">{onHoldCount}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search positions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="positions">
        <TabsList><TabsTrigger value="positions">Positions</TabsTrigger><TabsTrigger value="establishment">Establishment</TabsTrigger><TabsTrigger value="recruitment">Recruitment Plan</TabsTrigger></TabsList>

        <TabsContent value="positions" className="mt-4">
          {positions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Title</TableHead><TableHead>Department</TableHead><TableHead>Grade</TableHead><TableHead>Sanctioned</TableHead><TableHead>Filled</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPositions.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5 font-medium">{p.title}</TableCell><TableCell><Badge variant="secondary">{p.department}</Badge></TableCell><TableCell><span className="text-sm">{p.grade}</span></TableCell><TableCell><span className="text-sm font-mono">{p.headCount}</span></TableCell><TableCell><span className="text-sm font-mono">{p.isVacant ? 0 : p.headCount}</span></TableCell><TableCell><Badge variant={p.isVacant ? "warning" : "success"}>{p.isVacant ? "Vacant" : "Filled"}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingPos(p); setPosOpen(true); }}><Pencil /> Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deletePosition.mutate(p)}><Trash2 /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="establishment" className="mt-4">
          <div className="space-y-4">
            <Card className="animate-fade-up"><CardHeader><CardTitle className="text-sm">Budget Allocation by Department</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Department</TableHead><TableHead>Head Count</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{deptBudgets.map(({ dept, headcount }) => (<TableRow key={dept}><TableCell className="pl-5 font-medium">{dept}</TableCell><TableCell><span className="text-sm font-mono">{headcount}</span></TableCell><TableCell className="pr-5" /></TableRow>))}</TableBody></Table></CardContent></Card>
            <Card className="animate-fade-up"><CardHeader><CardTitle className="text-sm">Headcount Summary</CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-4 text-center"><div><p className="text-2xl font-bold">{filledCount}</p><p className="text-xs text-muted-foreground">Filled</p></div><div><p className="text-2xl font-bold">{vacantCount}</p><p className="text-xs text-muted-foreground">Vacant</p></div><div><p className="text-2xl font-bold">{totalPositions}</p><p className="text-xs text-muted-foreground">Total</p></div></div></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="recruitment" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Position</TableHead><TableHead>Department</TableHead><TableHead>Planned</TableHead><TableHead>Timeline</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{(positions.data ?? []).filter((p) => p.isVacant).map((p) => (<TableRow key={p.id}><TableCell className="pl-5 font-medium">{p.title}</TableCell><TableCell><Badge variant="secondary">{p.department}</Badge></TableCell><TableCell><span className="text-sm font-mono">{p.headCount}</span></TableCell><TableCell><span className="text-sm text-muted-foreground">TBD</span></TableCell><TableCell className="pr-5" /></TableRow>))}{(positions.data ?? []).filter((p) => p.isVacant).length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No vacant positions to recruit for.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>

      <PositionFormDialog open={posOpen} onOpenChange={setPosOpen} position={editingPos} />
    </div>
  );
}
