import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { allGrammarPoints, grammarPointsPageResponse } from '../../../../../.storybook/fixtures';
import { defaultHandlers } from '../../../../../.storybook/handlers';
import { GrammarPointsList } from './GrammarPointsList';

const BASE = 'http://localhost:8080';

const meta: Meta<typeof GrammarPointsList> = {
  title: 'Features/Grammar/GrammarPointsList',
  component: GrammarPointsList,
  parameters: {
    layout: 'padded',
    msw: { handlers: defaultHandlers },
  },
};
export default meta;

type Story = StoryObj<typeof GrammarPointsList>;

export const Default: Story = {};

export const FilteredN5: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE}/api/v1/grammar-points`, () =>
          HttpResponse.json({
            ...grammarPointsPageResponse,
            items: allGrammarPoints.filter((gp) => gp.jlpt_level === 'N5'),
          })
        ),
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE}/api/v1/grammar-points`, async () => {
          await new Promise(() => {}); // never resolves
        }),
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE}/api/v1/grammar-points`, () =>
          HttpResponse.json({ items: [], total: 0 })
        ),
      ],
    },
  },
};
