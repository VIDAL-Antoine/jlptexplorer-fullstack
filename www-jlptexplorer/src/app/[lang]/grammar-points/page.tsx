import { Suspense } from 'react';
import { GrammarPointsList } from '@/components/features/grammar/GrammarPointsList/GrammarPointsList';

export default function GrammarPointsPage() {
  return (
    <Suspense>
      <GrammarPointsList />
    </Suspense>
  );
}
