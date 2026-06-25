import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () => ({ meta: [{ title: "Setup — BusinessHQ" }] }),
  component: Onboarding,
});

const countries = [
  { v: "MY", n: "Malaysia 🇲🇾" },
  { v: "SG", n: "Singapore 🇸🇬" },
  { v: "US", n: "United States 🇺🇸" },
  { v: "UK", n: "United Kingdom 🇬🇧" },
  { v: "AU", n: "Australia 🇦🇺" },
  { v: "IN", n: "India 🇮🇳" },
  { v: "JP", n: "Japan 🇯🇵" },
  { v: "DE", n: "Germany 🇩🇪" },
  { v: "CA", n: "Canada 🇨🇦" },
];

function Onboarding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("MY");
  const [businessType, setBusinessType] = useState("Sdn Bhd");
  const [name, setName] = useState("");
  const [reg, setReg] = useState("");
  const [tax, setTax] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  const steps = ["Country", "Business", "Company", "Tax", "Done"];

  const submit = async () => {
    if (!user) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("companies")
      .insert({ name, country, business_type: businessType, registration_no: reg || null, tax_id: tax || null, owner_id: user.id })
      .select()
      .single();
    setBusy(false);
    if (error) return toast.error(error.message);
    await supabase.from("profiles").update({ active_company_id: data!.id }).eq("id", user.id);
    await qc.invalidateQueries({ queryKey: ["companies"] });
    toast.success("Company created");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${i <= step ? "text-primary-foreground" : "bg-muted text-muted-foreground"}`} style={i <= step ? { background: "var(--gradient-primary)" } : undefined}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elevated)]">
          <h1 className="text-xl font-semibold">{step === 4 ? "All set!" : `Step ${step + 1}: ${steps[step]}`}</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-5">
            {step === 0 && "Pick the country your business is registered in."}
            {step === 1 && "What kind of business is this?"}
            {step === 2 && "Add your company details."}
            {step === 3 && "Optional — add tax registration info."}
            {step === 4 && "Review and create your workspace."}
          </p>

          {step === 0 && (
            <div>
              <Label>Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{countries.map((c) => <SelectItem key={c.v} value={c.v}>{c.n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          {step === 1 && (
            <div>
              <Label>Business type</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Sdn Bhd", "Enterprise / Sole Proprietor", "Partnership", "LLP", "Public Ltd", "Other"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <div><Label>Company name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Sdn Bhd" /></div>
              <div><Label>Registration number</Label><Input value={reg} onChange={(e) => setReg(e.target.value)} placeholder="202301012345" /></div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <div><Label>Tax ID / LHDN No</Label><Input value={tax} onChange={(e) => setTax(e.target.value)} placeholder="C2584521234" /></div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-2 text-sm">
              <Row k="Country" v={country} />
              <Row k="Business type" v={businessType} />
              <Row k="Company" v={name || "—"} />
              <Row k="Registration" v={reg || "—"} />
              <Row k="Tax ID" v={tax || "—"} />
            </div>
          )}

          <div className="mt-6 flex justify-between gap-2">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
            {step < 4 ? (
              <Button disabled={step === 2 && !name.trim()} onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button onClick={submit} disabled={busy || !name.trim()}>{busy ? "Creating…" : "Create workspace"}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border last:border-0 py-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
