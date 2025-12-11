import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminPendingProfessionalsContent } from "./AdminPendingProfessionalsContent";

export const dynamic = 'force-dynamic';

export default async function AdminPendingProfessionalsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminPendingProfessionalsContent admin={admin} />;
}
