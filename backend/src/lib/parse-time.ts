export function parseTime(value: number | string): number {
  if (typeof value === "number") return value;
  const parts = value.split(":").map(Number);
  if (parts.some(isNaN)) throw Object.assign(new Error(`Invalid time format: "${value}"`), { statusCode: 400 });
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  throw Object.assign(new Error(`Invalid time format: "${value}"`), { statusCode: 400 });
}
