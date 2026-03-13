import { useTranslations } from 'next-intl';
import { Stack, Text, Title } from '@mantine/core';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <Stack mt="xl" gap="sm">
      <Title order={1}>JLPTExplorer</Title>
      <Text c="dimmed">{t('description')}</Text>
    </Stack>
  );
}
