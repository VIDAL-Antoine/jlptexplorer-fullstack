import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Layout } from '../components/Layout/Layout';
import { theme } from '../theme';

export const metadata = {
  title: 'JLPTExplorer',
  description: 'Japanese grammar in context — JLPT N5 to N1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Layout>{children}</Layout>
        </MantineProvider>
      </body>
    </html>
  );
}
