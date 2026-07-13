import { PrismaClient, SeatType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const movies = [
  {
    title: "Nebula Drift",
    description: "A crew of salvagers uncovers a signal that shouldn't exist at the edge of the solar system.",
    genre: "Sci-Fi",
    durationMinutes: 128,
    posterUrl: "https://picsum.photos/seed/nebula-drift/400/600",
    rating: "PG-13",
    status: "NOW_SHOWING" as const,
  },
  {
    title: "The Last Ember",
    description: "A retired firefighter is pulled back into action when a wildfire threatens his hometown.",
    genre: "Drama",
    durationMinutes: 112,
    posterUrl: "https://picsum.photos/seed/last-ember/400/600",
    rating: "PG-13",
    status: "NOW_SHOWING" as const,
  },
  {
    title: "Midnight Heist",
    description: "Five strangers with nothing in common pull off the biggest art theft in a century.",
    genre: "Thriller",
    durationMinutes: 105,
    posterUrl: "https://picsum.photos/seed/midnight-heist/400/600",
    rating: "R",
    status: "NOW_SHOWING" as const,
  },
  {
    title: "Paws & Effect",
    description: "A stray dog and a lonely inventor team up to save their neighborhood from demolition.",
    genre: "Family",
    durationMinutes: 96,
    posterUrl: "https://picsum.photos/seed/paws-and-effect/400/600",
    rating: "G",
    status: "NOW_SHOWING" as const,
  },
  {
    title: "Echoes of Tomorrow",
    description: "A physicist discovers her research has been quietly weaponized by a future she hasn't lived yet.",
    genre: "Sci-Fi",
    durationMinutes: 134,
    posterUrl: "https://picsum.photos/seed/echoes-of-tomorrow/400/600",
    rating: "PG-13",
    status: "COMING_SOON" as const,
  },
  {
    title: "Laugh Track",
    description: "A washed-up sitcom writer gets one last shot at a comeback special.",
    genre: "Comedy",
    durationMinutes: 98,
    posterUrl: "https://picsum.photos/seed/laugh-track/400/600",
    rating: "PG-13",
    status: "COMING_SOON" as const,
  },
  {
    title: "The Quiet Hollow",
    description: "A family moves into a house at the edge of the woods, where the silence isn't empty.",
    genre: "Horror",
    durationMinutes: 101,
    posterUrl: "https://picsum.photos/seed/quiet-hollow/400/600",
    rating: "R",
    status: "COMING_SOON" as const,
  },
  {
    title: "Iron Tide",
    description: "A disgraced boxer trains a new fighter while confronting the mistakes of his own career.",
    genre: "Sports",
    durationMinutes: 118,
    posterUrl: "https://picsum.photos/seed/iron-tide/400/600",
    rating: "PG-13",
    status: "NOW_SHOWING" as const,
  },
];

const halls = [
  { name: "Hall 1", rows: 8, columns: 10 },
  { name: "Hall 2", rows: 6, columns: 12 },
];

function seatType(row: number, rows: number): SeatType {
  return row >= rows - 1 ? "PREMIUM" : "REGULAR";
}

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@cinebook.dev" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@cinebook.dev",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@cinebook.dev" },
    update: {},
    create: {
      name: "Sample User",
      email: "user@cinebook.dev",
      password: hashedPassword,
      role: "USER",
    },
  });

  const createdHalls = [];
  for (const hall of halls) {
    const createdHall = await prisma.cinemaHall.create({ data: hall });
    createdHalls.push(createdHall);

    const seatsData = [];
    for (let row = 0; row < hall.rows; row++) {
      for (let column = 0; column < hall.columns; column++) {
        seatsData.push({
          hallId: createdHall.id,
          row,
          column,
          type: seatType(row, hall.rows),
        });
      }
    }
    await prisma.seat.createMany({ data: seatsData });
  }

  const createdMovies = [];
  for (const movie of movies) {
    const createdMovie = await prisma.movie.create({ data: movie });
    createdMovies.push(createdMovie);
  }

  const now = new Date();
  const nowShowingMovies = createdMovies.filter(
    (m) => m.status === "NOW_SHOWING"
  );

  for (let i = 0; i < nowShowingMovies.length; i++) {
    const movie = nowShowingMovies[i];
    const hall = createdHalls[i % createdHalls.length];

    for (let day = 0; day < 3; day++) {
      const startTime = new Date(now);
      startTime.setDate(now.getDate() + day);
      startTime.setHours(14 + day * 3, 0, 0, 0);

      await prisma.showtime.create({
        data: {
          movieId: movie.id,
          hallId: hall.id,
          startTime,
          price: 250 + day * 25,
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
