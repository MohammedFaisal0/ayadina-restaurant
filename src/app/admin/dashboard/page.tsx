import { redirect } from "next/navigation";
import { routes } from "@/lib/paths";

export default function AdminDashboardPage() {
  redirect(routes.adminSettings);
}
