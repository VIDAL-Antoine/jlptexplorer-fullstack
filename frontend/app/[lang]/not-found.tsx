'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/navigation';
import { Button, Stack, Text, Title } from '@mantine/core';

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
