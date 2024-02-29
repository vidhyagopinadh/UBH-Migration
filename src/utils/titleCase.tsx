export function titleCase(str): void {
  if (str) return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}
