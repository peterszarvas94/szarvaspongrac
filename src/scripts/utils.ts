// Pure utility functions that can be tested without browser/DB dependencies

export function parseDataAttr(
  value: string,
): { collection: string; key: string } | null {
  const [collection, key] = value.split(":");
  if (!collection || !key) return null;
  return { collection, key };
}

export function getMaxSorting(sortingValues: number[]): number {
  if (sortingValues.length === 0) return 0;
  return Math.max(...sortingValues);
}

export function isDuplicateFile(file: File, existingFiles: File[]): boolean {
  return existingFiles.some(
    (existing) => existing.name === file.name && existing.size === file.size,
  );
}
