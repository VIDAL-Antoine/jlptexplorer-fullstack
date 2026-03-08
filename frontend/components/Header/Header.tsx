'use client';

import Link from 'next/link';
import { IconMoon, IconSun } from '@tabler/icons-react';
import {
  ActionIcon,
  Anchor,
  Burger,
  Group,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import classes from './Header.module.css';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function Header({ opened, toggle }: HeaderProps) {
  const { toggleColorScheme } = useMantineColorScheme();

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Anchor component={Link} href="/" underline="never" c="inherit">
          <Text fw={700} size="lg">
            JLPTExplorer
          </Text>
        </Anchor>
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
