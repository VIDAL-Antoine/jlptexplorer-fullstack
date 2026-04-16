import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { SourcesList } from '@/components/features/sources/SourcesList/SourcesList';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Navbar' });
  return { title: t('sources') };
}

export default function SourcesPage() {
  return (
    <Suspense>
      <SourcesList />
    </Suspense>
  );
}
