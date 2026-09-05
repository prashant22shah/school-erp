import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveReportBuilder } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";

const CATEGORY_OPTIONS = ["student", "academic", "finance", "hr", "operational", "custom"] as const;
const STATUS_OPTIONS = ["draft", "published", "archived"] as const;
const CHART_OPTIONS = ["table", "bar", "line", "pie", "area", "scatter", "none"] as const;

export function ReportBuilderFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: any }) {
  const save = useSaveReportBuilder();
  const [form, setForm] = useState({ id: "", name: "", description: "", category: "student", dataSource: "", columns: "", filters: "", groupBy: "", sortBy: "", chartType: "table", status: "draft", createdBy: "", createdOn: "" });

  useEffect(() => {
    if (open) {
      if (editing) setForm(editing);
      else setForm({ id: uid(), name: "", description: "", category: "student", dataSource: "", columns: "", filters: "", groupBy: "", sortBy: "", chartType: "table", status: "draft", createdBy: "", createdOn: new Date().toISOString() });
    }
  }, [open, editing]);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Report Builder" : "Create Report Builder"}</DialogTitle>
          <DialogDescription>Define a custom report configuration (M24.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Student Attendance Report" value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set({ category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORY_OPTIONS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Data Source</Label>
            <Input placeholder="e.g. attendance_sessions" value={form.dataSource} onChange={(e) => set({ dataSource: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Columns</Label>
            <Input placeholder="e.g. studentName, grade, date" value={form.columns} onChange={(e) => set({ columns: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Filters</Label>
            <Input placeholder="e.g. grade=10, status=active" value={form.filters} onChange={(e) => set({ filters: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Group By</Label>
            <Input placeholder="e.g. grade" value={form.groupBy} onChange={(e) => set({ groupBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Sort By</Label>
            <Input placeholder="e.g. date desc" value={form.sortBy} onChange={(e) => set({ sortBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Chart Type</Label>
            <Select value={form.chartType} onValueChange={(v) => set({ chartType: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CHART_OPTIONS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Created By</Label>
            <Input placeholder="e.g. Admin" value={form.createdBy} onChange={(e) => set({ createdBy: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Report description…" value={form.description} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate(form as any, { onSuccess: () => onOpenChange(false) })} disabled={save.isPending || !form.name}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
