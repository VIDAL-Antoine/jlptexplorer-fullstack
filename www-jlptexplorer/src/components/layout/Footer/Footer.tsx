'use client';

import { useTranslations } from 'next-intl';
import { Stack, Text } from '@mantine/core';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <Stack component="footer" px="md" pt="xl" gap={2}>
      <Text size="xs" c="dimmed" ta="center">
        {t('tagline')}
      </Text>
      <Text size="xs" c="dimmed" ta="center">
        {t('legal')}
      </Text>
    </Stack>
  );
}
