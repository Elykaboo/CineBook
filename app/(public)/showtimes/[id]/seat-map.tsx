"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { createBooking, type BookingFormState } from "@/actions/bookings";
import { FormError } from "@/components/form-error";

type Seat = {
  id: string;
  row: number;
  column: number;
  type: "REGULAR" | "PREMIUM";
  taken: boolean;
};

const initialState: BookingFormState = {};

export function SeatMap({
  showtimeId,
  seats,
  price,
  isLoggedIn,
}: {
  showtimeId: string;
  seats: Seat[];
  price: number;
  isLoggedIn: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [state, formAction, pending] = useActionState(
    createBooking,
    initialState
  );

  const rows = useMemo(() => {
    const map = new Map<number, Seat[]>();
    for (const seat of seats) {
      const rowSeats = map.get(seat.row) ?? [];
      rowSeats.push(seat);
      map.set(seat.row, rowSeats);
    }
    return [...map.entries()].sort(([a], [b]) => a - b);
  }, [seats]);

  function toggleSeat(seat: Seat) {
    if (seat.taken || pending) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seat.id)) next.delete(seat.id);
      else next.add(seat.id);
      return next;
    });
  }

  const total = selected.size * price;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <div className="w-full max-w-md h-2 bg-gray-200 rounded-full mb-4" />
        <div className="flex flex-col gap-1">
          {rows.map(([row, rowSeats]) => (
            <div key={row} className="flex gap-1">
              {rowSeats.map((seat) => {
                const isSelected = selected.has(seat.id);
                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={seat.taken}
                    onClick={() => toggleSeat(seat)}
                    title={`Row ${seat.row + 1}, Seat ${seat.column + 1} (${seat.type})`}
                    className={`w-7 h-7 text-xs rounded flex items-center justify-center border ${
                      seat.taken
                        ? "bg-gray-300 border-gray-300 cursor-not-allowed"
                        : isSelected
                        ? "bg-black text-white border-black"
                        : seat.type === "PREMIUM"
                        ? "bg-amber-50 border-amber-300 hover:bg-amber-100"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {seat.column + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex gap-4 text-xs text-gray-500 mt-2">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-white border border-gray-300 inline-block" />
            Regular
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-50 border border-amber-300 inline-block" />
            Premium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-gray-300 inline-block" />
            Taken
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-black inline-block" />
            Selected
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-sm">
        <p className="text-sm">
          {selected.size} seat{selected.size === 1 ? "" : "s"} selected ·{" "}
          <span className="font-medium">₱{total.toFixed(2)}</span>
        </p>

        <FormError message={state?.error} />

        {isLoggedIn ? (
          <form action={formAction}>
            <input type="hidden" name="showtimeId" value={showtimeId} />
            {[...selected].map((seatId) => (
              <input key={seatId} type="hidden" name="seatIds" value={seatId} />
            ))}
            <button
              type="submit"
              disabled={selected.size === 0 || pending}
              className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50 w-full"
            >
              {pending ? "Booking..." : "Book selected seats"}
            </button>
          </form>
        ) : (
          <Link
            href={`/login?callbackUrl=/showtimes/${showtimeId}`}
            className="bg-black text-white rounded px-4 py-2 text-sm text-center"
          >
            Log in to book
          </Link>
        )}
      </div>
    </div>
  );
}
