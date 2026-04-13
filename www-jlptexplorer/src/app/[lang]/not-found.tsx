'use client';

import { useTranslations } from 'next-intl';
import { Button, Stack, Text, Title } from '@mantine/core';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <Stack align="center" justify="center" mt="xl" gap="md">
      <Title order={1} c="dimmed">
        404
      </Title>
      <Text size="lg">{t('message')}</Text>
      <Button component={Link} href="/" variant="light">
        {t('backHome')}
      </Button>
    </Stack>
  );
}
