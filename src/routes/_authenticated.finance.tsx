import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/PlaceholderModule";
export const Route = createFileRoute("/_authenticated/finance")({
  component: () => <PlaceholderModule title="Finance" description="Income, expenses, invoices and cashflow." points={["Income & expense tracking", "Invoice and quotation generator", "Cashflow dashboard & reconciliation"]} />,
});
