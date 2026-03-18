import { useTranslations } from 'next-intl';
import { MultiSelect } from '@mantine/core';
import { useSettings } from '@/contexts/SettingsContext';
import type { Source } from '@/lib/api';

const SOURCE_TYPE_ORDER = ['anime', 'game', 'movie', 'series', 'music'] as const;

type Props = {
  sources: Source[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
};

export function SourcesMultiSelect({ sources, value, onChange, placeholder }: Props) {
  const tTypes = useTranslations('SourceTypes');
  const { sourceTitleLang } = useSettings();

  const toItem = (s: Source) => ({
    value: s.slug,
    label: (sourceTitleLang === 'japanese' ? (s.japanese_title ?? s.title) : s.title) ?? s.slug,
  });

  const data = SOURCE_TYPE_ORDER.flatMap((type) => {
    const items = sources.filter((s) => s.type === type).map(toItem);
    return items.length ? [{ group: tTypes(type), items }] : [];
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
