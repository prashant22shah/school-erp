import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveContentImport } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ContentImport, ImportSource } from "@/lib/types";

const SOURCE_TYPES: ImportSource[] = ["scorm", "qti", "common_cartridge", "csv"];
const STATUSES: ContentImport["status"][] = ["pending", "processing", "completed", "failed"];

export function ContentImportFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: ContentImport }) {
  const save = useSaveContentImport();
  const [form, setForm] = useState<Partial<ContentImport>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          sourceType: "scorm", fileName: "", targetCourseRef: "",
          importedBy: "", itemCount: 0, errors: "", status: "pending",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<ContentImport>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.fileName || !form.targetCourseRef) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), createdOn: now }),
        ...form,
        itemCount: Number(form.itemCount),
      } as ContentImport,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit import — ${editing.fileName}` : "Import content"}</DialogTitle>
          <DialogDescription>Import content packages from external sources (M10.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Source Type</Label>
            <Select value={form.sourceType} onValueChange={(v) => set({ sourceType: v as ImportSource })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SOURCE_TYPES.map((s) => <SelectItem key={s} value={s} className="uppercase">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ContentImport["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>File Name</Label>
            <Input placeholder="e.g. course-pack.zip" value={form.fileName ?? ""} onChange={(e) => set({ fileName: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Target Course Ref</Label>
            <Input placeholder="Course space ID" value={form.targetCourseRef ?? ""} onChange={(e) => set({ targetCourseRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Imported By</Label>
            <Input placeholder="Importer name" value={form.importedBy ?? ""} onChange={(e) => set({ importedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Item Count</Label>
            <Input type="number" min={0} value={form.itemCount ?? 0} onChange={(e) => set({ itemCount: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Errors</Label>
            <Input placeholder="Error messages (if any)" value={form.errors ?? ""} onChange={(e) => set({ errors: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.fileName || !form.targetCourseRef}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Start import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
