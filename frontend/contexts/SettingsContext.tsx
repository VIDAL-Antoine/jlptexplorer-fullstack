'use client';

import { createContext, useContext } from 'react';
import { useLocalStorage } from '@mantine/hooks';

interface SettingsContextValue {
  speakerNameLang: 'localized' | 'japanese';
  setSpeakerNameLang: (v: 'localized' | 'japanese') => void;
  sourceTitleLang: 'localized' | 'japanese';
  setSourceTitleLang: (v: 'localized' | 'japanese') => void;
  showDialogueTranslations: boolean;
  setShowDialogueTranslations: (v: boolean) => void;
  grammarPointTranscriptScript: 'romaji' | 'kana';
  setGrammarPointTranscriptScript: (v: 'romaji' | 'kana') => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [speakerNameLang, setSpeakerNameLang] = useLocalStorage<'localized' | 'japanese'>({
    key: 'setting-speaker-lang',
    defaultValue: 'japanese',
  });
  const [sourceTitleLang, setSourceTitleLang] = useLocalStorage<'localized' | 'japanese'>({
    key: 'setting-source-title-lang',
    defaultValue: 'localized',
  });
  const [showDialogueTranslations, setShowDialogueTranslations] = useLocalStorage({
    key: 'setting-show-dialogue-translations',
    defaultValue: true,
  });
  const [grammarPointTranscriptScript, setGrammarPointTranscriptScript] = useLocalStorage<'romaji' | 'kana'>({
    key: 'setting-grammar-point-script',
    defaultValue: 'kana',
  });

  return (
    <SettingsContext.Provider
      value={{
        speakerNameLang,
        setSpeakerNameLang,
        sourceTitleLang,
        setSourceTitleLang,
        showDialogueTranslations,
        setShowDialogueTranslations,
        grammarPointTranscriptScript,
        setGrammarPointTranscriptScript,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
