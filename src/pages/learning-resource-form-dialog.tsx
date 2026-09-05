import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveLearningResource } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LearningResource, ResourceKind } from "@/lib/types";

const RESOURCE_KINDS: ResourceKind[] = ["book", "video", "article", "simulation", "worksheet", "other"];
const ACCESS_LEVELS: Array<"public" | "restricted"> = ["public", "restricted"];

export function LearningResourceFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: LearningResource }) {
  const save = useSaveLearningResource();
  const [form, setForm] = useState<Partial<LearningResource>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          title: "", type: "book", subject: "", grade: "", url: "",
          description: "", language: "en", accessLevel: "public",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<LearningResource>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.title) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as LearningResource,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit resource — ${editing.title}` : "Create learning resource"}</DialogTitle>
          <DialogDescription>Add a shared learning resource (M10.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Physics Textbook" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as ResourceKind })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RESOURCE_KINDS.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Access Level</Label>
            <Select value={form.accessLevel} onValueChange={(v) => set({ accessLevel: v as "public" | "restricted" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ACCESS_LEVELS.map((a) => <SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Input placeholder="e.g. Physics" value={form.subject ?? ""} onChange={(e) => set({ subject: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Grade</Label>
            <Input placeholder="e.g. Grade 10" value={form.grade ?? ""} onChange={(e) => set({ grade: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>URL</Label>
            <Input placeholder="https://…" value={form.url ?? ""} onChange={(e) => set({ url: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Language</Label>
            <Input placeholder="e.g. en" value={form.language ?? ""} onChange={(e) => set({ language: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input placeholder="Brief description" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.title}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
