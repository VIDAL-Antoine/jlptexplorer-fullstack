'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Group, MultiSelect } from '@mantine/core';
import { useSettings } from '@/contexts/SettingsContext';
import type { Source } from '@/lib/api';
import { getLocalizedTitle } from '@/utils/i18n';
import { getSourceTypeIcon } from '@/utils/icons';

const SOURCE_TYPE_ORDER = ['anime', 'game', 'movie', 'series', 'music'] as const;

type Props = {
  sources: Source[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
};

export function SourcesMultiSelect({ sources, value, onChange, placeholder }: Props) {
  const tTypes = useTranslations('SourceTypes');
  const locale = useLocale();
  const { sourceTitleLang } = useSettings();

  const slugToType = Object.fromEntries(sources.map((s) => [s.slug, s.type]));

  const toItem = (s: Source) => ({
    value: s.slug,
    label: getLocalizedTitle(s, sourceTitleLang, locale) ?? s.slug,
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
      maxDropdownHeight={640}
      renderOption={({ option }) => {
        const Icon = getSourceTypeIcon(slugToType[option.value] as Source['type']);
        return (
          <Group gap="xs">
            <Icon size={16} color="var(--mantine-color-dimmed)" />
            {option.label}
          </Group>
        );
      }}
    />
  );
}
