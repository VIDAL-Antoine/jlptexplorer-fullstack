'use client';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Footer } from '@/components/layout/Footer/Footer';
import { Header } from '@/components/layout/Header/Header';
import { Navbar } from '@/components/layout/Navbar/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Header opened={opened} toggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar>
        <Navbar onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>{children}</div>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
