import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSavePortalTicket } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { PortalTicket, TicketStatus, TicketPriority } from "@/lib/types";

type Category = PortalTicket["category"];
const CATEGORIES: Category[] = ["access", "content", "technical", "other"];
const STATUSES: TicketStatus[] = ["open", "in_progress", "resolved", "closed"];
const PRIORITIES: TicketPriority[] = ["low", "medium", "high", "urgent"];

export function PortalTicketFormDialog({ open, onOpenChange, ticket }: { open: boolean; onOpenChange: (o: boolean) => void; ticket?: PortalTicket }) {
  const save = useSavePortalTicket();
  const [form, setForm] = useState<Partial<PortalTicket>>({});

  useEffect(() => {
    if (open) {
      setForm(
        ticket ?? {
          requesterRef: "",
          requesterName: "",
          category: "technical",
          subject: "",
          description: "",
          status: "open",
          priority: "medium",
        }
      );
    }
  }, [open, ticket]);

  const set = (patch: Partial<PortalTicket>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.requesterRef || !form.requesterName || !form.category || !form.subject || !form.status || !form.priority) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: ticket?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: ticket?.createdOn ?? now,
        updatedOn: now,
        requesterRef: form.requesterRef!,
        requesterName: form.requesterName!,
        category: form.category!,
        subject: form.subject!,
        description: form.description || undefined,
        status: form.status!,
        priority: form.priority!,
      } as PortalTicket,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ticket ? `Edit ticket — ${ticket.subject}` : "Create portal ticket"}</DialogTitle>
          <DialogDescription>Self-service support request (M11.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Requester Ref</Label>
            <Input placeholder="e.g. usr-020" value={form.requesterRef ?? ""} onChange={(e) => set({ requesterRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Requester Name</Label>
            <Input placeholder="e.g. Sita Sharma" value={form.requesterName ?? ""} onChange={(e) => set({ requesterName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set({ category: v as Category })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={(v) => set({ priority: v as TicketPriority })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Subject</Label>
            <Input placeholder="e.g. Cannot access report card" value={form.subject ?? ""} onChange={(e) => set({ subject: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as TicketStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description (optional)</Label>
            <Textarea placeholder="Detailed description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.requesterRef || !form.requesterName || !form.category || !form.subject || !form.status || !form.priority}>
            <Plus className="h-4 w-4" /> {ticket ? "Save changes" : "Create ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
