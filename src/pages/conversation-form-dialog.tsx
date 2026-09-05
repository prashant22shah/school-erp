import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveConversation } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Conversation } from "@/lib/types";

const TYPES = ["parent_teacher", "student_advisor", "admin_parent", "group"] as const;
const STATUSES = ["active", "archived", "closed"] as const;

export function ConversationFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: Conversation }) {
  const save = useSaveConversation();
  const [form, setForm] = useState<Partial<Conversation>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          contextRef: "", type: "parent_teacher",
          status: "active", subject: "",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<Conversation>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.type || !form.status || !form.subject) return;
    save.mutate(
      {
        id: editing?.id ?? uid(),
        tenantId: editing?.tenantId ?? "",
        schoolId: editing?.schoolId ?? "",
        contextRef: form.contextRef || "",
        type: form.type!,
        status: form.status!,
        subject: form.subject!,
      } as Conversation,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Conversation" : "Create Conversation"}</DialogTitle>
          <DialogDescription>Start or edit a conversation (M23.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Subject</Label>
            <Input placeholder="Conversation subject" value={form.subject ?? ""} onChange={(e) => set({ subject: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
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
            <Label>Context Reference</Label>
            <Input placeholder="Related entity ID" value={form.contextRef ?? ""} onChange={(e) => set({ contextRef: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.type || !form.status || !form.subject}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Conversation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
