import { Suspense } from 'react';
import { GrammarPointsList } from '@/components/features/grammar/GrammarPointsList/GrammarPointsList';

export const metadata = {
  title: 'Grammar Points — JLPTExplorer',
};

export default function GrammarPointsPage() {
  return (
    <Suspense>
      <GrammarPointsList />
    </Suspense>
  );
}
