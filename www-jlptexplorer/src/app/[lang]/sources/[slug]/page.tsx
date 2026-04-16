import { Suspense } from 'react';
import { api } from '@/lib/api';
import { getLocalizedTitle } from '@/utils/i18n';
import { SourceContent, SourceLoadingFallback } from './SourceContent';

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

export default function SourcePage() {
  return (
    <Suspense fallback={<SourceLoadingFallback />}>
      <SourceContent />
    </Suspense>
  );
}
