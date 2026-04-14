import type { Meta, StoryObj } from '@storybook/react';
import {
  sourceDragonBall,
  sourceDragonBallZ,
  sourceFinalFantasyVII,
  sourceTekken4,
} from '../../../../../.storybook/fixtures';
import { SourceHeader } from './SourceHeader';

const tTypes = (key: string) => {
  const map: Record<string, string> = {
    anime: 'Anime',
    game: 'Game',
    movie: 'Movie',
    series: 'Series',
    music: 'Music',
  };
  return map[key] ?? key;
};

const tScenes = (key: string, values?: Record<string, number>) => {
  if (key === 'scenesCount') {
    return `${values?.count ?? 0} scene${values?.count !== 1 ? 's' : ''}`;
  }
  if (key === 'grammarPointsCount') {
    return `${values?.count ?? 0} grammar points`;
  }
  return key;
};

const meta: Meta<typeof SourceHeader> = {
  title: 'Features/Sources/SourceHeader',
  component: SourceHeader,
  parameters: { layout: 'padded' },
  args: { tTypes, tScenes },
};
export default meta;

type Story = StoryObj<typeof SourceHeader>;

export const Anime: Story = {
  args: {
    source: sourceDragonBallZ,
    displayTitle: 'Dragon Ball Z',
    scenesCount: 24,
    grammarPointsCount: 4,
  },
};

export const Game: Story = {
  args: {
    source: sourceFinalFantasyVII,
    displayTitle: 'Final Fantasy VII',
    scenesCount: 8,
    grammarPointsCount: 2,
  },
};

export const NoCover: Story = {
  args: {
    source: sourceTekken4,
    displayTitle: 'Tekken 4',
    scenesCount: 6,
    grammarPointsCount: 0,
  },
};

export const JapaneseTitle: Story = {
  args: {
    source: sourceDragonBall,
    displayTitle: 'ドラゴンボール',
    scenesCount: 12,
    grammarPointsCount: 0,
  },
};
