export function getLocalizedTitle(
  item: { title: string | null; japanese_title: string | null },
  lang: 'localized' | 'japanese'
): string | null {
  return lang === 'japanese' ? (item.japanese_title ?? item.title) : item.title;
}

export function getLocalizedName(
  item: { name: string | null; name_japanese: string | null },
  lang: 'localized' | 'japanese'
): string | null {
  return lang === 'japanese' ? (item.name_japanese ?? item.name) : item.name;
}
