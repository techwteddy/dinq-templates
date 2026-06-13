import { getReservations } from "@/app/actions/reservations";
import { getDashboardStats, getTodaysDepartures } from "@/app/actions/dashboard-stats";
import Calendar from "./Calendar";
import KPICards from "./KPICards";
import DepartingToday from "./DepartingToday";
import FleetHealth from "./FleetHealth";
import LowStockAlert from "./LowStockAlert";
import { DashboardHeader } from "./DashboardHeader";

export default async function DashboardPage() {
  const [reservations, stats, todaysDepartures] = await Promise.all([
    getReservations(),
    getDashboardStats(),
    getTodaysDepartures(),
  ]);

  return (
    <div className="space-y-6">
      {/* Professional Header with Actions */}
      <DashboardHeader />

      {/* KPI Cards - Top Row */}
      <KPICards
        vehicleStats={{
          available: stats.vehicleStats.available,
          total: stats.vehicleStats.total,
        }}
        driverStats={{
          available: stats.driverStats.available,
          total: stats.driverStats.total,
        }}
        activeTripsCount={stats.activeTripsCount}
        lowStockCount={stats.lowStockCount}
      />

      {/* Main Content: Calendar + Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <Calendar reservations={reservations} />
        </div>

        {/* Side Panel - Takes 1 column */}
        <div className="space-y-6">
          {/* Departing Today */}
          <DepartingToday departures={todaysDepartures} />

          {/* Fleet Health */}
          <FleetHealth vehicleStats={stats.vehicleStats} />

          {/* Low Stock Alert */}
          <LowStockAlert lowStockItems={stats.lowStockItems} />
        </div>
      </div>
    </div>
  );
}

