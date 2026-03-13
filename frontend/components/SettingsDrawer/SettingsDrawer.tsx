'use client';

import { Divider, Drawer, Select, SegmentedControl, Stack, Switch, Text } from '@mantine/core';
import { useSettings } from '../../contexts/SettingsContext';

const LOCALES = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'fr', label: '🇫🇷 Français' },
];

interface SettingsDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ opened, onClose }: SettingsDrawerProps) {
  const {
    locale,
    setLocale,
    speakerNameLang,
    setSpeakerNameLang,
    sourceTitleLang,
    setSourceTitleLang,
    showDialogueTranslations,
    setShowDialogueTranslations,
    showGrammarPointRomaji,
    setShowGrammarPointRomaji,
    grammarPointTranscriptScript,
    setGrammarPointTranscriptScript,
  } = useSettings();

  return (
    <Drawer opened={opened} onClose={onClose} title="Settings" position="right">
      <Stack gap="lg">
        <div>
          <Text size="sm" fw={500} mb="xs">
            Content language
          </Text>
          <Select
            data={LOCALES}
            value={locale}
            onChange={(v) => v && setLocale(v)}
            allowDeselect={false}
          />
        </div>
        <Divider />
        <div>
          <Text size="sm" fw={500} mb="xs">
            Source titles
          </Text>
          <SegmentedControl
            fullWidth
            value={sourceTitleLang}
            onChange={(v) => setSourceTitleLang(v as 'localized' | 'japanese')}
            data={[
              { label: '日本語', value: 'japanese' },
              { label: 'Localized', value: 'localized' },
            ]}
          />
        </div>
        <div>
          <Text size="sm" fw={500} mb="xs">
            Speaker names
          </Text>
          <SegmentedControl
            fullWidth
            value={speakerNameLang}
            onChange={(v) => setSpeakerNameLang(v as 'localized' | 'japanese')}
            data={[
              { label: '日本語', value: 'japanese' },
              { label: 'Localized', value: 'localized' },
            ]}
          />
        </div>
        <div>
          <Text size="sm" fw={500} mb="xs">
            Grammar point transcript badges
          </Text>
          <SegmentedControl
            fullWidth
            value={grammarPointTranscriptScript}
            onChange={(v) => setGrammarPointTranscriptScript(v as 'romaji' | 'kana')}
            data={[
              { label: 'Romaji', value: 'romaji' },
              { label: 'かな', value: 'kana' },
            ]}
          />
        </div>
        <Switch
          label="Show dialogue translations"
          checked={showDialogueTranslations}
          onChange={(e) => setShowDialogueTranslations(e.currentTarget.checked)}
        />
        <Switch
          label="Show grammar point romaji"
          checked={showGrammarPointRomaji}
          onChange={(e) => setShowGrammarPointRomaji(e.currentTarget.checked)}
        />
      </Stack>
    </Drawer>
  );
}
