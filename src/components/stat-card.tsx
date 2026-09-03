import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; up?: boolean };
  progress?: { value: number; label: string };
  className?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, progress, className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden animate-fade-up", className)}>
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <p className={cn("mt-1 text-xs font-medium", trend.up ? "text-emerald-600" : "text-muted-foreground")}>
            {trend.up ? "▲ " : ""}{trend.value}
          </p>
        )}
        {subtitle && !trend && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        {progress && (
          <div className="mt-3 space-y-1.5">
            <Progress value={progress.value} />
            <p className="text-xs text-muted-foreground">{progress.label}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
