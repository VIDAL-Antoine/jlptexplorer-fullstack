import { Suspense } from 'react';
import { SourcesList } from '@/components/features/sources/SourcesList/SourcesList';

export const metadata = {
  title: 'Sources — JLPTExplorer',
};

export default function SourcesPage() {
  return (
    <Suspense>
      <SourcesList />
    </Suspense>
  );
}
