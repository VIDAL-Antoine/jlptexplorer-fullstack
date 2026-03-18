'use client';

import { IconApps, IconMessageLanguage, IconVocabulary } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { NavLink, Stack, Text } from '@mantine/core';
import { Link, usePathname } from '@/i18n/navigation';

const LINKS = [
  { href: '/grammar-points' as const, labelKey: 'grammarPoints' as const, icon: IconVocabulary },
  { href: '/sources' as const, labelKey: 'sources' as const, icon: IconApps },
  { href: '/scenes' as const, labelKey: 'scenes' as const, icon: IconMessageLanguage },
];

export function Navbar() {
  const t = useTranslations('Navbar');
  const pathname = usePathname();

  return (
    <Stack gap={0} p="sm">
      <Text size="xs" fw={600} c="dimmed" px="sm" py="xs" tt="uppercase">
        {t('browse')}
      </Text>
      {LINKS.map(({ href, labelKey, icon: Icon }) => (
        <NavLink
          key={href}
          component={Link}
          href={href}
          label={t(labelKey)}
          leftSection={<Icon size={18} />}
          active={pathname === href}
        />
      ))}
    </Stack>
  );
}
