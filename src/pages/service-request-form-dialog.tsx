import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveServiceRequest } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ServiceRequest } from "@/lib/types";

const CATEGORIES = ["plumbing", "electrical", "carpentry", "hvac", "cleaning", "pest_control", "landscaping", "it_support", "other"] as const;
const PRIORITIES = ["low", "medium", "high", "urgent"] as const;
const STATUSES = ["open", "assigned", "in_progress", "resolved", "closed", "cancelled"] as const;

export function ServiceRequestFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: ServiceRequest }) {
  const save = useSaveServiceRequest();
  const [form, setForm] = useState<Partial<ServiceRequest>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          title: "", category: "other", priority: "medium",
          location: "", requestedBy: "", description: "",
          status: "open",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<ServiceRequest>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.title || !form.category || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: editing?.id ?? uid(),
        createdOn: editing?.createdOn ?? now,
        title: form.title!,
        category: form.category!,
        priority: form.priority || "medium",
        location: form.location || "",
        requestedBy: form.requestedBy || "",
        requestedByName: form.requestedByName || form.requestedBy || "",
        assignedTo: editing?.assignedTo || "",
        assignedToName: editing?.assignedToName || "",
        roomRef: editing?.roomRef || "",
        description: form.description || "",
        status: form.status!,
        reportedOn: editing?.reportedOn || now,
        resolvedOn: editing?.resolvedOn || "",
      } as ServiceRequest,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Service Request" : "Create Service Request"}</DialogTitle>
          <DialogDescription>Log a facilities or IT service request (M22.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input placeholder="Brief title" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set({ category: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={(v) => set({ priority: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input placeholder="Room / Building" value={form.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Reported By</Label>
            <Input placeholder="Name of reporter" value={form.requestedBy ?? ""} onChange={(e) => set({ requestedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the issue…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.title || !form.category || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
