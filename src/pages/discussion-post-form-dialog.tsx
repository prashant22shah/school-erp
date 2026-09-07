import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSaveDiscussionPost } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { DiscussionPost } from "@/lib/types";

export function DiscussionPostFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: DiscussionPost }) {
  const save = useSaveDiscussionPost();
  const [form, setForm] = useState<Partial<DiscussionPost>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          discussionRef: "", authorRef: "", authorName: "", content: "", parentPostId: "",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<DiscussionPost>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.discussionRef || !form.authorName || !form.content) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), createdOn: now }),
        ...form,
      } as DiscussionPost,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit post by ${editing.authorName}` : "Create post"}</DialogTitle>
          <DialogDescription>Add a post to a discussion thread (M10.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Discussion Ref</Label>
            <Input placeholder="Discussion ID" value={form.discussionRef ?? ""} onChange={(e) => set({ discussionRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Author Ref</Label>
            <Input placeholder="Author ID" value={form.authorRef ?? ""} onChange={(e) => set({ authorRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Author Name</Label>
            <Input placeholder="e.g. Ram Shrestha" value={form.authorName ?? ""} onChange={(e) => set({ authorName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Parent Post ID</Label>
            <Input placeholder="Leave blank for root post" value={form.parentPostId ?? ""} onChange={(e) => set({ parentPostId: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Content</Label>
            <Textarea placeholder="Post content" value={form.content ?? ""} onChange={(e) => set({ content: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.discussionRef || !form.authorName || !form.content}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
