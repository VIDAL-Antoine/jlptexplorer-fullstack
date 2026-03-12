'use client';

import Link from 'next/link';
import { Button, Stack, Text, Title } from '@mantine/core';

export default function NotFound() {
  return (
    <Stack align="center" justify="center" mt="xl" gap="md">
      <Title order={1} c="dimmed">
        404
      </Title>
      <Text size="lg">Page not found.</Text>
      <Button component={Link} href="/" variant="light">
        Back to home
      </Button>
    </Stack>
  );
}
