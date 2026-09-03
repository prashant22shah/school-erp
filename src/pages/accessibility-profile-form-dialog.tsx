import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveAccessibilityProfile } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { AccessibilityProfile } from "@/lib/types";

type Theme = AccessibilityProfile["theme"];
const THEMES: Theme[] = ["light", "dark", "high_contrast"];

export function AccessibilityProfileFormDialog({ open, onOpenChange, profile }: { open: boolean; onOpenChange: (o: boolean) => void; profile?: AccessibilityProfile }) {
  const save = useSaveAccessibilityProfile();
  const [form, setForm] = useState<Partial<AccessibilityProfile>>({});

  useEffect(() => {
    if (open) {
      setForm(
        profile ?? {
          userRef: "",
          userName: "",
          theme: "light",
          fontScale: 1,
          language: "en",
        }
      );
    }
  }, [open, profile]);

  const set = (patch: Partial<AccessibilityProfile>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.userRef || !form.userName || !form.theme || form.fontScale == null || !form.language) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: profile?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: profile?.createdOn ?? now,
        updatedOn: now,
        userRef: form.userRef!,
        userName: form.userName!,
        theme: form.theme!,
        fontScale: Number(form.fontScale),
        language: form.language!,
      } as AccessibilityProfile,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{profile ? `Edit profile — ${profile.userName}` : "Create accessibility profile"}</DialogTitle>
          <DialogDescription>Accessibility preferences per user (M11.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>User Ref</Label>
            <Input placeholder="e.g. usr-015" value={form.userRef ?? ""} onChange={(e) => set({ userRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>User Name</Label>
            <Input placeholder="e.g. Bishal Thapa" value={form.userName ?? ""} onChange={(e) => set({ userName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Theme</Label>
            <Select value={form.theme} onValueChange={(v) => set({ theme: v as Theme })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{THEMES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Font Scale</Label>
            <Input type="number" min={0.5} max={3} step={0.1} value={form.fontScale ?? 1} onChange={(e) => set({ fontScale: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Language</Label>
            <Input placeholder="e.g. en, ne, both" value={form.language ?? ""} onChange={(e) => set({ language: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.userRef || !form.userName || !form.theme || form.fontScale == null || !form.language}>
            <Plus className="h-4 w-4" /> {profile ? "Save changes" : "Create profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
