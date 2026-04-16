import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Filters<K extends string> = Record<K, string[]> & { page: number };
type RawFilters<K extends string> = Record<K, string>;

export function useUrlFilters<K extends string>(slugListKeys: readonly K[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawFilters = Object.fromEntries(
    slugListKeys.map((key) => [key, searchParams.get(key) ?? ''])
  ) as RawFilters<K>;

  const filters = {
    ...Object.fromEntries(
      slugListKeys.map((key) => [key, rawFilters[key] ? rawFilters[key].split(',') : []])
    ),
    page: Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1),
  } as Filters<K>;

  function setFilters(updates: Partial<Record<K, string[]>> & { page?: number }) {
    const params = new URLSearchParams();
    for (const key of slugListKeys) {
      const value = key in updates ? (updates as Record<K, string[]>)[key] : filters[key];
      if (value.length > 0) {
        params.set(key, value.join(','));
      }
    }
    const newPage = updates.page ?? filters.page;
    if (newPage > 1) {
      params.set('page', String(newPage));
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  return { filters, rawFilters, setFilters };
}
