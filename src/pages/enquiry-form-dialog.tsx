import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveEnquiry, useGradeClasses } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { Enquiry, EnquirySource, EnquiryStatus } from "@/lib/types";

const SOURCES: EnquirySource[] = ["web", "walk_in", "referral", "agent", "fair", "social", "campaign"];
const STATUSES: EnquiryStatus[] = ["new", "contacted", "interested", "visit_scheduled", "applied", "converted", "lost"];

export function EnquiryFormDialog({ open, onOpenChange, enquiry }: { open: boolean; onOpenChange: (o: boolean) => void; enquiry?: Enquiry }) {
  const save = useSaveEnquiry();
  const grades = useGradeClasses();
  const [form, setForm] = useState<Partial<Enquiry>>({});

  useEffect(() => {
    if (open) {
      setForm(enquiry ?? { studentName: "", studentNameNe: "", guardianName: "", guardianPhone: "", guardianEmail: "", address: "", interestedGradeId: "", interestedGradeName: "", source: "walk_in", status: "new", assignedToName: "", notes: "", createdOn: todayISO() });
    }
  }, [open, enquiry]);

  const set = (patch: Partial<Enquiry>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName || !form.guardianName || !form.guardianPhone || !form.interestedGradeId) return;
    const gradeName = (grades.data ?? []).find((g) => g.id === form.interestedGradeId)?.name ?? form.interestedGradeName ?? "";
    save.mutate(
      { ...(enquiry ?? { id: uid() }), ...form, interestedGradeName: gradeName, tenantId: "tenant-default" } as Enquiry,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{enquiry ? `Edit enquiry — ${enquiry.studentName}` : "Create enquiry"}</DialogTitle>
          <DialogDescription>Record a new student enquiry or lead (M04.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student name</Label>
            <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.studentNameNe ?? ""} onChange={(e) => set({ studentNameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Guardian name</Label>
            <Input placeholder="Guardian name" value={form.guardianName ?? ""} onChange={(e) => set({ guardianName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Guardian phone</Label>
            <Input placeholder="Phone number" value={form.guardianPhone ?? ""} onChange={(e) => set({ guardianPhone: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Guardian email</Label>
            <Input type="email" placeholder="Email (optional)" value={form.guardianEmail ?? ""} onChange={(e) => set({ guardianEmail: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Interested grade</Label>
            <Select value={form.interestedGradeId} onValueChange={(v) => set({ interestedGradeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
              <SelectContent>{(grades.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Source</Label>
            <Select value={form.source} onValueChange={(v) => set({ source: v as EnquirySource })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SOURCES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as EnquiryStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Assigned to</Label>
            <Input placeholder="Staff name" value={form.assignedToName ?? ""} onChange={(e) => set({ assignedToName: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Address</Label>
            <Input placeholder="Address" value={form.address ?? ""} onChange={(e) => set({ address: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes…" value={form.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentName || !form.guardianName || !form.guardianPhone || !form.interestedGradeId}>
            <Plus className="h-4 w-4" /> {enquiry ? "Save changes" : "Create enquiry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
