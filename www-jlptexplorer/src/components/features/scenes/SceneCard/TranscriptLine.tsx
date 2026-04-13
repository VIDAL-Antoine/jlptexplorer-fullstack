import { Box, Group, Text } from '@mantine/core';
import { AnnotatedText } from '@/components/features/grammar/AnnotatedText/AnnotatedText';
import { GrammarBadgeGroup } from '@/components/features/grammar/GrammarBadgeGroup/GrammarBadgeGroup';
import { type TranscriptLine as TranscriptLineData } from '@/lib/api';
import { getLocalizedName } from '@/utils/i18n';
import { formatTime } from '@/utils/time';

interface TranscriptLineProps {
  line: TranscriptLineData;
  activeIds: Set<number>;
  onToggle: (id: number) => void;
  onSeek: (time: number) => void;
  showDialogueTranslations: boolean;
  speakerNameLang: 'localized' | 'japanese';
  script: 'romaji' | 'kana';
}

export function TranscriptLine({
  line,
  activeIds,
  onToggle,
  onSeek,
  showDialogueTranslations,
  speakerNameLang,
  script,
}: TranscriptLineProps) {
  const grammarPoints = line.transcript_line_grammar_points;
  const hasGrammar =
    activeIds.size > 0 && grammarPoints.some((tlgp) => activeIds.has(tlgp.grammar_point_id));

  return (
    <Box
      p="xs"
      bdrs="var(--mantine-radius-sm)"
      bg={
        hasGrammar
          ? 'light-dark(var(--mantine-color-yellow-0), rgba(255, 212, 59, 0.08))'
          : undefined
      }
      style={hasGrammar ? { borderLeft: '3px solid var(--mantine-color-yellow-5)' } : undefined}
    >
      <Group gap="xs" align="baseline" mb={2}>
        {line.start_time !== null && line.start_time !== undefined && (
          <Text
            size="xs"
            c="dimmed"
            ff="monospace"
            style={{ cursor: 'pointer', flexShrink: 0 }}
            onClick={() => onSeek(line.start_time!)}
          >
            {formatTime(line.start_time)}
          </Text>
        )}
        {line.speakers && (
          <Text size="xs" fw={700} c="dimmed">
            {getLocalizedName(line.speakers, speakerNameLang)}
          </Text>
        )}
      </Group>
      <Text size="md" fw={hasGrammar ? 600 : 400} lang="ja">
        <AnnotatedText
          text={line.japanese_text}
          annotations={line.transcript_line_grammar_points}
          currentGrammarPointIds={Array.from(activeIds)}
          script={script}
        />
      </Text>
      {showDialogueTranslations && line.translation && (
        <Text size="sm" c="dimmed" mt={2}>
          {line.translation}
        </Text>
      )}
      <GrammarBadgeGroup
        grammarPoints={grammarPoints}
        activeIds={activeIds}
        onToggle={onToggle}
        script={script}
      />
    </Box>
  );
}
