import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminBookingsContent } from "./AdminBookingsContent";

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminBookingsContent admin={admin} />;
}
