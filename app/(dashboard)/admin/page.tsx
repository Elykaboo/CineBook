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

  const stats = [
    { label: "Movies", value: movieCount },
    { label: "Cinema Halls", value: hallCount },
    { label: "Showtimes", value: showtimeCount },
    { label: "Bookings Today", value: bookingsToday },
    { label: "Active Bookings", value: totalBookings },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border rounded p-4">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
