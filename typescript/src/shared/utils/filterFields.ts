const pick = (
  obj: Record<string, unknown>,
  keys: string[]
): Record<string, unknown> =>
  keys.reduce(
    (acc, key) => {
      if (key in obj) acc[key] = obj[key];
      return acc;
    },
    {} as Record<string, unknown>
  );

export const filterFields = (data: unknown, fields: string[]): unknown => {
  if (!fields?.length || typeof data !== 'object' || data === null) return data;

  // Paginated list response — filter each item in results
  if ('results' in data && Array.isArray((data as any).results)) {
    return {
      ...data,
      results: (data as any).results.map((item: any) => pick(item, fields)),
    };
  }

  // Single item response
  return pick(data as Record<string, unknown>, fields);
};
