import { type ComponentProps, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { allGrammarPoints, gpWaTopic, gpTeIru } from '../../../../../.storybook/fixtures';
import { GrammarPointsMultiSelect } from './GrammarPointsMultiSelect';

const meta: Meta<typeof GrammarPointsMultiSelect> = {
  title: 'Features/Grammar/GrammarPointsMultiSelect',
  component: GrammarPointsMultiSelect,
  parameters: { layout: 'padded' },
  args: {
    grammarPoints: allGrammarPoints,
    placeholder: 'Filter by grammar point…',
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

type Story = StoryObj<typeof GrammarPointsMultiSelect>;

export const Empty: Story = {
  args: { value: [], onChange: () => {} },
};

function WithSelectionComponent(args: ComponentProps<typeof GrammarPointsMultiSelect>) {
  const [value, setValue] = useState([gpWaTopic.slug, gpTeIru.slug]);
  return <GrammarPointsMultiSelect {...args} value={value} onChange={setValue} />;
}

export const WithSelection: Story = {
  render: (args) => <WithSelectionComponent {...args} />,
};

export const NoData: Story = {
  args: { grammarPoints: [], value: [], onChange: () => {} },
};
