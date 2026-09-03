import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveLibraryResource } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LibraryResource, ResourceType, ResourceStatus } from "@/lib/types";

const TYPES: ResourceType[] = ["book", "journal", "reference", "digital", "av", "thesis"];
const STATUSES: ResourceStatus[] = ["available", "restricted", "archived", "lost"];

export function LibraryResourceFormDialog({ open, onOpenChange, resource }: { open: boolean; onOpenChange: (o: boolean) => void; resource?: LibraryResource | null }) {
  const save = useSaveLibraryResource();
  const [form, setForm] = useState<Partial<LibraryResource>>({});

  useEffect(() => {
    if (open) {
      setForm(
        resource ?? {
          accessionNo: "",
          title: "",
          subtitle: "",
          author: "",
          isbn: "",
          publisher: "",
          publishedYear: new Date().getFullYear(),
          language: "en",
          category: "",
          type: "book",
          shelfRef: "",
          status: "available",
        }
      );
    }
  }, [open, resource]);

  const set = (patch: Partial<LibraryResource>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.accessionNo || !form.title || !form.author || !form.language || !form.category || !form.type || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: resource?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: resource?.createdOn ?? now,
        updatedOn: now,
        accessionNo: form.accessionNo!,
        title: form.title!,
        subtitle: form.subtitle || undefined,
        author: form.author!,
        isbn: form.isbn || undefined,
        publisher: form.publisher || undefined,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
        language: form.language!,
        category: form.category!,
        type: form.type!,
        shelfRef: form.shelfRef || undefined,
        tags: form.tags,
        status: form.status!,
      } as LibraryResource,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{resource ? `Edit resource — ${resource.title}` : "Create library resource"}</DialogTitle>
          <DialogDescription>Catalog and metadata for library resources (M16.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Accession No</Label>
            <Input placeholder="e.g. ACC-0005" value={form.accessionNo ?? ""} onChange={(e) => set({ accessionNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ResourceStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input placeholder="Resource title" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Subtitle (optional)</Label>
            <Input placeholder="Subtitle" value={form.subtitle ?? ""} onChange={(e) => set({ subtitle: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Author</Label>
            <Input placeholder="Author name" value={form.author ?? ""} onChange={(e) => set({ author: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Input placeholder="e.g. Science" value={form.category ?? ""} onChange={(e) => set({ category: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>ISBN (optional)</Label>
            <Input placeholder="978-…" value={form.isbn ?? ""} onChange={(e) => set({ isbn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Publisher (optional)</Label>
            <Input placeholder="Publisher" value={form.publisher ?? ""} onChange={(e) => set({ publisher: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Published Year</Label>
            <Input type="number" placeholder="2024" value={form.publishedYear ?? ""} onChange={(e) => set({ publishedYear: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
          <div className="space-y-1.5">
            <Label>Language</Label>
            <Input placeholder="e.g. en, ne" value={form.language ?? ""} onChange={(e) => set({ language: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as ResourceType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Shelf Ref (optional)</Label>
            <Input placeholder="e.g. A-01-03" value={form.shelfRef ?? ""} onChange={(e) => set({ shelfRef: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Tags (comma separated, optional)</Label>
            <Textarea placeholder="e.g. grammar, maps" value={form.tags ? form.tags.join(", ") : ""} onChange={(e) => set({ tags: e.target.value ? e.target.value.split(",").map((t) => t.trim()).filter(Boolean) : undefined })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.accessionNo || !form.title || !form.author || !form.language || !form.category || !form.type || !form.status}>
            <Plus className="h-4 w-4" /> {resource ? "Save changes" : "Create resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
