import { useMemo, useState } from "react";
import { Users, Settings, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { FormerStudentFormDialog } from "@/pages/former-student-form-dialog";
import { useFormerStudents, useAlumniPreferences, useDeleteFormerStudent, useDeleteAlumniPreference } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { FormerStudent, AlumniPreference } from "@/lib/types";

const studentStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success", inactive: "secondary", lost_contact: "warning",
};
const prefStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  subscribed: "success", unsubscribed: "secondary",
};

export default function AlumniPage() {
  const students = useFormerStudents();
  const prefs = useAlumniPreferences();
  const deleteStudent = useDeleteFormerStudent();
  const deletePref = useDeleteAlumniPreference();
  const [q, setQ] = useState("");
  const [studentOpen, setStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<FormerStudent | undefined>();

  const filteredStudents = useMemo(() => {
    let list = students.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((st) => st.studentName.toLowerCase().includes(s) || st.lastClass.toLowerCase().includes(s) || st.contactEmail.toLowerCase().includes(s) || st.status.toLowerCase().includes(s)); }
    return list;
  }, [students.data, q]);

  const filteredPrefs = useMemo(() => {
    let list = prefs.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.channel.toLowerCase().includes(s) || p.purpose.toLowerCase().includes(s) || p.status.toLowerCase().includes(s)); }
    return list;
  }, [prefs.data, q]);

  const activeStudents = (students.data ?? []).filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Former Students & Alumni"
        titleNe="पूर्व विद्यार्थी र एलुम्नाइ"
        microModule="M21.07"
        description="Manage former student records and alumni communication preferences."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="formerStudents">
              <Button variant="outline" onClick={() => { setEditingStudent(undefined); setStudentOpen(true); }}><Plus className="h-4 w-4" /> New Former Student</Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Former Students</p><p className="text-lg font-bold">{students.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Alumni</p><p className="text-lg font-bold">{activeStudents}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Settings className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Alumni Preferences</p><p className="text-lg font-bold">{prefs.data?.length ?? 0}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search students or preferences…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>

      <Tabs defaultValue="students">
        <TabsList><TabsTrigger value="students">Former Students</TabsTrigger><TabsTrigger value="preferences">Alumni Preferences</TabsTrigger></TabsList>

        <TabsContent value="students" className="mt-4">
          {students.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Completion Year</TableHead><TableHead>Last Class</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredStudents.map((st) => (<TableRow key={st.id} className="group"><TableCell className="pl-5 font-medium">{st.studentName}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{st.completionYear}</code></TableCell><TableCell><Badge variant="secondary">{st.lastClass}</Badge></TableCell><TableCell><span className="text-sm text-muted-foreground">{st.contactEmail}</span></TableCell><TableCell><span className="text-sm font-mono">{st.contactPhone}</span></TableCell><TableCell><Badge variant={studentStatusVariant[st.status] ?? "secondary"} className="capitalize">{st.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="formerStudents" onEdit={() => { setEditingStudent(st); setStudentOpen(true); }} onDelete={() => deleteStudent.mutate(st)} editLabel="Edit student" deleteLabel="Delete student" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="preferences" className="mt-4">
          {prefs.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Former Student Ref</TableHead><TableHead>Channel</TableHead><TableHead>Purpose</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPrefs.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.formerStudentRef.slice(0, 8)}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{p.channel}</Badge></TableCell><TableCell><Badge variant="info" className="capitalize">{p.purpose}</Badge></TableCell><TableCell><Badge variant={prefStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="alumniPreferences" onEdit={() => {}} onDelete={() => deletePref.mutate(p)} editLabel="Edit preference" deleteLabel="Delete preference" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <FormerStudentFormDialog open={studentOpen} onOpenChange={setStudentOpen} student={editingStudent} />
    </div>
  );
}
