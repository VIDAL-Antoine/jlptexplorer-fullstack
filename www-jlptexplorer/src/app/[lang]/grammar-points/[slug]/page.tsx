import { Suspense } from 'react';
import { api } from '@/lib/api';
import { getLocalizedMeaning } from '@/utils/i18n';
import { GrammarPointContent, GrammarPointLoadingFallback } from './GrammarPointContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  try {
    const gp = await api.grammarPoints.get(slug);
    const meaning = getLocalizedMeaning(gp.translations, lang);
    const capitalizedMeaning = meaning ? meaning.charAt(0).toUpperCase() + meaning.slice(1) : null;
    return { title: capitalizedMeaning ? `${gp.title} · ${capitalizedMeaning}` : gp.title };
  } catch {
    return {};
  }
}

export default function GrammarPointPage() {
  return (
    <Suspense fallback={<GrammarPointLoadingFallback />}>
      <GrammarPointContent />
    </Suspense>
  );
}
