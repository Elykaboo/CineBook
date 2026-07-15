export function seatLabel(row: number, column: number): string {
  return `${String.fromCharCode(65 + row)}${column + 1}`;
}
