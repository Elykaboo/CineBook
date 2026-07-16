import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteHall } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { HallForm } from "./hall-form";

export default async function AdminHallsPage() {
  const halls = await prisma.cinemaHall.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { seats: true, showtimes: true } } },
  });

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex flex-1 flex-col gap-3">
        <h1 className="font-serif text-2xl text-fg-1">Cinema halls</h1>

        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-1 text-left text-xs text-fg-3">
                <th className="px-4 py-3 font-medium">Hall</th>
                <th className="px-4 py-3 font-medium">Rows × cols</th>
                <th className="px-4 py-3 font-medium">Seats</th>
                <th className="px-4 py-3 font-medium">Showtimes</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {halls.map((hall) => (
                <tr key={hall.id} className="border-b border-border-1 last:border-0">
                  <td className="px-4 py-3 font-semibold text-fg-1">
                    {hall.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-fg-2">
                    {hall.rows} × {hall.columns}
                  </td>
                  <td className="px-4 py-3 font-mono text-fg-2">
                    {hall._count.seats}
                  </td>
                  <td className="px-4 py-3 font-mono text-fg-2">
                    {hall._count.showtimes}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteHall}>
                      <input type="hidden" name="hallId" value={hall.id} />
                      <button
                        type="submit"
                        className="flex h-8 w-8 items-center justify-center rounded-chip text-fg-2 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${hall.name}`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card className="h-fit w-full p-5 lg:w-96">
        <h2 className="mb-4 font-semibold text-fg-1">New hall</h2>
        <HallForm />
      </Card>
    </div>
  );
}
