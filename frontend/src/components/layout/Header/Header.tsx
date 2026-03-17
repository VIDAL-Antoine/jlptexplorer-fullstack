'use client';

import { IconMoon, IconSettings, IconSun } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { ActionIcon, Anchor, Burger, Group, Text, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SettingsDrawer } from '@/components/ui/SettingsDrawer/SettingsDrawer';
import { Link } from '@/i18n/navigation';
import classes from './Header.module.css';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function Header({ opened, toggle }: HeaderProps) {
  const t = useTranslations('Header');
  const { toggleColorScheme } = useMantineColorScheme();
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);

  return (
    <>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Anchor component={Link} href="/" underline="never" c="inherit">
            <Text fw={700} size="lg">
              JLPTExplorer
            </Text>
          </Anchor>
        </Group>
        <Group gap="xs">
          <ActionIcon
            variant="default"
            size="lg"
            onClick={toggleColorScheme}
            aria-label={t('toggleColorScheme')}
          >
            <IconSun size={18} className={classes.iconLight} />
            <IconMoon size={18} className={classes.iconDark} />
          </ActionIcon>
          <ActionIcon
            variant="default"
            size="lg"
            onClick={openSettings}
            aria-label={t('openSettings')}
          >
            <IconSettings size={18} />
          </ActionIcon>
        </Group>
      </Group>
      <SettingsDrawer opened={settingsOpened} onClose={closeSettings} />
    </>
  );
}
