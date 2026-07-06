export async function fetchAllPaginated<T>(
  fetchPage: (page: number, pageSize: number) => Promise<{ items: T[]; total: number }>,
  pageSize = 100,
): Promise<T[]> {
  let page = 1;
  let total = 0;
  const items: T[] = [];

  do {
    const response = await fetchPage(page, pageSize);
    total = response.total;
    items.push(...response.items);
    page += 1;
  } while (items.length < total);

  return items;
}
