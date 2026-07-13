import { prisma } from "@/lib/prisma";
import { deleteHall } from "@/actions/admin";
import { HallForm } from "./hall-form";

export default async function AdminHallsPage() {
  const halls = await prisma.cinemaHall.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { seats: true, showtimes: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Cinema Halls</h1>

      <HallForm />

      <div className="flex flex-col gap-2">
        {halls.map((hall) => (
          <div
            key={hall.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{hall.name}</p>
              <p className="text-sm text-gray-500">
                {hall.rows} rows × {hall.columns} columns ·{" "}
                {hall._count.seats} seats · {hall._count.showtimes} showtimes
              </p>
            </div>
            <form action={deleteHall}>
              <input type="hidden" name="hallId" value={hall.id} />
              <button type="submit" className="text-red-600 underline text-sm">
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
