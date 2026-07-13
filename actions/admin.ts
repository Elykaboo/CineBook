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

  const movie = await prisma.movie.create({ data: parsed.data });
  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  redirect(`/admin/movies?created=${movie.id}`);
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

export async function deleteShowtime(formData: FormData) {
  await requireAdmin();
  const showtimeId = formData.get("showtimeId");
  if (typeof showtimeId !== "string" || !showtimeId) return;

  await prisma.showtime.delete({ where: { id: showtimeId } });
  revalidatePath("/admin/showtimes");
}
