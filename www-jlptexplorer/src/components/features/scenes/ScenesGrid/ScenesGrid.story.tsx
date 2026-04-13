import type { Meta, StoryObj } from '@storybook/react';
import { allScenes, gpTeIru, gpWaTopic } from '../../../../../.storybook/fixtures';
import { ScenesGrid } from './ScenesGrid';

const meta: Meta<typeof ScenesGrid> = {
  title: 'Features/Scenes/ScenesGrid',
  component: ScenesGrid,
  parameters: { layout: 'padded' },
  args: {
    page: 1,
    totalPages: 1,
    loading: false,
    pageSize: 6,
    noScenesMessage: 'No scenes found.',
    onPageChange: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof ScenesGrid>;

export const WithScenes: Story = {
  args: { scenes: allScenes },
};

export const WithGrammarHighlight: Story = {
  args: {
    scenes: allScenes,
    currentGrammarPointIds: [gpWaTopic.id, gpTeIru.id],
  },
};

export const Loading: Story = {
  args: { scenes: null, loading: true },
};

export const Empty: Story = {
  args: { scenes: [] },
};

export const MultiPage: Story = {
  args: { scenes: allScenes, totalPages: 5, page: 2 },
};
