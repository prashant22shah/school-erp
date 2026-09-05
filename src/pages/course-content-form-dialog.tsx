import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCourseContent } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { CourseContent, ContentKind } from "@/lib/types";

const CONTENT_KINDS: ContentKind[] = ["document", "video", "link", "scorm", "quiz", "assignment"];
const STATUSES: Array<"draft" | "published" | "archived"> = ["draft", "published", "archived"];

export function CourseContentFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: CourseContent }) {
  const save = useSaveCourseContent();
  const [form, setForm] = useState<Partial<CourseContent>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          courseSpaceRef: "", title: "", type: "document", url: "",
          description: "", sortOrder: 0, status: "draft",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<CourseContent>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.courseSpaceRef || !form.title) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        sortOrder: Number(form.sortOrder),
        updatedOn: now,
      } as CourseContent,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit content — ${editing.title}` : "Create course content"}</DialogTitle>
          <DialogDescription>Add a content item to a course space (M10.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Course Space Ref</Label>
            <Input placeholder="e.g. CS-MATH-10" value={form.courseSpaceRef ?? ""} onChange={(e) => set({ courseSpaceRef: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Chapter 1 Notes" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as ContentKind })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CONTENT_KINDS.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as "draft" | "published" | "archived" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>URL</Label>
            <Input placeholder="https://…" value={form.url ?? ""} onChange={(e) => set({ url: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Brief description" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Sort Order</Label>
            <Input type="number" min={0} value={form.sortOrder ?? 0} onChange={(e) => set({ sortOrder: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.courseSpaceRef || !form.title}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
