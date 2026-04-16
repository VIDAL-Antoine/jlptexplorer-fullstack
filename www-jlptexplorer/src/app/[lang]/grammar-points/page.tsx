import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { GrammarPointsList } from '@/components/features/grammar/GrammarPointsList/GrammarPointsList';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Navbar' });
  return { title: t('grammarPoints') };
}

export default function GrammarPointsPage() {
  return (
    <Suspense>
      <GrammarPointsList />
    </Suspense>
  );
}
