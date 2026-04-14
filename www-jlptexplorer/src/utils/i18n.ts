export function getLocalizedTitle(
  item: { japanese_title: string | null; translations: Array<{ locale: string; title: string }> },
  lang: 'localized' | 'japanese',
  locale: string
): string | null {
  if (lang === 'japanese') {
    return item.japanese_title ?? null;
  }
  return (
    item.translations.find((t) => t.locale === locale)?.title ?? item.translations[0]?.title ?? null
  );
}

export function getLocalizedName(
  item: { name_japanese: string | null; translations: Array<{ locale: string; name: string }> },
  lang: 'localized' | 'japanese',
  locale: string
): string | null {
  if (lang === 'japanese') {
    return item.name_japanese ?? null;
  }
  return (
    item.translations.find((t) => t.locale === locale)?.name ?? item.translations[0]?.name ?? null
  );
}

export function getLocalizedTranslation(
  translations: Array<{ locale: string; translation: string | null }>,
  locale: string
): string | null {
  return (
    translations.find((t) => t.locale === locale)?.translation ??
    translations[0]?.translation ??
    null
  );
}

export function getLocalizedMeaning(
  translations: Array<{ locale: string; meaning: string; notes?: string | null }>,
  locale: string
): string | null {
  return translations.find((t) => t.locale === locale)?.meaning ?? translations[0]?.meaning ?? null;
}
