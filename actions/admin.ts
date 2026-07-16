"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { movieSchema, hallSchema, showtimeSchema } from "@/lib/validations/admin";

export type AdminFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/bookings");
  }
  return session;
}

// --- Movies ---

export async function createMovie(
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = movieSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.movie.create({ data: parsed.data });
  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  redirect("/admin/movies");
}

export async function updateMovie(
  movieId: string,
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = movieSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.movie.update({ where: { id: movieId }, data: parsed.data });
  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  revalidatePath(`/movies/${movieId}`);
  redirect("/admin/movies");
}

export async function deleteMovie(formData: FormData) {
  await requireAdmin();
  const movieId = formData.get("movieId");
  if (typeof movieId !== "string" || !movieId) return;

  await prisma.movie.delete({ where: { id: movieId } });
  revalidatePath("/admin/movies");
  revalidatePath("/movies");
}

// --- Cinema Halls ---

export async function createHall(
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = hallSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, rows, columns } = parsed.data;

  await prisma.$transaction(async (tx) => {
    const hall = await tx.cinemaHall.create({ data: { name, rows, columns } });
    const seats = [];
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        seats.push({
          hallId: hall.id,
          row,
          column,
          type: row >= rows - 1 ? ("PREMIUM" as const) : ("REGULAR" as const),
        });
      }
    }
    await tx.seat.createMany({ data: seats });
  });

  revalidatePath("/admin/halls");
  return {};
}

export async function updateHall(
  hallId: string,
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = hallSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, rows, columns } = parsed.data;

  const hall = await prisma.cinemaHall.findUnique({ where: { id: hallId } });
  if (!hall) {
    return { error: "This hall no longer exists." };
  }

  const dimensionsChanged = hall.rows !== rows || hall.columns !== columns;

  if (dimensionsChanged) {
    const bookedSeatCount = await prisma.bookingSeat.count({
      where: { seat: { hallId } },
    });
    if (bookedSeatCount > 0) {
      return {
        error:
          "Can't resize this hall — it already has seats attached to bookings. Rename it instead, or remove those bookings first.",
      };
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.cinemaHall.update({ where: { id: hallId }, data: { name, rows, columns } });

    if (dimensionsChanged) {
      await tx.seat.deleteMany({ where: { hallId } });
      const seats = [];
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          seats.push({
            hallId,
            row,
            column,
            type: row >= rows - 1 ? ("PREMIUM" as const) : ("REGULAR" as const),
          });
        }
      }
      await tx.seat.createMany({ data: seats });
    }
  });

  revalidatePath("/admin/halls");
  redirect("/admin/halls");
}

export async function deleteHall(formData: FormData) {
  await requireAdmin();
  const hallId = formData.get("hallId");
  if (typeof hallId !== "string" || !hallId) return;

  await prisma.cinemaHall.delete({ where: { id: hallId } });
  revalidatePath("/admin/halls");
}

// --- Showtimes ---

export async function createShowtime(
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = showtimeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.showtime.create({ data: parsed.data });
  revalidatePath("/admin/showtimes");
  redirect("/admin/showtimes");
}

export async function updateShowtime(
  showtimeId: string,
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = showtimeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const showtime = await prisma.showtime.findUnique({ where: { id: showtimeId } });
  if (!showtime) {
    return { error: "This showtime no longer exists." };
  }

  if (showtime.hallId !== parsed.data.hallId) {
    const bookingCount = await prisma.booking.count({
      where: { showtimeId, status: { not: "CANCELLED" } },
    });
    if (bookingCount > 0) {
      return {
        error:
          "Can't change the hall — this showtime already has active bookings tied to specific seats. Cancel those bookings first, or leave the hall as is.",
      };
    }
  }

  await prisma.showtime.update({ where: { id: showtimeId }, data: parsed.data });
  revalidatePath("/admin/showtimes");
  redirect("/admin/showtimes");
}

export async function deleteShowtime(formData: FormData) {
  await requireAdmin();
  const showtimeId = formData.get("showtimeId");
  if (typeof showtimeId !== "string" || !showtimeId) return;

  await prisma.showtime.delete({ where: { id: showtimeId } });
  revalidatePath("/admin/showtimes");
}

// --- Users ---

export async function promoteToAdmin(formData: FormData) {
  await requireAdmin();
  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role: "ADMIN" },
  });
  revalidatePath("/admin/users");
}

export async function demoteToUser(formData: FormData) {
  const session = await requireAdmin();
  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) return;
  if (userId === session.user.id) return; // can't revoke your own admin access

  await prisma.user.update({
    where: { id: userId },
    data: { role: "USER" },
  });
  revalidatePath("/admin/users");
}
