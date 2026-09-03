import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { TenantStatus, CampusStatus, Environment, ConfigStatus, Edition } from "@/lib/types";

const tenantStatusMap: Record<TenantStatus, { label: string; variant: "success" | "warning" | "destructive" | "secondary" | "purple" | "info" }> = {
  active: { label: "Active", variant: "success" },
  trial: { label: "Trial", variant: "info" },
  suspended: { label: "Suspended", variant: "warning" },
  read_only: { label: "Read-only", variant: "purple" },
  archived: { label: "Archived", variant: "secondary" },
  terminated: { label: "Terminated", variant: "destructive" },
};

export function TenantStatusBadge({ status }: { status: TenantStatus }) {
  const s = tenantStatusMap[status];
  return (
    <Badge variant={s.variant} className="font-medium">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </Badge>
  );
}

const campusStatusMap: Record<CampusStatus, { label: string; variant: "success" | "warning" | "secondary" | "destructive" }> = {
  open: { label: "Open", variant: "success" },
  closing: { label: "Closing", variant: "warning" },
  closed: { label: "Closed", variant: "secondary" },
  archived: { label: "Archived", variant: "destructive" },
};

export function CampusStatusBadge({ status }: { status: CampusStatus }) {
  const s = campusStatusMap[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function EnvBadge({ env }: { env: Environment }) {
  const map: Record<Environment, { label: string; cls: string }> = {
    production: { label: "Production", cls: "border-transparent bg-primary/10 text-primary" },
    sandbox: { label: "Sandbox", cls: "border-transparent bg-amber-100 text-amber-700" },
    training: { label: "Training", cls: "border-transparent bg-sky-100 text-sky-700" },
  };
  return (
    <Badge variant="outline" className={cn("border-transparent", map[env].cls)}>
      {map[env].label}
    </Badge>
  );
}

const configStatusMap: Record<ConfigStatus, { label: string; variant: "secondary" | "info" | "success" | "destructive" }> = {
  draft: { label: "Draft", variant: "secondary" },
  in_review: { label: "In Review", variant: "info" },
  approved: { label: "Approved", variant: "success" },
  published: { label: "Published", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export function ConfigStatusBadge({ status }: { status: ConfigStatus }) {
  const s = configStatusMap[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function EditionBadge({ edition }: { edition: Edition }) {
  return <Badge variant="purple" className="capitalize">{edition}</Badge>;
}
