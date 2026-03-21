import { type ComponentProps, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  allSources,
  sourceDragonBallZ,
  sourceFinalFantasyVII,
} from '../../../../../.storybook/fixtures';
import { SourcesMultiSelect } from './SourcesMultiSelect';

const meta: Meta<typeof SourcesMultiSelect> = {
  title: 'Features/Sources/SourcesMultiSelect',
  component: SourcesMultiSelect,
  parameters: { layout: 'padded' },
  args: {
    sources: allSources,
    placeholder: 'Filter by source…',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SourcesMultiSelect>;

export const Empty: Story = {
  args: { value: [], onChange: () => {} },
};

function WithSelectionComponent(args: ComponentProps<typeof SourcesMultiSelect>) {
  const [value, setValue] = useState([sourceDragonBallZ.slug, sourceFinalFantasyVII.slug]);
  return <SourcesMultiSelect {...args} value={value} onChange={setValue} />;
}

export const WithSelection: Story = {
  render: (args) => <WithSelectionComponent {...args} />,
};

export const NoData: Story = {
  args: { sources: [], value: [], onChange: () => {} },
};
