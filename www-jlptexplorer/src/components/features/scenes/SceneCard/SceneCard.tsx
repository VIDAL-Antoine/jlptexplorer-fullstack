import { useEffect, useRef, useState } from 'react';
import {
  IconArrowsMaximize,
  IconChevronDown,
  IconChevronUp,
  IconXFilled,
} from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  ActionIcon,
  Anchor,
  AspectRatio,
  Button,
  Card,
  Collapse,
  Group,
  Modal,
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
  onClose?: () => void;
}

export function SceneCard({
  scene,
  currentGrammarPointIds,
  hideSourceInfo = false,
  defaultOpened = false,
  onClose,
}: SceneCardProps) {
  const t = useTranslations('SceneCard');
  const locale = useLocale();
  const [transcriptOpened, { toggle: toggleTranscript }] = useDisclosure(defaultOpened);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
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
    <>
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Card.Section mb="md" pos="relative">
          <AspectRatio ratio={16 / 9}>
            <YoutubePlayer
              ref={playerRef}
              videoId={scene.youtube_video_id}
              startTime={scene.start_time}
              endTime={scene.end_time}
            />
          </AspectRatio>
          <ActionIcon
            variant="filled"
            color="dark"
            size="md"
            pos="absolute"
            top={8}
            right={8}
            visibleFrom="md"
            onClick={onClose ?? openModal}
            aria-label={onClose ? t('close') : t('expand')}
          >
            {onClose ? <IconXFilled size={16} /> : <IconArrowsMaximize size={16} />}
          </ActionIcon>
        </Card.Section>

        {!hideSourceInfo && (
          <Group mb="xs" align="flex-start" justify="space-between" wrap="nowrap">
            <Anchor
              component={Link}
              href={routes.sources.detail(scene.sources.slug)}
              underline="never"
              c="inherit"
            >
              <Title order={4}>{getLocalizedTitle(scene.sources, sourceTitleLang, locale)}</Title>
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
          onClick={toggleTranscript}
          rightSection={
            transcriptOpened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />
          }
          mb="xs"
        >
          {t('transcript')}
        </Button>

        <Collapse in={transcriptOpened}>
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

      <Modal opened={modalOpened} onClose={closeModal} size="xl" withCloseButton={false} centered>
        <SceneCard
          scene={scene}
          currentGrammarPointIds={currentGrammarPointIds}
          hideSourceInfo={hideSourceInfo}
          defaultOpened
          onClose={closeModal}
        />
      </Modal>
    </>
  );
}
