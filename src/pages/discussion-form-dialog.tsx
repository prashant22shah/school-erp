import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveDiscussion } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Discussion } from "@/lib/types";

const STATUSES: Discussion["status"][] = ["open", "closed", "pinned"];

export function DiscussionFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: Discussion }) {
  const save = useSaveDiscussion();
  const [form, setForm] = useState<Partial<Discussion>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          courseSpaceRef: "", title: "", authorRef: "", authorName: "",
          postCount: 0, lastPostOn: "", status: "open",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<Discussion>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.courseSpaceRef || !form.title) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), createdOn: now }),
        ...form,
        postCount: Number(form.postCount),
      } as Discussion,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit discussion — ${editing.title}` : "Create discussion"}</DialogTitle>
          <DialogDescription>Start a new course discussion thread (M10.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Course Space Ref</Label>
            <Input placeholder="Course space ID" value={form.courseSpaceRef ?? ""} onChange={(e) => set({ courseSpaceRef: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Chapter 4 Discussion" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Author Ref</Label>
            <Input placeholder="Author ID" value={form.authorRef ?? ""} onChange={(e) => set({ authorRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Author Name</Label>
            <Input placeholder="e.g. Mr. Sharma" value={form.authorName ?? ""} onChange={(e) => set({ authorName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as Discussion["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.courseSpaceRef || !form.title}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create discussion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
