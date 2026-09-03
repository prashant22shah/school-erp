import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSavePortalAnnouncement } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { PortalAnnouncement, PortalAudience, PortalAnnouncementStatus } from "@/lib/types";

const AUDIENCES: PortalAudience[] = ["all", "student", "parent", "teacher", "staff"];
const STATUSES: PortalAnnouncementStatus[] = ["draft", "published", "archived"];

export function PortalAnnouncementFormDialog({ open, onOpenChange, announcement }: { open: boolean; onOpenChange: (o: boolean) => void; announcement?: PortalAnnouncement }) {
  const save = useSavePortalAnnouncement();
  const [form, setForm] = useState<Partial<PortalAnnouncement>>({});

  useEffect(() => {
    if (open) {
      setForm(
        announcement ?? {
          title: "",
          body: "",
          targetAudience: "all",
          publishOn: new Date().toISOString().slice(0, 10),
          expiresOn: "",
          status: "draft",
        }
      );
    }
  }, [open, announcement]);

  const set = (patch: Partial<PortalAnnouncement>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.title || !form.body || !form.targetAudience || !form.publishOn || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: announcement?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: announcement?.createdOn ?? now,
        updatedOn: now,
        title: form.title!,
        body: form.body!,
        targetAudience: form.targetAudience!,
        publishOn: form.publishOn!,
        expiresOn: form.expiresOn || undefined,
        status: form.status!,
      } as PortalAnnouncement,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{announcement ? `Edit announcement — ${announcement.title}` : "Create announcement"}</DialogTitle>
          <DialogDescription>Publish targeted portal announcements (M11.01 / M11.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Dashain Holiday Notice" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Target Audience</Label>
            <Select value={form.targetAudience} onValueChange={(v) => set({ targetAudience: v as PortalAudience })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{AUDIENCES.map((a) => <SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PortalAnnouncementStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Publish On</Label>
            <Input type="date" value={form.publishOn ? form.publishOn.slice(0, 10) : ""} onChange={(e) => set({ publishOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Expires On (optional)</Label>
            <Input type="date" value={form.expiresOn ? form.expiresOn.slice(0, 10) : ""} onChange={(e) => set({ expiresOn: e.target.value || undefined })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Body</Label>
            <Textarea placeholder="Announcement body…" value={form.body ?? ""} onChange={(e) => set({ body: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.title || !form.body || !form.targetAudience || !form.publishOn || !form.status}>
            <Plus className="h-4 w-4" /> {announcement ? "Save changes" : "Create announcement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
