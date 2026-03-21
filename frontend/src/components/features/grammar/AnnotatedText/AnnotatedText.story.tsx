import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '@mantine/core';
import type { TranscriptLineGrammarPoint } from '@/lib/api/types';
import { gpNaiNegative, gpTeIru, gpWaTopic, gpWoObject } from '../../../../../.storybook/fixtures';
import { AnnotatedText } from './AnnotatedText';

const meta: Meta<typeof AnnotatedText> = {
  title: 'Features/Grammar/AnnotatedText',
  component: AnnotatedText,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Text size="xl" lang="ja">
        <Story />
      </Text>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AnnotatedText>;

const text = '超サイヤ人は穏やかな心を持っていないとなれなかったんじゃないのか？';

const annotations: TranscriptLineGrammarPoint[] = [
  {
    id: 1,
    transcript_line_id: 1,
    grammar_point_id: gpWaTopic.id,
    start_index: 5,
    end_index: 6,
    matched_form: 'は',
    grammar_points: gpWaTopic,
  },
  {
    id: 2,
    transcript_line_id: 1,
    grammar_point_id: gpWoObject.id,
    start_index: 11,
    end_index: 12,
    matched_form: 'を',
    grammar_points: gpWoObject,
  },
  {
    id: 3,
    transcript_line_id: 1,
    grammar_point_id: gpTeIru.id,
    start_index: 12,
    end_index: 18,
    matched_form: '持っていない',
    grammar_points: gpTeIru,
  },
  {
    id: 4,
    transcript_line_id: 1,
    grammar_point_id: gpNaiNegative.id,
    start_index: 12,
    end_index: 18,
    matched_form: '持っていない',
    grammar_points: gpNaiNegative,
  },
];

export const PlainText: Story = {
  args: {
    text,
    annotations: [],
  },
};

export const WithAnnotations: Story = {
  args: {
    text,
    annotations,
    currentGrammarPointIds: [gpWaTopic.id, gpWoObject.id, gpTeIru.id, gpNaiNegative.id],
  },
};

export const HighlightOnePoint: Story = {
  args: {
    text,
    annotations,
    currentGrammarPointIds: [gpTeIru.id],
  },
};
