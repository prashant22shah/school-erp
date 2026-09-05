import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveMessage } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Message } from "@/lib/types";

const CHANNELS = ["email", "sms", "push", "in_app"] as const;
const STATUSES = ["queued", "sent", "delivered", "failed"] as const;

export function MessageFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: Message }) {
  const save = useSaveMessage();
  const [form, setForm] = useState<Partial<Message>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          templateRef: "", recipientRef: "", channel: "email",
          status: "queued", content: "",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<Message>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.channel || !form.status) return;
    save.mutate(
      {
        id: editing?.id ?? uid(),
        tenantId: editing?.tenantId ?? "",
        schoolId: editing?.schoolId ?? "",
        templateRef: form.templateRef || "",
        recipientRef: form.recipientRef || "",
        channel: form.channel!,
        status: form.status!,
        content: form.content || "",
      } as Message,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Message" : "Create Message"}</DialogTitle>
          <DialogDescription>Send or schedule a message (M23.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Template Reference</Label>
            <Input placeholder="Template ID or name" value={form.templateRef ?? ""} onChange={(e) => set({ templateRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Recipient Reference</Label>
            <Input placeholder="Recipient ID or email" value={form.recipientRef ?? ""} onChange={(e) => set({ recipientRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Channel</Label>
            <Select value={form.channel} onValueChange={(v) => set({ channel: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CHANNELS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Content</Label>
            <Textarea placeholder="Message content…" value={form.content ?? ""} onChange={(e) => set({ content: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.channel || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
