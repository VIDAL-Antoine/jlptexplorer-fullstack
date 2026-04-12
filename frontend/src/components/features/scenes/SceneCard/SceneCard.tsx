import { useEffect, useRef, useState } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import {
  Anchor,
  AspectRatio,
  Button,
  Card,
  Collapse,
  Group,
  ScrollArea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  YoutubePlayer,
  type YoutubePlayerHandle,
} from '@/components/features/scenes/YoutubePlayer/YoutubePlayer';
import { useSettings } from '@/contexts/SettingsContext';
import { Link } from '@/i18n/navigation';
import { type SceneWithDetails } from '@/lib/api';
import { routes } from '@/lib/routes';
import { getLocalizedTitle } from '@/utils/i18n';
import { getSourceTypeIcon } from '@/utils/icons';
import { TranscriptLine } from './TranscriptLine';

interface SceneCardProps {
  scene: SceneWithDetails;
  currentGrammarPointIds?: number[];
  hideSourceInfo?: boolean;
  defaultOpened?: boolean;
}

export function SceneCard({
  scene,
  currentGrammarPointIds,
  hideSourceInfo = false,
  defaultOpened = false,
}: SceneCardProps) {
  const t = useTranslations('SceneCard');
  const [opened, { toggle }] = useDisclosure(defaultOpened);
  const [activeIds, setActiveIds] = useState<Set<number>>(
    () => new Set(currentGrammarPointIds ?? [])
  );

  useEffect(() => {
    setActiveIds(new Set(currentGrammarPointIds ?? []));
  }, [currentGrammarPointIds]);

  const toggleGrammarPoint = (id: number) => {
    setActiveIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const {
    speakerNameLang,
    sourceTitleLang,
    showDialogueTranslations,
    grammarPointTranscriptScript,
  } = useSettings();

  const SourceTypeIcon = getSourceTypeIcon(scene.sources.type);
  const playerRef = useRef<YoutubePlayerHandle>(null);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Card.Section mb="md">
        <AspectRatio ratio={16 / 9}>
          <YoutubePlayer
            ref={playerRef}
            videoId={scene.youtube_video_id}
            startTime={scene.start_time}
            endTime={scene.end_time}
          />
        </AspectRatio>
      </Card.Section>

      {!hideSourceInfo && (
        <Group mb="xs" align="flex-start" justify="space-between" wrap="nowrap">
          <Anchor
            component={Link}
            href={routes.sources.detail(scene.sources.slug)}
            underline="never"
            c="inherit"
          >
            <Title order={4}>{getLocalizedTitle(scene.sources, sourceTitleLang)}</Title>
          </Anchor>
          <Anchor
            component={Link}
            href={routes.sources.list(scene.sources.type)}
            mt={4}
            lh={0}
            style={{ flexShrink: 0 }}
          >
            <SourceTypeIcon size={16} color="gray" />
          </Anchor>
        </Group>
      )}

      <Button
        variant="subtle"
        onClick={toggle}
        rightSection={opened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
        mb="xs"
      >
        {t('transcript')}
      </Button>

      <Collapse in={opened}>
        <ScrollArea.Autosize mah={360} type="auto">
          {scene.transcript_lines.map((line) => (
            <TranscriptLine
              key={line.id}
              line={line}
              activeIds={activeIds}
              onToggle={toggleGrammarPoint}
              onSeek={(time) => playerRef.current?.seekTo(time)}
              showDialogueTranslations={showDialogueTranslations}
              speakerNameLang={speakerNameLang}
              script={grammarPointTranscriptScript}
            />
          ))}
        </ScrollArea.Autosize>
      </Collapse>
    </Card>
  );
}
