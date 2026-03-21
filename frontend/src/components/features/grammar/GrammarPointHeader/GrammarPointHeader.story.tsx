import type { Meta, StoryObj } from '@storybook/react';
import { gpTeIruDetail, gpWaTopicDetail } from '../../../../../.storybook/fixtures';
import { GrammarPointHeader } from './GrammarPointHeader';

const tScenes = (key: string, values?: Record<string, number>) => {
  if (key === 'scenesCount') { return `${values?.count ?? 0} scene${values?.count !== 1 ? 's' : ''}`; }
  if (key === 'grammarPointsCount') { return `${values?.count ?? 0} grammar points`; }
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
  args: { grammarPoint: gpWaTopicDetail },
};

export const N5WithNotes: Story = {
  args: {
    grammarPoint: {
      ...gpTeIruDetail,
      notes: 'Also used for habitual actions. Contracted form: てる.',
    },
  },
};

export const N4: Story = {
  args: {
    grammarPoint: {
      ...gpTeIruDetail,
      jlpt_level: 'N4',
      title: 'たら',
      romaji: 'tara',
      meaning: 'conditional: if/when (after completion)',
      scenes_count: 5,
      notes: null,
    },
  },
};
