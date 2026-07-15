"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LogIn, CircleAlert } from "lucide-react";
import { createBooking, type BookingFormState } from "@/actions/bookings";
import { SeatMap, type SeatMapSeat } from "@/components/ui/seat-map";
import type { SeatState } from "@/components/ui/seat-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Seat = {
  id: string;
  row: number;
  column: number;
  label: string;
  type: "REGULAR" | "PREMIUM";
  taken: boolean;
};

const initialState: BookingFormState = {};

const legend: { state: SeatState; label: string }[] = [
  { state: "regular", label: "Regular" },
  { state: "premium", label: "Premium" },
  { state: "selected", label: "Selected" },
  { state: "taken", label: "Taken" },
];

const legendSwatchClasses: Record<SeatState, string> = {
  regular: "bg-seat-regular-bg border-seat-regular-border",
  premium: "bg-seat-premium-bg border-seat-premium-border",
  selected: "bg-seat-selected-bg border-seat-selected-border",
  taken: "bg-seat-taken-bg border-seat-taken-border",
};

export function BookingSeatSelector({
  showtimeId,
  seats,
  columns,
  price,
  isLoggedIn,
}: {
  showtimeId: string;
  seats: Seat[];
  columns: number;
  price: number;
  isLoggedIn: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [state, formAction, pending] = useActionState(
    createBooking,
    initialState
  );

  useEffect(() => {
    if (state.clearSelection) {
      setSelected(new Set());
    }
  }, [state]);

  const seatMapSeats: SeatMapSeat[] = useMemo(
    () =>
      seats.map((seat) => ({
        id: seat.id,
        row: seat.row,
        column: seat.column,
        label: seat.label,
        state: seat.taken
          ? "taken"
          : selected.has(seat.id)
          ? "selected"
          : seat.type === "PREMIUM"
          ? "premium"
          : "regular",
      })),
    [seats, selected]
  );

  function toggleSeat(seatId: string) {
    if (pending) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) next.delete(seatId);
      else next.add(seatId);
      return next;
    });
  }

  const selectedLabels = seats
    .filter((seat) => selected.has(seat.id))
    .map((seat) => seat.label);
  const total = selected.size * price;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        <SeatMap
          seats={seatMapSeats}
          columns={columns}
          onSeatClick={toggleSeat}
        />

        <div className="flex flex-wrap justify-center gap-4">
          {legend.map((item) => (
            <span
              key={item.state}
              className="flex items-center gap-1.5 text-xs text-fg-2"
            >
              <span
                className={`h-3 w-3 rounded-chip border ${legendSwatchClasses[item.state]}`}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {!isLoggedIn && (
        <Card className="flex items-center justify-between gap-4 border-teal-200 bg-surface-brand-subtle p-4">
          <p className="text-sm text-teal-700">
            Log in to reserve your seats and complete your booking.
          </p>
          <Link
            href={`/login?callbackUrl=/showtimes/${showtimeId}`}
            className="shrink-0"
          >
            <Button type="button" size="sm">
              <LogIn className="h-3.5 w-3.5" strokeWidth={1.75} />
              Log in to book
            </Button>
          </Link>
        </Card>
      )}

      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-input border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span>{state.error}</span>
        </div>
      )}

      {isLoggedIn && (
        <div className="fixed inset-x-0 bottom-0 border-t border-border-1 bg-surface-1 p-4">
          <form
            action={formAction}
            className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4"
          >
            <input type="hidden" name="showtimeId" value={showtimeId} />
            {[...selected].map((seatId) => (
              <input key={seatId} type="hidden" name="seatIds" value={seatId} />
            ))}

            <div className="flex flex-col">
              <p className="text-sm text-fg-1">
                {selected.size} seat{selected.size === 1 ? "" : "s"} selected
                {selectedLabels.length > 0 && (
                  <span className="ml-1 font-mono text-xs text-fg-2">
                    ({selectedLabels.join(", ")})
                  </span>
                )}
              </p>
              <p className="font-serif text-lg text-fg-1">
                ₱{total.toFixed(2)}
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={selected.size === 0 || pending}
            >
              {pending ? "Booking..." : "Book selected seats"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
