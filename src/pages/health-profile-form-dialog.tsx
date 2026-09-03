import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveHealthProfile, useSaveClinicVisit } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { HealthProfile, ClinicVisit } from "@/lib/types";

const HEALTH_STATUSES = ["active", "inactive", "archived"] as const;
const VISIT_STATUSES = ["open", "closed", "referred"] as const;
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function HealthProfileFormDialog({ open, onOpenChange, healthProfile, clinicVisit }: { open: boolean; onOpenChange: (o: boolean) => void; healthProfile?: HealthProfile; clinicVisit?: ClinicVisit }) {
  const saveProfile = useSaveHealthProfile();
  const saveVisit = useSaveClinicVisit();
  const isVisit = !!clinicVisit;
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (open) {
      if (clinicVisit) {
        setForm(clinicVisit);
      } else if (healthProfile) {
        setForm(healthProfile);
      } else {
        setForm({
          studentName: "", studentRef: "", allergies: "", conditions: "",
          medications: "", emergencyContact: "", bloodGroup: "", sensitivity: "",
          status: "active",
        });
      }
    }
  }, [open, healthProfile, clinicVisit]);

  const set = (patch: Record<string, any>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName) return;
    const now = new Date().toISOString();
    if (isVisit) {
      saveVisit.mutate(
        {
          id: clinicVisit?.id ?? uid(),
          createdOn: clinicVisit?.createdOn ?? now,
          studentName: form.studentName!,
          studentRef: form.studentRef || "",
          visitDate: (form as any).visitDate || now.slice(0, 10),
          practitioner: (form as any).practitioner || "",
          reason: (form as any).reason || "",
          diagnosis: (form as any).diagnosis || "",
          treatment: (form as any).treatment || "",
          followUp: (form as any).followUp || "",
          status: (form as any).status || "open",
        } as ClinicVisit,
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      saveProfile.mutate(
        {
          id: healthProfile?.id ?? uid(),
          createdOn: healthProfile?.createdOn ?? now,
          studentName: form.studentName!,
          studentRef: form.studentRef || "",
          allergies: form.allergies || "",
          conditions: form.conditions || "",
          medications: form.medications || "",
          emergencyContact: form.emergencyContact || "",
          bloodGroup: form.bloodGroup || "",
          sensitivity: form.sensitivity || "",
          status: form.status || "active",
        } as HealthProfile,
        { onSuccess: () => onOpenChange(false) }
      );
    }
  };

  const savePending = isVisit ? saveVisit.isPending : saveProfile.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isVisit ? (clinicVisit ? `Edit clinic visit — ${clinicVisit.studentName}` : "Create clinic visit") : (healthProfile ? `Edit health profile — ${healthProfile.studentName}` : "Create health profile")}</DialogTitle>
          <DialogDescription>{isVisit ? "Record a student clinic visit (M19.01)." : "Maintain student health profile with allergies, conditions and medications (M19.01)."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student Name</Label>
            <Input placeholder="Full name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student Ref</Label>
            <Input placeholder="e.g. STU-001" value={form.studentRef ?? ""} onChange={(e) => set({ studentRef: e.target.value })} />
          </div>
          {isVisit ? (
            <>
              <div className="space-y-1.5">
                <Label>Visit Date</Label>
                <Input type="date" value={(form as any).visitDate ?? ""} onChange={(e) => set({ visitDate: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Practitioner</Label>
                <Input placeholder="Doctor / Nurse name" value={(form as any).practitioner ?? ""} onChange={(e) => set({ practitioner: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Reason</Label>
                <Input placeholder="Reason for visit" value={(form as any).reason ?? ""} onChange={(e) => set({ reason: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Diagnosis</Label>
                <Textarea placeholder="Diagnosis notes…" value={(form as any).diagnosis ?? ""} onChange={(e) => set({ diagnosis: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Treatment</Label>
                <Textarea placeholder="Treatment provided…" value={(form as any).treatment ?? ""} onChange={(e) => set({ treatment: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Follow-up</Label>
                <Input placeholder="Follow-up date or notes" value={(form as any).followUp ?? ""} onChange={(e) => set({ followUp: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={(form as any).status} onValueChange={(v) => set({ status: v } as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{VISIT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label>Blood Group</Label>
                <Select value={form.bloodGroup ?? ""} onValueChange={(v) => set({ bloodGroup: v })}>
                  <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
                  <SelectContent>{BLOOD_GROUPS.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{HEALTH_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Allergies</Label>
                <Textarea placeholder="Known allergies…" value={form.allergies ?? ""} onChange={(e) => set({ allergies: e.target.value })} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Conditions</Label>
                <Textarea placeholder="Medical conditions…" value={form.conditions ?? ""} onChange={(e) => set({ conditions: e.target.value })} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Medications</Label>
                <Textarea placeholder="Current medications…" value={form.medications ?? ""} onChange={(e) => set({ medications: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Emergency Contact</Label>
                <Input placeholder="Phone / Name" value={form.emergencyContact ?? ""} onChange={(e) => set({ emergencyContact: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Sensitivity / Notes</Label>
                <Input placeholder="Any sensitivity notes" value={form.sensitivity ?? ""} onChange={(e) => set({ sensitivity: e.target.value })} />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={savePending || !form.studentName}>
            <Plus className="h-4 w-4" /> {isVisit ? (clinicVisit ? "Save changes" : "Create visit") : (healthProfile ? "Save changes" : "Create profile")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
