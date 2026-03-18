import { Box, Group, MultiSelect, Text } from '@mantine/core';
import { JLPT_LEVEL_COLORS } from '@/constants/jlpt';
import type { GrammarPoint } from '@/lib/api';

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;

type Props = {
  grammarPoints: GrammarPoint[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
};

export function GrammarPointsMultiSelect({ grammarPoints, value, onChange, placeholder }: Props) {
  const toItem = (gp: GrammarPoint) => ({
    value: gp.slug,
    label: [gp.romaji ? `${gp.title} (${gp.romaji})` : gp.title, gp.meaning]
      .filter(Boolean)
      .join(' — '),
  });

  const data = JLPT_LEVELS.flatMap((level) => {
    const items = grammarPoints.filter((gp) => gp.jlpt_level === level).map(toItem);
    return items.length ? [{ group: level, items }] : [];
  });

  const gpBySlug = Object.fromEntries(grammarPoints.map((gp) => [gp.slug, gp]));

  return (
    <MultiSelect
      size="lg"
      placeholder={placeholder}
      data={data}
      value={value}
      onChange={onChange}
      searchable
      clearable
      w="100%"
      renderOption={({ option }) => {
        const gp = gpBySlug[option.value];
        const color = gp
          ? JLPT_LEVEL_COLORS[gp.jlpt_level as keyof typeof JLPT_LEVEL_COLORS]
          : 'gray';
        return (
          <Group gap="xs" wrap="nowrap" w="100%">
            <Box flex="none" w={10} h={10} bdrs={'50%'} bg={`var(--mantine-color-${color}-6)`} />
            <Text>{option.label}</Text>
          </Group>
        );
      }}
    />
  );
}
