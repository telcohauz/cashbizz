import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/PlaceholderModule";
export const Route = createFileRoute("/_authenticated/payroll")({
  component: () => <PlaceholderModule title="Payroll" description="Multi-country payroll engine." points={["MY: EPF, SOCSO, EIS, PCB", "SG: CPF · UK: PAYE · US: Federal tax", "Auto calculation per country rules"]} />,
});
