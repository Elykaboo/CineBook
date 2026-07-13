"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type BookingFormState = {
  error?: string;
};

export async function createBooking(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to book seats." };
  }

  const showtimeId = formData.get("showtimeId");
  const seatIds = formData.getAll("seatIds").map(String);

  if (typeof showtimeId !== "string" || !showtimeId) {
    return { error: "Missing showtime." };
  }
  if (seatIds.length === 0) {
    return { error: "Select at least one seat." };
  }

  const showtime = await prisma.showtime.findUnique({
    where: { id: showtimeId },
  });
  if (!showtime) {
    return { error: "Showtime not found." };
  }

  const totalPrice = showtime.price.toNumber() * seatIds.length;

  let bookingId: string;
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          userId: session.user.id,
          showtimeId,
          totalPrice,
          status: "CONFIRMED",
        },
      });

      await tx.bookingSeat.createMany({
        data: seatIds.map((seatId) => ({
          bookingId: created.id,
          seatId,
          showtimeId,
        })),
      });

      return created;
    });
    bookingId = booking.id;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error:
          "One or more selected seats were just booked by someone else. Please choose different seats.",
      };
    }
    throw error;
  }

  redirect(`/bookings/${bookingId}`);
}
