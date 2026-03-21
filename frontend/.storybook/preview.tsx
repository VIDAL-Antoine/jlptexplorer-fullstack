import '@mantine/core/styles.css';

import { useEffect } from 'react';
import { useGlobals } from 'storybook/preview-api';
import { NextIntlClientProvider } from 'next-intl';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { SettingsProvider } from '../src/contexts/SettingsContext';
import { theme } from '../src/theme';
import messages from '../src/messages/en.json';

initialize({ onUnhandledRequest: 'bypass' });

export const parameters = {
  nextjs: {
    appDirectory: true,
  },
  layout: 'fullscreen',
  options: {
    showPanel: false,
    // @ts-expect-error – storybook throws build error for (a: any, b: any)
    storySort: (a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }),
  },
  backgrounds: { disable: true },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Mantine color scheme',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
    },
  },
};

export const loaders = [mswLoader];

export const decorators = [
  (renderStory: any, context: any) => {
    const [{ theme: storybookTheme }, updateGlobals] = useGlobals();

    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        const isMod = event.metaKey || event.ctrlKey;
        const isJ = event.code === 'KeyJ';

        if (!isMod || !isJ) {
          return;
        }

        event.preventDefault();
        updateGlobals({ theme: storybookTheme === 'dark' ? 'light' : 'dark' });
      };

      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, [storybookTheme, updateGlobals]);

    const scheme = (context.globals.theme || 'light') as 'light' | 'dark';
    return (
      <NextIntlClientProvider locale="en" messages={messages}>
        <MantineProvider theme={theme} forceColorScheme={scheme}>
          <ColorSchemeScript />
          <SettingsProvider>{renderStory()}</SettingsProvider>
        </MantineProvider>
      </NextIntlClientProvider>
    );
  },
];
