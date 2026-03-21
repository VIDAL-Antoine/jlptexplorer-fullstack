import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio, Box } from '@mantine/core';
import { YoutubePlayer } from './YoutubePlayer';

const meta: Meta<typeof YoutubePlayer> = {
  title: 'Features/Scenes/YoutubePlayer',
  component: YoutubePlayer,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <Box style={{ maxWidth: 640, margin: '0 auto' }}>
        <AspectRatio ratio={16 / 9}>
          <Story />
        </AspectRatio>
      </Box>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof YoutubePlayer>;

export const Default: Story = {
  args: {
    videoId: 'LzHaHLdpOVI',
    startTime: 117,
    endTime: 148,
  },
};

export const ShortClip: Story = {
  args: {
    videoId: 'dQw4w9WgXcQ',
    startTime: 0,
    endTime: 15,
  },
};
