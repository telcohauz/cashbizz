import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useActiveCompany } from "@/hooks/useActiveCompany";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp, ShieldCheck, Users, AlertTriangle, Sparkles } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — BusinessHQ" }] }),
  component: DashboardPage,
});

const revenueData = [
  { m: "Jan", revenue: 24000, expenses: 18000 },
  { m: "Feb", revenue: 28000, expenses: 19500 },
  { m: "Mar", revenue: 31000, expenses: 21000 },
  { m: "Apr", revenue: 29500, expenses: 20800 },
  { m: "May", revenue: 36000, expenses: 22400 },
  { m: "Jun", revenue: 42000, expenses: 24100 },
];

const payrollData = [
  { dep: "Eng", v: 32 },
  { dep: "Ops", v: 18 },
  { dep: "Sales", v: 24 },
  { dep: "Admin", v: 9 },
];

function DashboardPage() {
  const { company, isLoading } = useActiveCompany();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !company) navigate({ to: "/onboarding", replace: true });
  }, [isLoading, company, navigate]);

  if (isLoading || !company) {
    return (
      <AppShell title="Dashboard">
        <div className="text-sm text-muted-foreground">Loading workspace…</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Here's how {company.name} is doing this month.</p>
          </div>
          <Link to="/ai-advisor">
            <Button className="gap-2"><Sparkles className="h-4 w-4" /> Ask AI Advisor</Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Health Score" value="82" tone="primary" sub="+4 vs last month" progress={82} />
          <KpiCard title="Compliance" value="91%" tone="success" sub="2 deadlines this week" progress={91} icon={ShieldCheck} />
          <KpiCard title="Monthly Revenue" value="RM 42,000" tone="primary" sub="+16.7% MoM" icon={TrendingUp} />
          <KpiCard title="Active Staff" value="24" tone="accent" sub="3 on leave" icon={Users} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Revenue vs Expenses</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.16 195)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.72 0.16 195)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.20 280)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.55 0.20 280)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.72 0.16 195)" fill="url(#g1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" stroke="oklch(0.55 0.20 280)" fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Payroll by Dept</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="dep" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Bar dataKey="v" fill="oklch(0.72 0.16 195)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent activity</CardTitle>
              <Badge variant="secondary">Live</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { t: "EPF contribution submitted for June payroll", who: "Payroll", time: "2h ago" },
                { t: "Business license renewed (DBKL F&B)", who: "Compliance", time: "Today" },
                { t: "New invoice INV-2026-018 sent to client", who: "Finance", time: "Yesterday" },
                { t: "Hired Aisha Tan as Marketing Lead", who: "HR", time: "2 days ago" },
              ].map((a, i) => (
                <div key={i} className="flex items-start justify-between text-sm border-b border-border last:border-0 pb-3 last:pb-0">
                  <div>
                    <div>{a.t}</div>
                    <div className="text-xs text-muted-foreground">{a.who}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">AI Insights</CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Insight icon={AlertTriangle} tone="warn" title="SST filing due in 6 days" body="Your SST-02 form for Q2 must be submitted by the end of the month." />
              <Insight icon={TrendingUp} tone="ok" title="Cashflow trending up" body="Revenue grew 16.7% MoM. Consider reinvesting in marketing." />
              <Insight icon={ArrowUpRight} tone="info" title="Grant match found" body="You may qualify for SME Corp's Business Accelerator Programme." />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function KpiCard({ title, value, sub, progress, icon: Icon, tone = "primary" }: { title: string; value: string; sub?: string; progress?: number; icon?: any; tone?: "primary" | "success" | "accent" }) {
  const grad = tone === "success" ? "var(--gradient-success)" : tone === "accent" ? "var(--gradient-warn)" : "var(--gradient-primary)";
  return (
    <Card className="overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: grad }} />
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">{title}</div>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
        {progress !== undefined && <Progress value={progress} className="mt-3 h-1.5" />}
      </CardContent>
    </Card>
  );
}

function Insight({ icon: Icon, title, body, tone }: { icon: any; title: string; body: string; tone: "warn" | "ok" | "info" }) {
  const color = tone === "warn" ? "text-warning" : tone === "ok" ? "text-success" : "text-primary";
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-2 font-medium">
        <Icon className={`h-4 w-4 ${color}`} />
        <span>{title}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{body}</div>
    </div>
  );
}
