import { Suspense } from 'react';
import { SourcesList } from '../../../components/features/sources/SourcesList/SourcesList';
import { PageLoader } from '../../../components/ui/PageLoader/PageLoader';

export const metadata = {
  title: 'Sources — JLPTExplorer',
};

export default function SourcesPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SourcesList />
    </Suspense>
  );
}
