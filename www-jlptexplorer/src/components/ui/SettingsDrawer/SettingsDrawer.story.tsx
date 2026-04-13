import type { Meta, StoryObj } from '@storybook/react';
import { SettingsDrawer } from './SettingsDrawer';

const meta: Meta<typeof SettingsDrawer> = {
  title: 'UI/SettingsDrawer',
  component: SettingsDrawer,
  parameters: { layout: 'fullscreen' },
  args: { opened: true, onClose: () => {} },
};
export default meta;

type Story = StoryObj<typeof SettingsDrawer>;

export const Open: Story = {};

export const Closed: Story = {
  args: { opened: false },
};
