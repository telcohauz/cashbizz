import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderModule } from "@/components/PlaceholderModule";
export const Route = createFileRoute("/_authenticated/staff")({
  component: () => <PlaceholderModule title="Staff Management" description="Employee directory, roles, attendance and leave." points={["Profiles, roles & departments", "Attendance & leave tracking", "Performance notes and documents"]} />,
});
