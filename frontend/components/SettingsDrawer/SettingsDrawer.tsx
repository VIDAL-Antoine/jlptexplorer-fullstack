'use client';

import { Divider, Drawer, SegmentedControl, Stack, Switch, Text } from '@mantine/core';
import { useSettings } from '../../contexts/SettingsContext';

interface SettingsDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ opened, onClose }: SettingsDrawerProps) {
  const {
    speakerNameLang,
    setSpeakerNameLang,
    sourceTitleLang,
    setSourceTitleLang,
    showDialogueTranslations,
    setShowDialogueTranslations,
    showGrammarPointRomaji,
    setShowGrammarPointRomaji,
  } = useSettings();

  return (
    <Drawer opened={opened} onClose={onClose} title="Settings" position="right">
      <Stack gap="lg">
        <div>
          <Text size="sm" fw={500} mb="xs">
            Source titles
          </Text>
          <SegmentedControl
            fullWidth
            value={sourceTitleLang}
            onChange={(v) => setSourceTitleLang(v as 'english' | 'japanese')}
            data={[
              { label: '日本語', value: 'japanese' },
              { label: 'English', value: 'english' },
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
            onChange={(v) => setSpeakerNameLang(v as 'english' | 'japanese')}
            data={[
              { label: '日本語', value: 'japanese' },
              { label: 'English', value: 'english' },
            ]}
          />
        </div>
        <Divider />
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
