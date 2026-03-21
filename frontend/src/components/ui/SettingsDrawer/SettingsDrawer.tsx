'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Divider, Drawer, SegmentedControl, Select, Stack, Switch, Text } from '@mantine/core';
import { useSettings } from '@/contexts/SettingsContext';
import { usePathname, useRouter } from '@/i18n/navigation';

const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
];

interface SettingsDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ opened, onClose }: SettingsDrawerProps) {
  const t = useTranslations('SettingsDrawer');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const localizedLabel = LOCALES.find((l) => l.value === locale)?.label ?? locale;

  const {
    speakerNameLang,
    setSpeakerNameLang,
    sourceTitleLang,
    setSourceTitleLang,
    showDialogueTranslations,
    setShowDialogueTranslations,
    grammarPointTranscriptScript,
    setGrammarPointTranscriptScript,
    grammarMatch,
    setGrammarMatch,
  } = useSettings();

  return (
    <Drawer opened={opened} onClose={onClose} title={t('title')} position="right">
      <Stack gap="lg">
        <div>
          <Text size="sm" fw={500} mb="xs">
            {t('contentLanguage')}
          </Text>
          <Select
            data={LOCALES}
            value={locale}
            onChange={(v) => v && router.replace(pathname, { locale: v })}
            allowDeselect={false}
          />
        </div>
        <Divider />
        <div>
          <Text size="sm" fw={500} mb="xs">
            {t('sourceTitles')}
          </Text>
          <SegmentedControl
            fullWidth
            value={sourceTitleLang}
            onChange={(v) => setSourceTitleLang(v as 'localized' | 'japanese')}
            data={[
              { label: '日本語', value: 'japanese' },
              { label: localizedLabel, value: 'localized' },
            ]}
          />
        </div>
        <div>
          <Text size="sm" fw={500} mb="xs">
            {t('speakerNames')}
          </Text>
          <SegmentedControl
            fullWidth
            value={speakerNameLang}
            onChange={(v) => setSpeakerNameLang(v as 'localized' | 'japanese')}
            data={[
              { label: '日本語', value: 'japanese' },
              { label: localizedLabel, value: 'localized' },
            ]}
          />
        </div>
        <div>
          <Text size="sm" fw={500} mb="xs">
            {t('grammarBadges')}
          </Text>
          <SegmentedControl
            fullWidth
            value={grammarPointTranscriptScript}
            onChange={(v) => setGrammarPointTranscriptScript(v as 'romaji' | 'kana')}
            data={[
              { label: 'かな', value: 'kana' },
              { label: 'Romaji', value: 'romaji' },
            ]}
          />
        </div>
        <div>
          <Text size="sm" fw={500} mb={4}>
            {t('grammarFilter')}
          </Text>
          <Text size="xs" c="dimmed" mb="xs">
            {t('grammarFilterDescription')}
          </Text>
          <SegmentedControl
            fullWidth
            value={grammarMatch}
            onChange={(v) => setGrammarMatch(v as 'scene' | 'transcript_line')}
            data={[
              { label: t('grammarFilterScene'), value: 'scene' },
              { label: t('grammarFilterLine'), value: 'transcript_line' },
            ]}
          />
        </div>
        <Switch
          label={t('showDialogueTranslations')}
          checked={showDialogueTranslations}
          onChange={(e) => setShowDialogueTranslations(e.currentTarget.checked)}
        />
      </Stack>
    </Drawer>
  );
}
