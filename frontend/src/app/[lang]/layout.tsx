import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Layout } from '../../components/layout/Layout/Layout';
import { SettingsProvider } from '../../contexts/SettingsContext';
import { theme } from '../../theme';

export const metadata = {
  title: 'JLPTExplorer',
  description: 'Japanese grammar in context — JLPT N5 to N1',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const messages = await getMessages();

  return (
    <html lang={lang} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <MantineProvider theme={theme}>
            <SettingsProvider>
              <Layout>{children}</Layout>
            </SettingsProvider>
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
