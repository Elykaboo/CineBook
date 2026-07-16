import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateHall } from "@/actions/admin";
import { Card } from "@/components/ui/card";
import { HallForm } from "../../hall-form";

export default async function EditHallPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hall = await prisma.cinemaHall.findUnique({ where: { id } });
  if (!hall) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-serif text-2xl text-fg-1">Edit hall</h1>
      <Card className="w-full max-w-lg p-5">
        <HallForm
          action={updateHall.bind(null, hall.id)}
          defaultValues={hall}
          submitLabel="Save changes"
        />
      </Card>
    </div>
  );
}
