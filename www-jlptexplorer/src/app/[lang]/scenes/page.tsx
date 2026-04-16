import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { ScenesContent } from './ScenesContent';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Navbar' });
  return { title: t('scenes') };
}

export default function ScenesPage() {
  return (
    <Suspense>
      <ScenesContent />
    </Suspense>
  );
}
