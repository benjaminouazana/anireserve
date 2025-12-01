import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminDashboardContent } from "./AdminDashboardContent";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminDashboardContent admin={admin} />;
}





