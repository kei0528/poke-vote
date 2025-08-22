export function generateShortUUID(): string {
  return crypto.randomUUID().slice(0, 8);
}
