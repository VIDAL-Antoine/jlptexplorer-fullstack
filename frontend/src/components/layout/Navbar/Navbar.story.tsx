import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Layout/Navbar',
  component: Navbar,
  parameters: { layout: 'fullscreen' },
  args: { onNavigate: () => {} },
};
export default meta;

type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};

export const GrammarPointsActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/grammar-points',
      },
    },
  },
};

export const ScenesActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/scenes',
      },
    },
  },
};
