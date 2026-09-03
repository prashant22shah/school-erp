import { useEffect, useState } from "react";
import {
  Landmark, Pencil, Plus, Building2, Trash2, MapPin, Phone, Mail, Globe,
  GraduationCap, Users, ScrollText, Network,
} from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CampusFormDialog } from "@/pages/campus-form-dialog";
import {
  useInstitution, useLegalEntities, useCampuses,
  useSaveInstitution, useSaveLegalEntity, useDeleteLegalEntity, useDeleteCampus,
} from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampusStatusBadge } from "@/components/status-badges";
import { uid, initials } from "@/lib/utils";
import type { Campus, Institution, LegalEntity } from "@/lib/types";

function InstitutionEditDialog({ open, onOpenChange, inst }: { open: boolean; onOpenChange: (o: boolean) => void; inst: Institution }) {
  const save = useSaveInstitution();
  const [form, setForm] = useState<Institution>(inst);
  useEffect(() => { if (open) setForm(inst); }, [open, inst]);
  const set = (patch: Partial<Institution>) => setForm((f) => ({ ...f, ...patch }));

  const fld = (label: string, key: keyof Institution, cls = "") => (
    <div className={`space-y-1.5 ${cls}`}>
      <Label>{label}</Label>
      <Input value={(form[key] as string) ?? ""} onChange={(e) => set({ [key]: e.target.value } as Partial<Institution>)} />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit institution profile</DialogTitle>
          <DialogDescription>Legal identity, recognition and affiliation records (M01.02.F1/F2).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {fld("Legal name", "legalName")}
          {fld("Display name", "name")}
          {fld("Nepali name", "nameNe", "font-nepali")}
          {fld("School type", "schoolType")}
          {fld("IEMIS code", "iemisCode")}
          {fld("Registration no.", "registrationNumber")}
          {fld("Recognition", "recognition", "sm:col-span-2")}
          {fld("Affiliation", "affiliation", "sm:col-span-2")}
          {fld("Governing body", "governingBody", "sm:col-span-2")}
          {fld("PAN", "pan")}
          {fld("Website", "website")}
          {fld("Email", "email")}
          {fld("Phone", "phone")}
          {fld("Province", "province")}
          {fld("District", "district")}
          {fld("Local level", "localLevel")}
          {fld("Ward no.", "ward")}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate(form, { onSuccess: () => onOpenChange(false) })} disabled={save.isPending}>
            <Pencil className="h-4 w-4" /> Save profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LegalEntityRow({ e }: { e: LegalEntity }) {
  const del = useDeleteLegalEntity();
  const typeLabel: Record<LegalEntity["type"], string> = {
    company: "Pvt. Company", trust: "Trust", community: "Community", government: "Government",
  };
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <ScrollText className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{e.name}</p>
          {e.isPrimary && <Badge variant="purple" className="text-[10px]">Primary</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">
          {typeLabel[e.type]} · PAN {e.pan} · Reg. {e.registrationNumber}
        </p>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => del.mutate(e)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function InstitutionPage() {
  const inst = useInstitution();
  const entities = useLegalEntities();
  const campuses = useCampuses();
  const saveEntity = useSaveLegalEntity();
  const delCampus = useDeleteCampus();

  const [editOpen, setEditOpen] = useState(false);
  const [campusDialog, setCampusDialog] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | undefined>();
  const [entityName, setEntityName] = useState("");

  if (inst.isLoading || campuses.isLoading) return <LoadingBlock />;
  const i = inst.data;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Landmark}
        title="Institution, Legal Entity & Campuses"
        titleNe="विद्यालय, कानुनी निकाय र क्याम्पस"
        microModule="M01.02"
        description="School identity, IEMIS & registration records, governing legal entities, and campus master with lifecycle."
        actions={<Button onClick={() => setCampusDialog(true)}><Plus className="h-4 w-4" /> Open new campus</Button>}
      />

      {i && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 animate-fade-up">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-lg font-extrabold text-white shadow-lg shadow-primary/25">
                  {initials(i.name)}
                </div>
                <div>
                  <CardTitle className="text-lg">{i.name}</CardTitle>
                  <CardDescription className="font-nepali text-sm">{i.nameNe}</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                <InfoRow icon={Globe} label="IEMIS" value={i.iemisCode} />
                <InfoRow icon={ScrollText} label="Registration" value={i.registrationNumber} />
                <InfoRow icon={GraduationCap} label="Affiliation" value={i.affiliation} />
                <InfoRow icon={Network} label="Governing body" value={i.governingBody} />
                <InfoRow icon={MapPin} label="Address" value={`${i.localLevel}, Wd-${i.ward}, ${i.district}, ${i.province}`} />
                <InfoRow icon={Phone} label="Phone" value={i.phone} />
                <InfoRow icon={Mail} label="Email" value={i.email} />
                <InfoRow icon={Users} label="Established (BS)" value={i.establishedOn} />
              </div>
              <Separator />
              <p className="text-center font-nepali text-sm italic text-muted-foreground">“{i.moto}”</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-up">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-4 w-4 text-primary" /> Legal entities</CardTitle>
              <CardDescription>Owning bodies recognized by law</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {(entities.data ?? []).map((e) => <LegalEntityRow key={e.id} e={e} />)}
              <div className="flex gap-2">
                <Input placeholder="New legal entity name…" value={entityName} onChange={(e) => setEntityName(e.target.value)} />
                <Button
                  variant="secondary" size="icon" className="shrink-0"
                  disabled={!entityName || saveEntity.isPending}
                  onClick={() => {
                    saveEntity.mutate(
                      { id: uid(), name: entityName, type: "company", pan: "-", registrationNumber: "-", address: i?.district ?? "", isPrimary: false },
                      { onSuccess: () => setEntityName("") }
                    );
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campus cards */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Campuses ({campuses.data?.length ?? 0})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(campuses.data ?? []).map((c) => (
            <Card key={c.id} className="group overflow-hidden animate-fade-up">
              <div className="h-1.5" style={{ backgroundColor: c.brandingColor }} />
              <CardHeader className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base leading-tight">{c.name}</CardTitle>
                    <CardDescription className="font-nepali text-xs">{c.nameNe}</CardDescription>
                  </div>
                  <CampusStatusBadge status={c.status} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">{c.code}</Badge>
                  <Badge variant="secondary" className="text-[10px]">{c.type === "main" ? "Main campus" : "Branch"}</Badge>
                  <Badge variant="outline" className="text-[10px]">{c.gradeFrom} – {c.gradeTo}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" /> {c.address}, {c.localLevel} Wd-{c.ward}, {c.district}</p>
                  <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0" /> {c.phone}</p>
                  <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0" /> {c.email}</p>
                  <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 shrink-0" /> {c.studentCount} students · Head: {c.head}</p>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingCampus(c); setCampusDialog(true); }}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => delCampus.mutate(c)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <InstitutionEditDialog open={editOpen} onOpenChange={setEditOpen} inst={i!} />
      <CampusFormDialog open={campusDialog} onOpenChange={setCampusDialog} campus={editingCampus} />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 rounded-md bg-muted p-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm">{value}</p>
      </div>
    </div>
  );
}

