import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { getLocalizedTitle } from '@/utils/i18n';
import { SourceContent } from './SourceContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  try {
    const source = await api.sources.get(slug);
    const title = getLocalizedTitle(source, 'localized', lang);
    return { title: title ?? undefined };
  } catch {
    return {};
  }
}

export default async function SourcePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  let source;
  try {
    source = await api.sources.get(slug);
  } catch {
    notFound();
  }
  return <SourceContent source={source} slug={slug} />;
}
