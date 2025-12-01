import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminReviewsContent } from "./AdminReviewsContent";

export default async function AdminReviewsPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminReviewsContent admin={admin} />;
}





