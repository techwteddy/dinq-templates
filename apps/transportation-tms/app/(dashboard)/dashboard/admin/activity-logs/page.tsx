import { redirect } from "next/navigation";
import { getCurrentAdminUser } from "@/app/actions/admin-management";
import ActivityLogsClient from "./ActivityLogsClient";

export default async function ActivityLogsPage() {
  // Check if user is supervisor
  const currentUser = await getCurrentAdminUser();
  
  if (!currentUser || currentUser.role !== "supervisor") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Activity Logs
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View all system activities and user actions
        </p>
      </div>
      <ActivityLogsClient />
    </div>
  );
}


