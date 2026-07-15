import { Film, Grid3x3, CalendarClock, TicketCheck, Receipt } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [movieCount, hallCount, showtimeCount, bookingsToday, totalBookings] =
    await Promise.all([
      prisma.movie.count(),
      prisma.cinemaHall.count(),
      prisma.showtime.count(),
      prisma.booking.count({
        where: { createdAt: { gte: startOfToday, lt: endOfToday } },
      }),
      prisma.booking.count({ where: { status: { not: "CANCELLED" } } }),
    ]);

  const stats: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Total movies", value: movieCount, icon: Film },
    { label: "Cinema halls", value: hallCount, icon: Grid3x3 },
    { label: "Showtimes", value: showtimeCount, icon: CalendarClock },
    { label: "Bookings today", value: bookingsToday, icon: TicketCheck },
    { label: "Active bookings", value: totalBookings, icon: Receipt },
  ];

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-fg-1">Admin overview</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-3 rounded-panel border border-border-1 bg-surface-1 p-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-chip bg-surface-brand-subtle">
              <stat.icon className="h-4 w-4 text-teal-700" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-serif text-2xl text-fg-1">{stat.value}</p>
              <p className="text-sm text-fg-2">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
