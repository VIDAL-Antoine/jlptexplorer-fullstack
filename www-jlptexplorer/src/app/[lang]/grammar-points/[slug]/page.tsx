import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { getLocalizedMeaning } from '@/utils/i18n';
import { GrammarPointContent } from './GrammarPointContent';

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

export default async function GrammarPointPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  let grammarPoint;
  try {
    grammarPoint = await api.grammarPoints.get(slug);
  } catch {
    notFound();
  }
  return <GrammarPointContent grammarPoint={grammarPoint} slug={slug} />;
}
