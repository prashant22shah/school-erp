import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  titleNe?: string;
  description: string;
  microModule?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export function PageHeader({ title, titleNe, description, microModule, icon: Icon, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between animate-fade-up">
      <div className="flex items-start gap-3.5">
        {Icon && (
          <div className="mt-0.5 rounded-xl bg-gradient-to-br from-primary to-violet-500 p-2.5 text-white shadow-lg shadow-primary/25">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            {titleNe && <span className="font-nepali text-sm text-muted-foreground">{titleNe}</span>}
            {microModule && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground">
                {microModule}
              </span>
            )}
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function LoadingBlock({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-14 w-full animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}
