import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminUsersContent } from "./AdminUsersContent";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminUsersContent admin={admin} />;
}
