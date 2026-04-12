import { AspectRatio, Box, Card, Center, Image, Text } from '@mantine/core';
import { Link } from '@/i18n/navigation';
import { type Source } from '@/lib/api';
import { routes } from '@/lib/routes';
import { getLocalizedTitle } from '@/utils/i18n';
import { getSourceTypeIcon } from '@/utils/icons';

interface SourceCardProps {
  source: Source;
  sourceTitleLang: 'localized' | 'japanese';
}

export function SourceCard({ source, sourceTitleLang }: SourceCardProps) {
  const TypeIcon = getSourceTypeIcon(source.type);

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      component={Link}
      href={routes.sources.detail(source.slug)}
    >
      <Card.Section pos="relative">
        <AspectRatio ratio={2 / 3}>
          <Image
            src={source.cover_image_url}
            alt={source.title ?? ''}
            fit="cover"
            fallbackSrc="https://placehold.co/400x600?text=No+image"
          />
        </AspectRatio>
        <Box pos="absolute" top={6} right={6} bg="rgba(0,0,0,0.5)" w={28} h={28} bdrs="50%">
          <Center w="100%" h="100%">
            <TypeIcon size={16} color="white" />
          </Center>
        </Box>
      </Card.Section>
      <Center w="100%">
        <Text fw={600} size="md" mt="sm">
          {getLocalizedTitle(source, sourceTitleLang)}
        </Text>
      </Center>
    </Card>
  );
}
