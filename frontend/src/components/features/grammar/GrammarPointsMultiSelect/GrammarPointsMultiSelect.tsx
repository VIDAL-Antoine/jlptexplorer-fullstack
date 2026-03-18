import { MultiSelect } from '@mantine/core';
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
    />
  );
}
