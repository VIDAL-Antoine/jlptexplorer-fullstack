import type { Meta, StoryObj } from '@storybook/react';
import { gpTeIru, gpWaTopic } from '../../../../../.storybook/fixtures';
import { GrammarPointHeader } from './GrammarPointHeader';

const tScenes = (key: string, values?: Record<string, number>) => {
  if (key === 'scenesCount') {
    return `${values?.count ?? 0} scene${values?.count !== 1 ? 's' : ''}`;
  }
  if (key === 'grammarPointsCount') {
    return `${values?.count ?? 0} grammar points`;
  }
  return key;
};

const meta: Meta<typeof GrammarPointHeader> = {
  title: 'Features/Grammar/GrammarPointHeader',
  component: GrammarPointHeader,
  parameters: { layout: 'padded' },
  args: { tScenes },
};
export default meta;

type Story = StoryObj<typeof GrammarPointHeader>;

export const N5NoNotes: Story = {
  args: { grammarPoint: gpWaTopic, scenesCount: 42 },
};

export const N5WithNotes: Story = {
  args: {
    grammarPoint: gpTeIru,
    scenesCount: 17,
  },
};

export const N4: Story = {
  args: {
    grammarPoint: {
      ...gpTeIru,
      jlpt_level: 'N4',
      title: 'たら',
      romaji: 'tara',
      translations: [
        { id: 99, grammar_point_id: 99, locale: 'en', meaning: 'conditional: if/when (after completion)', notes: null },
        { id: 100, grammar_point_id: 99, locale: 'fr', meaning: 'conditionnel : si/quand (après accomplissement)', notes: null },
      ],
    },
    scenesCount: 5,
  },
};
