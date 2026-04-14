import { IconExternalLink } from '@tabler/icons-react';
import { Anchor, Badge, Group } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import { Link } from '@/i18n/navigation';
import { type TranscriptLineGrammarPoint } from '@/lib/api';
import { routes } from '@/lib/routes';
import { deduplicateAndSortGrammarPoints } from '@/utils/grammarPoints';

interface GrammarBadgeGroupProps {
  grammarPoints: TranscriptLineGrammarPoint[];
  activeIds: Set<number>;
  onToggle: (id: number) => void;
  script: 'romaji' | 'kana';
}

export function GrammarBadgeGroup({
  grammarPoints,
  activeIds,
  onToggle,
  script,
}: GrammarBadgeGroupProps) {
  if (grammarPoints.length === 0) {
    return null;
  }

  return (
    <Group gap="xs" mt="xs">
      {deduplicateAndSortGrammarPoints(grammarPoints).map((tlgp) => {
        if (!tlgp.grammar_points) {
          return null;
        }
        const isActive = activeIds.has(tlgp.grammar_point_id);
        return (
          <Badge
            key={tlgp.id}
            size="xs"
            color={JLPT_LEVEL_COLORS[tlgp.grammar_points.jlpt_level]}
            variant={isActive ? 'filled' : 'light'}
            tt="lowercase"
            style={{ cursor: 'pointer' }}
            onClick={() => onToggle(tlgp.grammar_point_id)}
            rightSection={
              <Anchor
                component={Link}
                href={routes.grammarPoints.detail(tlgp.grammar_points.slug)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <IconExternalLink size={10} />
              </Anchor>
            }
          >
            {script === 'romaji'
              ? (tlgp.grammar_points.romaji ?? tlgp.grammar_points.title)
              : tlgp.grammar_points.title}
          </Badge>
        );
      })}
    </Group>
  );
}
