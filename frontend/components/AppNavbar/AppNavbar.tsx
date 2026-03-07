'use client';

import { usePathname } from 'next/navigation';
import { NavLink, Stack, Text } from '@mantine/core';
import { IconBook, IconMovie } from '@tabler/icons-react';

const links = [
  { href: '/grammar-points', label: 'Grammar Points', icon: IconBook },
  { href: '/sources', label: 'Sources', icon: IconMovie },
];

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <Stack gap={0} p="sm">
      <Text size="xs" fw={600} c="dimmed" px="sm" py="xs" tt="uppercase">
        Browse
      </Text>
      {links.map(({ href, label, icon: Icon }) => (
        <NavLink
          key={href}
          href={href}
          label={label}
          leftSection={<Icon size={18} />}
          active={pathname === href}
        />
      ))}
    </Stack>
  );
}
