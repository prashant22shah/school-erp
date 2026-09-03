import { useMemo, useState } from "react";
import { KeyRound, Search, Shield, Globe, Monitor, Smartphone, Clock, Ban, CheckCircle2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useAuthSessions, useAuthFactors, useRevokeAuthSession } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fmtDate } from "@/lib/utils";
import type { AuthProvider } from "@/lib/types";

const providerMap: Record<AuthProvider, { label: string; color: string }> = {
  local: { label: "Local", color: "bg-slate-100 text-slate-700" },
  google: { label: "Google", color: "bg-red-100 text-red-700" },
  microsoft: { label: "Microsoft", color: "bg-blue-100 text-blue-700" },
  sso: { label: "SSO", color: "bg-violet-100 text-violet-700" },
  saml: { label: "SAML", color: "bg-amber-100 text-amber-700" },
};

export default function AuthFederation() {
  const sessions = useAuthSessions();
  const factors = useAuthFactors();
  const revoke = useRevokeAuthSession();
  const [q, setQ] = useState("");

  const filteredSessions = useMemo(() => {
    let list = sessions.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((sess) => sess.userId.toLowerCase().includes(s) || sess.ip.includes(s) || sess.provider.includes(s));
    }
    return list;
  }, [sessions.data, q]);

  const activeSessions = (sessions.data ?? []).filter((s) => s.isActive).length;
  const revokedSessions = (sessions.data ?? []).filter((s) => !s.isActive).length;
  const mfaFactors = (factors.data ?? []).filter((f) => f.enabled).length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={KeyRound}
        title="Authentication & Federation"
        titleNe="प्रमाणीकरण तथा फेडरेसन"
        microModule="M02.02"
        description="Active sessions, authentication providers (local, Google, SSO, SAML), MFA factors and session lifecycle management."
      />

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active sessions</p><p className="text-lg font-bold">{activeSessions}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-600"><Ban className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Revoked / expired</p><p className="text-lg font-bold">{revokedSessions}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Shield className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">MFA factors enrolled</p><p className="text-lg font-bold">{mfaFactors}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Globe className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Auth providers</p><p className="text-lg font-bold">5</p></div>
        </CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Sessions table */}
        <Card className="lg:col-span-2 animate-fade-up">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Active & recent sessions</CardTitle>
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search…" className="pl-8 h-8 text-xs" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {sessions.isLoading ? <LoadingBlock /> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">User</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>IP / Device</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((s) => {
                    const prov = providerMap[s.provider];
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="pl-5">
                          <p className="text-sm font-medium">{s.userId}</p>
                          <p className="text-xs text-muted-foreground">Issued {fmtDate(s.issuedAt)}</p>
                        </TableCell>
                        <TableCell><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${prov.color}`}>{prov.label}</span></TableCell>
                        <TableCell>
                          <p className="text-sm">{s.ip}</p>
                          <p className="text-xs text-muted-foreground">{s.userAgent}</p>
                        </TableCell>
                        <TableCell>
                          {s.isActive ? (
                            <Badge variant="success"><span className="h-1.5 w-1.5 rounded-full bg-current" />Active</Badge>
                          ) : (
                            <Badge variant="secondary">Ended</Badge>
                          )}
                        </TableCell>
                        <TableCell className="pr-5 text-right">
                          {s.isActive && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => revoke.mutate(s)}>
                              <Ban className="h-3 w-3" /> Revoke
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* MFA Factors */}
        <Card className="animate-fade-up">
          <CardHeader><CardTitle className="text-base">MFA Factors</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(factors.data ?? []).map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${f.enabled ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                    {f.type === "totp" ? <Smartphone className="h-4 w-4" /> : f.type === "sms" ? <Monitor className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{f.label ?? f.type.toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">User {f.userId} · Enrolled {fmtDate(f.enrolledOn)}</p>
                  </div>
                </div>
                <Badge variant={f.enabled ? "success" : "secondary"}>{f.enabled ? "Active" : "Disabled"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
