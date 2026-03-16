import { Suspense } from 'react';
import { GrammarPointsList } from '../../../components/GrammarPointsList/GrammarPointsList';
import { PageLoader } from '../../../components/PageLoader/PageLoader';

export const metadata = {
  title: 'Grammar Points — JLPTExplorer',
};

export default function GrammarPointsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <GrammarPointsList />
    </Suspense>
  );
}
