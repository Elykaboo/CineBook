import { SeatButton, type SeatState } from "./seat-button";

export type SeatMapSeat = {
  id: string;
  row: number;
  column: number;
  label: string;
  state: SeatState;
};

export function SeatMap({
  seats,
  columns,
  onSeatClick,
}: {
  seats: SeatMapSeat[];
  columns: number;
  onSeatClick?: (seatId: string) => void;
}) {
  const rows = new Map<number, SeatMapSeat[]>();
  for (const seat of seats) {
    const list = rows.get(seat.row) ?? [];
    list.push(seat);
    rows.set(seat.row, list);
  }
  const sortedRows = [...rows.entries()].sort(([a], [b]) => a - b);
  const aisleAfter = Math.ceil(columns / 2);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-md flex-col items-center gap-1.5">
        <div className="h-1.5 w-full rounded-full bg-surface-3 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
        <span className="font-mono text-2xs uppercase tracking-widest text-fg-3">
          Screen
        </span>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="flex w-max flex-col gap-1.5 p-1">
          {sortedRows.map(([rowIndex, rowSeats]) => (
            <div key={rowIndex} className="flex items-center gap-1.5">
              <span className="w-4 text-center font-mono text-2xs text-fg-3">
                {String.fromCharCode(65 + rowIndex)}
              </span>
              {rowSeats
                .slice()
                .sort((a, b) => a.column - b.column)
                .map((seat) => (
                  <span
                    key={seat.id}
                    className={
                      seat.column === aisleAfter ? "ml-3" : undefined
                    }
                  >
                    <SeatButton
                      label={seat.label}
                      state={seat.state}
                      onClick={
                        onSeatClick ? () => onSeatClick(seat.id) : undefined
                      }
                    />
                  </span>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
