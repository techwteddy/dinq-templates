import LiveDashboard from "@/components/dashboard/live-dashboard"

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#07090d]">
      <LiveDashboard />
    </main>
  )
}
