import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { School, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_PROFILES, type UserRole } from "@/lib/role-permissions";

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-indigo-500",
  principal: "bg-violet-500",
  accountant: "bg-emerald-500",
  teacher: "bg-amber-500",
  student: "bg-sky-500",
  parent: "bg-rose-500",
};

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const profile = ROLE_PROFILES.find((r) => r.id === selectedRole)!;
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState("demo-prototype");

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(ROLE_PROFILES.find((r) => r.id === role)!.email);
  };

  const signIn = (e?: React.FormEvent) => {
    e?.preventDefault();
    localStorage.setItem(
      "m01-session",
      JSON.stringify({ name: profile.label, role: profile.id, initials: profile.initials })
    );
    navigate("/", { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sidebar p-4">
      {/* decorative glows */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-violet-500/15 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Brand side */}
        <div className="hidden flex-col justify-center lg:flex">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 p-2.5 text-white shadow-xl shadow-indigo-500/30">
              <School className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Shikshya ERP</h1>
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Nepal School Platform</p>
            </div>
          </div>
          <h2 className="mt-8 text-3xl font-bold leading-snug text-white">
            Modules 1–17 — Full Prototype
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              with ABAC Role-Based Access
            </span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            Each role sees only the screens they need. Pick a persona below to
            experience the ERP from different perspectives — admin, principal,
            accountant, teacher, student, or parent.
          </p>
        </div>

        {/* Form side */}
        <Card className="border-white/10 bg-card/95 shadow-2xl backdrop-blur animate-fade-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Pick a role persona. Navigation adapts to each role.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Role selector grid */}
            <div className="grid grid-cols-3 gap-2">
              {ROLE_PROFILES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => selectRole(r.id)}
                  className={`flex h-20 flex-col items-center justify-center gap-1 rounded-lg border p-2 text-center transition-all ${
                    selectedRole === r.id
                      ? "border-primary bg-accent ring-1 ring-primary"
                      : "border-border hover:bg-muted/60"
                  }`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${ROLE_COLORS[r.id]}`}>
                    {r.initials}
                  </span>
                  <span className="text-[11px] font-medium leading-tight">{r.label}</span>
                </button>
              ))}
            </div>

            {/* Role description */}
            <div className="rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              {profile.description}
            </div>

            <form onSubmit={signIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    className="pl-8"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-8"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Sign in as {profile.label} <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
