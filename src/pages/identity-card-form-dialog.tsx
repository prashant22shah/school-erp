import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveIdentityCard, useStudents } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { IdentityCard, CardType } from "@/lib/types";

const CARD_TYPES: CardType[] = ["student_id", "library", "transport", "rfid"];
const STATUSES: IdentityCard["status"][] = ["active", "lost", "expired", "replaced"];

export function IdentityCardFormDialog({ open, onOpenChange, card }: { open: boolean; onOpenChange: (v: boolean) => void; card?: IdentityCard }) {
  const save = useSaveIdentityCard();
  const { data: students } = useStudents();
  const [form, setForm] = useState<Partial<IdentityCard>>({});

  useEffect(() => {
    if (open) {
      setForm(card ?? { cardType: "student_id" as CardType, status: "active" as const, issuedOn: todayISO(), validUntil: "", createdOn: todayISO() });
    }
  }, [open, card]);

  const set = (patch: Partial<IdentityCard>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentId || !form.cardType || !form.serial || !form.issuedOn || !form.validUntil || !form.status) return;
    const student = students?.find((s) => s.id === form.studentId);
    save.mutate(
      { ...(card ?? { id: uid() }), ...form, studentName: student?.personName ?? "", tenantId: "tenant-default" } as IdentityCard,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{card ? `Edit ID card — ${card.serial}` : "Create ID card"}</DialogTitle>
          <DialogDescription>Issue or update student identity card (M05.08).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentId ?? ""} onValueChange={(v) => set({ studentId: v })}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{students?.map((s) => <SelectItem key={s.id} value={s.id}>{s.personName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Card type</Label>
            <Select value={form.cardType} onValueChange={(v) => set({ cardType: v as CardType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CARD_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Serial</Label>
            <Input placeholder="Card serial number" value={form.serial ?? ""} onChange={(e) => set({ serial: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Issued on</Label>
            <Input type="date" value={form.issuedOn ?? ""} onChange={(e) => set({ issuedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Valid until</Label>
            <Input type="date" value={form.validUntil ?? ""} onChange={(e) => set({ validUntil: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as IdentityCard["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentId || !form.cardType || !form.serial || !form.issuedOn || !form.validUntil || !form.status}>
            <Plus className="h-4 w-4" /> {card ? "Save changes" : "Create card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
