import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/PlaceholderModule";
export const Route = createFileRoute("/_authenticated/admin")({
  component: () => <PlaceholderModule title="Admin Panel" description="Super-admin tools for tenants, users and rules." points={["Manage companies and users", "Country rules & compliance DB", "Grant database · System logs"]} />,
});
