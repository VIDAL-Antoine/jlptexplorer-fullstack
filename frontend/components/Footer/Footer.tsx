'use client';

import { useTranslations } from 'next-intl';
import { Group, Text } from '@mantine/core';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <Group h="100%" px="md" justify="center">
      <Text size="xs" c="dimmed">
        {t('tagline')}
      </Text>
    </Group>
  );
}
