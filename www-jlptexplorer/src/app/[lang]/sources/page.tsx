import { Suspense } from 'react';
import { SourcesList } from '@/components/features/sources/SourcesList/SourcesList';

export default function SourcesPage() {
  return (
    <Suspense>
      <SourcesList />
    </Suspense>
  );
}
