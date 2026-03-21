import { http, HttpResponse } from 'msw';
import type { Meta, StoryObj } from '@storybook/react';
import { defaultHandlers } from '../../../../../.storybook/handlers';
import { allSources, sourcesPageResponse } from '../../../../../.storybook/fixtures';
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
        http.get(`${BASE}/api/v1/:locale/sources`, () =>
          HttpResponse.json({
            ...sourcesPageResponse,
            sources: allSources.filter((s) => s.type === 'anime'),
            available_types: ['anime'],
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
        http.get(`${BASE}/api/v1/:locale/sources`, async () => {
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
        http.get(`${BASE}/api/v1/:locale/sources`, () =>
          HttpResponse.json({
            sources: [],
            total: 0,
            page: 1,
            totalPages: 0,
            available_types: [],
          })
        ),
      ],
    },
  },
};
