'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import {
  ActionIcon,
  Burger,
  Group,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import classes from './AppHeader.module.css';

interface AppHeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function AppHeader({ opened, toggle }: AppHeaderProps) {
  const { toggleColorScheme } = useMantineColorScheme();

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Text fw={700} size="lg">
          JLPTExplorer
        </Text>
      </Group>
      <ActionIcon
        variant="default"
        size="lg"
        onClick={toggleColorScheme}
        aria-label="Toggle color scheme"
      >
        <IconSun size={18} className={classes.iconLight} />
        <IconMoon size={18} className={classes.iconDark} />
      </ActionIcon>
    </Group>
  );
}
