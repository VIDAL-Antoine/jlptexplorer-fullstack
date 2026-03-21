import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from '@mantine/core';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <AppShell header={{ height: 60 }}>
        <AppShell.Header>
          <Story />
        </AppShell.Header>
      </AppShell>
    ),
  ],
  args: { opened: false, toggle: () => {} },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const NavOpen: Story = {
  args: { opened: true },
};
