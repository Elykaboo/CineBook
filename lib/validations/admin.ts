import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  genre: z.string().min(1),
  durationMinutes: z.coerce.number().int().positive(),
  posterUrl: z.string().url(),
  rating: z.string().min(1),
  status: z.enum(["NOW_SHOWING", "COMING_SOON"]),
});

export const hallSchema = z.object({
  name: z.string().min(1),
  rows: z.coerce.number().int().min(1).max(50),
  // Capped at 26 so seat labels (A-Z per row) stay unambiguous.
  columns: z.coerce.number().int().min(1).max(26),
});

export const showtimeSchema = z.object({
  movieId: z.string().min(1),
  hallId: z.string().min(1),
  startTime: z.coerce.date(),
  price: z.coerce.number().positive(),
});
