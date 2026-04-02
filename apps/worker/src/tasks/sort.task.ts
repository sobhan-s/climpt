export function sort(size: number): number[] {
  const arr = Array.from({ length: size }, () =>
    Math.floor(Math.random() * 100000),
  );

  return arr.sort((a, b) => a - b);
}
