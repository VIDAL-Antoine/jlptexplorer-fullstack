import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { allSources, sourcesPageResponse } from '../../../../../.storybook/fixtures';
import { defaultHandlers } from '../../../../../.storybook/handlers';
import { SourcesList } from './SourcesList';

const BASE = 'http://localhost:8080';

const meta: Meta<typeof SourcesList> = {
  title: 'Features/Sources/SourcesList',
  component: SourcesList,
  parameters: {
    layout: 'padded',
    msw: { handlers: defaultHandlers },
  },
};
export default meta;

type Story = StoryObj<typeof SourcesList>;

export const Default: Story = {};

export const AnimeOnly: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE}/api/v1/sources`, () =>
          HttpResponse.json({
            ...sourcesPageResponse,
            items: allSources.filter((s) => s.type === 'anime'),
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
        http.get(`${BASE}/api/v1/sources`, async () => {
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
        http.get(`${BASE}/api/v1/sources`, () =>
          HttpResponse.json({ items: [], total: 0 })
        ),
      ],
    },
  },
};
