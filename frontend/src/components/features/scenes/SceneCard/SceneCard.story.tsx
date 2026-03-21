import type { Meta, StoryObj } from '@storybook/react';
import { SimpleGrid } from '@mantine/core';
import {
  allScenes,
  gpTeIru,
  gpWaTopic,
  sceneFF7,
  sceneWithTranscript,
} from '../../../../../.storybook/fixtures';
import { SceneCard } from './SceneCard';

const meta: Meta<typeof SceneCard> = {
  title: 'Features/Scenes/SceneCard',
  component: SceneCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <SimpleGrid cols={1} style={{ maxWidth: 480, margin: '0 auto' }}>
        <Story />
      </SimpleGrid>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SceneCard>;

export const Default: Story = {
  args: { scene: sceneWithTranscript },
};

export const TranscriptOpen: Story = {
  args: { scene: sceneWithTranscript, defaultOpened: true },
};

export const WithGrammarHighlight: Story = {
  args: {
    scene: sceneWithTranscript,
    defaultOpened: true,
    currentGrammarPointIds: [gpWaTopic.id, gpTeIru.id],
  },
};

export const NoTranscript: Story = {
  args: { scene: sceneFF7, defaultOpened: true },
};

export const HideSourceInfo: Story = {
  args: { scene: sceneWithTranscript, hideSourceInfo: true },
};

export const Grid: Story = {
  render: () => (
    <SimpleGrid cols={2}>
      {allScenes.map((scene) => (
        <SceneCard key={scene.id} scene={scene} />
      ))}
    </SimpleGrid>
  ),
  decorators: [],
};
