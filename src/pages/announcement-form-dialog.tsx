import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveAnnouncement } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Announcement } from "@/lib/types";

const STATUSES = ["draft", "published", "archived"] as const;

export function AnnouncementFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: Announcement }) {
  const save = useSaveAnnouncement();
  const [form, setForm] = useState<Partial<Announcement>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          title: "", content: "", audienceQuery: "",
          publishAt: "", status: "draft",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<Announcement>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.title || !form.status) return;
    save.mutate(
      {
        id: editing?.id ?? uid(),
        tenantId: editing?.tenantId ?? "",
        schoolId: editing?.schoolId ?? "",
        title: form.title!,
        content: form.content || "",
        audienceQuery: form.audienceQuery || "",
        publishAt: form.publishAt || new Date().toISOString(),
        status: form.status!,
      } as Announcement,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
          <DialogDescription>Create or edit an announcement (M23.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input placeholder="Announcement title" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Audience Query</Label>
            <Input placeholder="e.g. grade=10 OR all_parents" value={form.audienceQuery ?? ""} onChange={(e) => set({ audienceQuery: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Publish At</Label>
            <Input type="datetime-local" value={form.publishAt ? form.publishAt.slice(0, 16) : ""} onChange={(e) => set({ publishAt: e.target.value ? new Date(e.target.value).toISOString() : "" })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Content</Label>
            <Textarea placeholder="Announcement content…" value={form.content ?? ""} onChange={(e) => set({ content: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.title || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Announcement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
